import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { surveys } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ shortCode: string }> }
) {
  try {
    const { shortCode } = await params;

    // Get survey with questions (public endpoint, no auth required)
    const survey = await db.query.surveys.findFirst({
      where: eq(surveys.shortCode, shortCode),
      with: {
        questions: {
          orderBy: (questions, { asc }) => [asc(questions.orderIndex)],
        },
        tenant: {
          columns: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!survey) {
      return NextResponse.json(
        { error: "Survey not found" },
        { status: 404 }
      );
    }

    if (survey.status !== "active") {
      return NextResponse.json(
        { error: "Survey is not active" },
        { status: 403 }
      );
    }

    // Transform questions for API response
    const questions = survey.questions.map((q) => ({
      id: q.id,
      text: q.questionText,
      type: q.questionType,
      options: q.options ? JSON.parse(q.options as string) : null,
      required: q.required,
      order: q.orderIndex,
    }));

    return NextResponse.json({
      survey: {
        id: survey.id,
        title: survey.title,
        description: survey.description,
        welcomeMessage: survey.welcomeMessage,
        thankYouMessage: survey.thankYouMessage,
        tenantId: survey.tenantId,
        tenantName: survey.tenant.name,
        questions,
      },
    });
  } catch (error) {
    console.error("Error fetching public survey:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
