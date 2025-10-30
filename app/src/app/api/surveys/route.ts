import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { db } from "@/lib/db";
import { surveys, questions } from "@/lib/db/schema";
import { nanoid } from "nanoid";
import { z } from "zod";

const questionSchema = z.object({
  id: z.string(),
  type: z.enum(["multiple_choice", "rating", "open_text"]),
  text: z.string().min(1, "El texto de la pregunta es requerido"),
  options: z.array(z.string()).optional(),
  order: z.number(),
});

const createSurveySchema = z.object({
  title: z.string().min(1, "El título es requerido"),
  description: z.string().optional(),
  status: z.enum(["draft", "active"]),
  questions: z.array(questionSchema).min(1, "Agrega al menos una pregunta"),
});

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const body = await req.json();

    // Validate input
    const validation = createSurveySchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const { title, description, status, questions: questionsData } = validation.data;

    // Check survey limit
    const existingSurveys = await db.query.surveys.findMany({
      where: (surveys, { eq }) => eq(surveys.tenantId, session.user.tenantId),
    });

    const tenant = await db.query.tenants.findFirst({
      where: (tenants, { eq }) => eq(tenants.id, session.user.tenantId),
    });

    if (existingSurveys.length >= (tenant?.surveysLimit || 1)) {
      return NextResponse.json(
        { error: "Has alcanzado el límite de encuestas para tu plan" },
        { status: 403 }
      );
    }

    // Generate short code
    const shortCode = nanoid(8);

    // Create survey and questions in transaction
    const result = await db.transaction(async (tx) => {
      // Create survey
      const [survey] = await tx
        .insert(surveys)
        .values({
          tenantId: session.user.tenantId,
          title,
          description: description || null,
          status,
          shortCode,
        })
        .returning();

      // Create questions
      const createdQuestions = await Promise.all(
        questionsData.map((q) =>
          tx
            .insert(questions)
            .values({
              surveyId: survey.id,
              questionType: q.type,
              questionText: q.text,
              options: q.options ? JSON.stringify(q.options) : null,
              orderIndex: q.order,
            })
            .returning()
        )
      );

      return { survey, questions: createdQuestions };
    });

    return NextResponse.json({
      success: true,
      survey: result.survey,
      questions: result.questions,
    });
  } catch (error) {
    console.error("Error creating survey:", error);
    return NextResponse.json(
      { error: "Error al crear la encuesta" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    // Get all surveys for tenant
    const userSurveys = await db.query.surveys.findMany({
      where: (surveys, { eq }) => eq(surveys.tenantId, session.user.tenantId),
      with: {
        questions: {
          orderBy: (questions, { asc }) => [asc(questions.orderIndex)],
        },
      },
      orderBy: (surveys, { desc }) => [desc(surveys.createdAt)],
    });

    return NextResponse.json({ surveys: userSurveys });
  } catch (error) {
    console.error("Error fetching surveys:", error);
    return NextResponse.json(
      { error: "Error al obtener encuestas" },
      { status: 500 }
    );
  }
}
