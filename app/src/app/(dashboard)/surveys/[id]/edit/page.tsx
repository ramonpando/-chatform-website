import { auth } from "@/lib/auth/config";
import { db } from "@/lib/db";
import { surveys } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { redirect, notFound } from "next/navigation";
import { SurveyEditor } from "@/components/surveys/survey-editor";

export default async function EditSurveyPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  // Get survey with questions
  const survey = await db.query.surveys.findFirst({
    where: and(
      eq(surveys.id, params.id),
      eq(surveys.tenantId, session.user.tenantId)
    ),
    with: {
      questions: {
        orderBy: (questions, { asc }) => [asc(questions.orderIndex)],
      },
    },
  });

  if (!survey) {
    notFound();
  }

  // Transform questions to match editor format
  const questions = survey.questions.map((q, index) => ({
    id: q.id,
    type: q.questionType as "multiple_choice" | "rating" | "open_text",
    text: q.questionText,
    options: q.options ? JSON.parse(q.options as string) : undefined,
    order: index,
  }));

  return (
    <SurveyEditor
      mode="edit"
      surveyId={survey.id}
      initialTitle={survey.title}
      initialDescription={survey.description || ""}
      initialStatus={survey.status as any}
      initialQuestions={questions}
    />
  );
}
