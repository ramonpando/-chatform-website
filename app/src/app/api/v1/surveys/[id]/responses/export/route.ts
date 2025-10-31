import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { responses, surveySessions, surveys } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { hashApiKey, verifyApiKey } from "@/lib/security/api-keys";
import { ReadableStream } from "stream/web";

type Params = Promise<{ id: string }>;

interface CsvRow {
  sessionId: string;
  question: string;
  questionType: string;
  answer: string;
  answeredAt: Date;
  respondent: string | null;
}

function toCsv(rows: CsvRow[]): string {
  const header = [
    "session_id",
    "question",
    "question_type",
    "answer",
    "answered_at",
    "respondent",
  ];

  const escape = (value: string) => {
    if (value.includes("\"")) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    if (value.includes(",") || value.includes("\n")) {
      return `"${value}"`;
    }
    return value;
  };

  const lines = rows.map((row) =>
    [
      row.sessionId,
      row.question,
      row.questionType,
      row.answer,
      row.answeredAt.toISOString(),
      row.respondent ?? "",
    ].map((value) => escape(value)).join(",")
  );

  return [header.join(","), ...lines].join("\n");
}

export async function GET(
  req: Request,
  { params }: { params: Params }
) {
  try {
    const { id: surveyId } = await params;

    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "unauthorized", message: "Missing or invalid API key" },
        { status: 401 }
      );
    }

    const apiKey = authHeader.replace("Bearer ", "").trim();
    if (!apiKey) {
      return NextResponse.json(
        { error: "unauthorized", message: "Invalid API key" },
        { status: 401 }
      );
    }

    const survey = await db.query.surveys.findFirst({
      where: eq(surveys.id, surveyId),
      with: {
        tenant: true,
        questions: true,
      },
    });

    if (!survey) {
      return NextResponse.json(
        { error: "not_found", message: "Survey not found" },
        { status: 404 }
      );
    }

    const tenant = survey.tenant;

    if (!tenant.apiKeyHash) {
      return NextResponse.json(
        { error: "unauthorized", message: "API access not enabled for this account" },
        { status: 401 }
      );
    }

    if (tenant.apiKeyPrefix && !apiKey.startsWith(tenant.apiKeyPrefix)) {
      return NextResponse.json(
        { error: "unauthorized", message: "API key does not belong to this tenant" },
        { status: 401 }
      );
    }

    if (!verifyApiKey(apiKey, tenant.apiKeyHash)) {
      return NextResponse.json(
        { error: "unauthorized", message: "Invalid API key" },
        { status: 401 }
      );
    }

    const sessions = await db.query.surveySessions.findMany({
      where: and(
        eq(surveySessions.surveyId, surveyId),
        eq(surveySessions.status, "completed")
      ),
      with: {
        responses: {
          with: {
            question: true,
          },
        },
      },
    });

    const rows: CsvRow[] = [];
    for (const session of sessions) {
      for (const response of session.responses) {
        const answer = response.answerText
          ?? response.answerOption
          ?? (response.answerRating !== null && response.answerRating !== undefined
            ? String(response.answerRating)
            : "");

        rows.push({
          sessionId: session.id,
          question: response.question?.questionText ?? "",
          questionType: response.question?.questionType ?? "",
          answer,
          answeredAt: response.createdAt,
          respondent: session.phoneNumber,
        });
      }
    }

    const csv = toCsv(rows);

    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(new TextEncoder().encode(csv));
        controller.close();
      },
    });

    return new NextResponse(stream, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="survey-${survey.shortCode}-responses.csv"`,
      },
    });

  } catch (error) {
    console.error("Error exporting CSV:", error);
    return NextResponse.json(
      { error: "internal_error", message: "Internal server error" },
      { status: 500 }
    );
  }
}
