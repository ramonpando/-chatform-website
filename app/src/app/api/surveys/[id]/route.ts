import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { db } from "@/lib/db";
import { surveys, questions } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { z } from "zod";

const questionSchema = z.object({
  id: z.string().optional(), // Optional porque puede ser nueva pregunta
  type: z.enum(["multiple_choice", "rating", "open_text"]),
  text: z.string().min(1, "El texto de la pregunta es requerido"),
  options: z.array(z.string()).optional(),
  order: z.number(),
  isNew: z.boolean().optional(),
  isDeleted: z.boolean().optional(),
});

const updateSurveySchema = z.object({
  title: z.string().min(1, "El título es requerido"),
  description: z.string().optional(),
  status: z.enum(["draft", "active", "paused", "archived"]),
  questions: z.array(questionSchema).min(1, "Agrega al menos una pregunta"),
});

// GET - Obtener una encuesta específica
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const survey = await db.query.surveys.findFirst({
      where: and(
        eq(surveys.id, id),
        eq(surveys.tenantId, session.user.tenantId)
      ),
      with: {
        questions: {
          orderBy: (questions, { asc }) => [asc(questions.orderIndex)],
        },
      },
    });

    if (!survey) {
      return NextResponse.json(
        { error: "Encuesta no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json({ survey });
  } catch (error) {
    console.error("Error fetching survey:", error);
    return NextResponse.json(
      { error: "Error al obtener la encuesta" },
      { status: 500 }
    );
  }
}

// PUT - Actualizar una encuesta
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const body = await req.json();

    // Validate input
    const validation = updateSurveySchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const { title, description, status, questions: questionsData } =
      validation.data;

    // Verify survey belongs to user's tenant
    const existingSurvey = await db.query.surveys.findFirst({
      where: and(
        eq(surveys.id, id),
        eq(surveys.tenantId, session.user.tenantId)
      ),
    });

    if (!existingSurvey) {
      return NextResponse.json(
        { error: "Encuesta no encontrada" },
        { status: 404 }
      );
    }

    // Update survey and questions in transaction
    const result = await db.transaction(async (tx) => {
      // Update survey
      const [updatedSurvey] = await tx
        .update(surveys)
        .set({
          title,
          description: description || null,
          status,
          updatedAt: new Date(),
        })
        .where(eq(surveys.id, id))
        .returning();

      // Handle questions
      // 1. Delete questions marked as deleted
      const deletedQuestionIds = questionsData
        .filter((q) => q.isDeleted && q.id)
        .map((q) => q.id as string);

      if (deletedQuestionIds.length > 0) {
        await tx
          .delete(questions)
          .where(
            and(
              eq(questions.surveyId, id),
              // @ts-ignore - Drizzle typing issue
              eq(questions.id, deletedQuestionIds[0])
            )
          );
      }

      // 2. Update existing questions and create new ones
      const updatedQuestions = await Promise.all(
        questionsData
          .filter((q) => !q.isDeleted)
          .map(async (q) => {
            if (q.id && !q.isNew) {
              // Update existing question
              const [updated] = await tx
                .update(questions)
                .set({
                  questionType: q.type,
                  questionText: q.text,
                  options: q.options ? JSON.stringify(q.options) : null,
                  orderIndex: q.order,
                  updatedAt: new Date(),
                })
                .where(eq(questions.id, q.id))
                .returning();
              return updated;
            } else {
              // Create new question
              const [created] = await tx
                .insert(questions)
                .values({
                  surveyId: id,
                  questionType: q.type,
                  questionText: q.text,
                  options: q.options ? JSON.stringify(q.options) : null,
                  orderIndex: q.order,
                })
                .returning();
              return created;
            }
          })
      );

      return { survey: updatedSurvey, questions: updatedQuestions };
    });

    return NextResponse.json({
      success: true,
      survey: result.survey,
      questions: result.questions,
    });
  } catch (error) {
    console.error("Error updating survey:", error);
    return NextResponse.json(
      { error: "Error al actualizar la encuesta" },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar una encuesta
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    // Verify survey belongs to user's tenant
    const existingSurvey = await db.query.surveys.findFirst({
      where: and(
        eq(surveys.id, id),
        eq(surveys.tenantId, session.user.tenantId)
      ),
    });

    if (!existingSurvey) {
      return NextResponse.json(
        { error: "Encuesta no encontrada" },
        { status: 404 }
      );
    }

    // Delete survey (cascade will delete questions)
    await db.delete(surveys).where(eq(surveys.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting survey:", error);
    return NextResponse.json(
      { error: "Error al eliminar la encuesta" },
      { status: 500 }
    );
  }
}
