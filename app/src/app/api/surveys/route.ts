import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { db } from "@/lib/db";
import { surveys, questions } from "@/lib/db/schema";
import { nanoid } from "nanoid";
import { z } from "zod";
import { requirePermission } from "@/lib/auth/rbac";

const QUESTION_TYPES = ["multiple_choice", "rating", "open_text", "yes_no", "email", "phone", "short_text", "number"] as const;

const questionSchema = z.object({
  id: z.string(),
  type: z.enum(QUESTION_TYPES),
  text: z.string().min(1, "El texto de la pregunta es requerido"),
  options: z.array(z.string()).optional(),
  order: z.number(),
  required: z.boolean().optional(),
  validateEmail: z.boolean().optional(),
});

const createSurveySchema = z.object({
  title: z.string().min(1, "El título es requerido"),
  description: z.string().optional(),
  status: z.enum(["draft", "active"]),
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

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    // Check permission to create surveys
    try {
      await requirePermission(session.user.id, session.user.tenantId, "survey:create");
    } catch (error) {
      return NextResponse.json(
        { error: "No tienes permiso para crear encuestas" },
        { status: 403 }
      );
    }

    const body = await req.json();

    // Validate input
    const validation = createSurveySchema.safeParse(body);
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
          createdBy: session.user.id,
          title,
          description: description || null,
          welcomeMessage: welcomeMessage || null,
          thankYouMessage: thankYouMessage || null,
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
              options: serializeQuestionOptions(q),
              orderIndex: q.order,
              required: q.required ?? true,
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
