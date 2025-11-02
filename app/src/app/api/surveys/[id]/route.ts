import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { db } from "@/lib/db";
import { surveys, questions } from "@/lib/db/schema";
import { eq, and, inArray } from "drizzle-orm";
import { z } from "zod";
import { requirePermission } from "@/lib/auth/rbac";

const QUESTION_TYPES = ["multiple_choice", "rating", "open_text", "yes_no", "email", "phone", "short_text", "number"] as const;

const questionSchema = z.object({
  id: z.string().optional(), // Optional porque puede ser nueva pregunta
  type: z.enum(QUESTION_TYPES),
  text: z.string().min(1, "El texto de la pregunta es requerido"),
  options: z.array(z.string()).optional(),
  order: z.number(),
  required: z.boolean().optional(),
  validateEmail: z.boolean().optional(),
  isNew: z.boolean().optional(),
  isDeleted: z.boolean().optional(),
});

const updateSurveySchema = z.object({
  title: z.string().min(1, "El título es requerido"),
  description: z.string().optional(),
  status: z.enum(["draft", "active", "paused", "archived"]),
  welcomeMessage: z.string().optional(),
  thankYouMessage: z.string().optional(),
  questions: z.array(questionSchema).min(1, "Agrega al menos una pregunta"),
});

function serializeQuestionOptions(question: z.infer<typeof questionSchema>) {
  if (question.type === "multiple_choice") {
    const choices = (question.options && question.options.length > 0)
      ? question.options
      : ["Opción 1", "Opción 2"];
    return JSON.stringify(choices);
  }

  if (question.type === "yes_no") {
    const choices = question.options && question.options.length === 2
      ? question.options
      : ["Sí", "No"];
    return JSON.stringify(choices);
  }

  if (question.type === "email") {
    return JSON.stringify({
      validateEmail: question.validateEmail !== undefined ? question.validateEmail : true,
    });
  }

  return null;
}

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

    // Check permission to update surveys
    try {
      await requirePermission(session.user.id, session.user.tenantId, "survey:update");
    } catch (error) {
      return NextResponse.json(
        { error: "No tienes permiso para editar encuestas" },
        { status: 403 }
      );
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

    const {
      title,
      description,
      status,
      welcomeMessage,
      thankYouMessage,
      questions: questionsData,
    } = validation.data;

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
          welcomeMessage: welcomeMessage || null,
          thankYouMessage: thankYouMessage || null,
          status,
          updatedAt: new Date(),
        })
        .where(eq(surveys.id, id))
        .returning();

      const existingQuestions = await tx.query.questions.findMany({
        where: eq(questions.surveyId, id),
      });

      const existingMap = new Map(existingQuestions.map((q) => [q.id, q]));
      const activeQuestions = questionsData.filter((q) => !q.isDeleted);
      const activeIds = new Set(
        activeQuestions
          .map((q) => q.id)
          .filter((value): value is string => Boolean(value))
      );

      const questionsToDelete = existingQuestions
        .filter((question) => !activeIds.has(question.id))
        .map((question) => question.id);

      if (questionsToDelete.length > 0) {
        await tx
          .delete(questions)
          .where(
            and(
              eq(questions.surveyId, id),
              inArray(questions.id, questionsToDelete)
            )
          );
      }

      const upsertedQuestions: typeof existingQuestions = [];

      for (const question of activeQuestions) {
        const payload = {
          questionType: question.type,
          questionText: question.text,
          options: serializeQuestionOptions(question),
          orderIndex: question.order,
          required: question.required ?? true,
          updatedAt: new Date(),
        };

        if (question.id && existingMap.has(question.id)) {
          const [updated] = await tx
            .update(questions)
            .set(payload)
            .where(eq(questions.id, question.id))
            .returning();
          if (updated) {
            upsertedQuestions.push(updated);
          }
        } else {
          const [created] = await tx
            .insert(questions)
            .values({
              surveyId: id,
              questionType: question.type,
              questionText: question.text,
              options: payload.options,
              orderIndex: question.order,
              required: payload.required,
            })
            .returning();
          if (created) {
            upsertedQuestions.push(created);
          }
        }
      }

      return { survey: updatedSurvey, questions: upsertedQuestions };
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

    // Check permission to delete surveys
    try {
      await requirePermission(session.user.id, session.user.tenantId, "survey:delete");
    } catch (error) {
      return NextResponse.json(
        { error: "No tienes permiso para eliminar encuestas" },
        { status: 403 }
      );
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
