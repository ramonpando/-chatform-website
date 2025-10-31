import { auth } from "@/lib/auth/config";
import { db } from "@/lib/db";
import { surveys } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { redirect, notFound } from "next/navigation";
import { FormBuilderV2, Question as BuilderQuestion, QuestionType } from "@/components/surveys/form-builder-v2";

export default async function EditSurveyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

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
    notFound();
  }

  const builderQuestions: BuilderQuestion[] = survey.questions.map((q, index) => {
    let options: string[] | undefined;
    let validateEmail: boolean | undefined;

    if (q.options) {
      try {
        const parsed = JSON.parse(q.options as string);

        if (q.questionType === "multiple_choice" || q.questionType === "yes_no") {
          if (Array.isArray(parsed)) {
            options = parsed as string[];
          }
        }

        if (q.questionType === "email" && parsed && typeof parsed === "object") {
          validateEmail = Boolean((parsed as { validateEmail?: boolean }).validateEmail ?? true);
        }
      } catch (error) {
        console.error("Error parsing question options", error);
      }
    }

    if (q.questionType === "yes_no" && (!options || options.length !== 2)) {
      options = ["Sí", "No"];
    }

    if (q.questionType === "multiple_choice" && (!options || options.length === 0)) {
      options = ["Opción 1", "Opción 2"];
    }

    if (q.questionType === "email" && validateEmail === undefined) {
      validateEmail = true;
    }

    return {
      id: q.id,
      type: q.questionType as QuestionType,
      text: q.questionText,
      options,
      required: q.required ?? true,
      validateEmail,
      order: index,
    };
  });

  return (
    <FormBuilderV2
      mode="edit"
      surveyId={survey.id}
      initialTitle={survey.title}
      initialDescription={survey.description || ""}
      initialWelcomeMessage={survey.welcomeMessage || ""}
      initialThankYouMessage={survey.thankYouMessage || ""}
      initialQuestions={builderQuestions}
      initialStatus={survey.status as any}
      initialBrandColor={survey.brandColor || "#2563eb"}
      initialAccentColor={survey.accentColor || "#06b6d4"}
      initialLogoUrl={survey.logoUrl || ""}
    />
  );
}
