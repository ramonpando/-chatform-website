import { auth } from "@/lib/auth/config";
import { db } from "@/lib/db";
import { surveys, surveySessions } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id } = await context.params;

    // Get survey with questions
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
      return new NextResponse("Survey not found", { status: 404 });
    }

    // Get all completed sessions with responses
    const sessions = await db.query.surveySessions.findMany({
      where: and(
        eq(surveySessions.surveyId, id),
        eq(surveySessions.status, "completed")
      ),
      with: {
        responses: {
          with: {
            question: true,
          },
        },
      },
      orderBy: (sessions, { desc }) => [desc(sessions.completedAt)],
    });

    if (sessions.length === 0) {
      return new NextResponse("No responses to export", { status: 400 });
    }

    // Build CSV header
    const headers = [
      "Session ID",
      "Completed At",
      "Completion Time (seconds)",
      ...survey.questions.map((q) => q.questionText),
    ];

    // Build CSV rows
    const rows = sessions.map((session) => {
      const completionTime =
        session.startedAt && session.completedAt
          ? Math.round(
              (new Date(session.completedAt).getTime() -
                new Date(session.startedAt).getTime()) /
                1000
            )
          : "N/A";

      const answers = survey.questions.map((question) => {
        const response = session.responses.find(
          (r) => r.questionId === question.id
        );

        if (!response) return "";

        // Format answer based on type
        if (response.answerText) {
          // Escape quotes and wrap in quotes if contains comma/newline
          const text = response.answerText.replace(/"/g, '""');
          return text.includes(",") || text.includes("\n")
            ? `"${text}"`
            : text;
        }

        if (response.answerOption) return response.answerOption;
        if (response.answerRating) return response.answerRating.toString();

        return "";
      });

      return [
        session.id,
        session.completedAt
          ? new Date(session.completedAt).toISOString()
          : "N/A",
        completionTime.toString(),
        ...answers,
      ];
    });

    // Convert to CSV format
    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    // Return CSV file
    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="survey-${survey.title.replace(/[^a-z0-9]/gi, "-").toLowerCase()}-${new Date().toISOString().split("T")[0]}.csv"`,
      },
    });
  } catch (error) {
    console.error("CSV Export Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
