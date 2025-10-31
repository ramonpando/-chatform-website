import { db } from "@/lib/db";
import { surveys } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { PublicSurveyPage } from "@/components/surveys/public-survey-page";

export default async function PublicSurveyPageRoute({
  params,
}: {
  params: Promise<{ shortCode: string }>;
}) {
  const { shortCode } = await params;

  // Get survey with questions
  const survey = await db.query.surveys.findFirst({
    where: eq(surveys.shortCode, shortCode),
    with: {
      questions: {
        orderBy: (questions, { asc }) => [asc(questions.orderIndex)],
      },
      tenant: true,
    },
  });

  if (!survey || survey.status !== "active") {
    notFound();
  }

  // Increment view count (fire and forget)
  db.update(surveys)
    .set({ viewCount: survey.viewCount + 1 })
    .where(eq(surveys.id, survey.id))
    .then(() => {})
    .catch(() => {});

  // Generate WhatsApp link
  const whatsappNumber = process.env.TWILIO_WHATSAPP_NUMBER || "whatsapp:+14155238886";
  const cleanNumber = whatsappNumber.replace(/whatsapp:/g, "").replace(/\+/g, "");
  const startMessage = `START_${shortCode}`;
  const waLink = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(startMessage)}`;

  // Calculate estimated time
  const estimatedTime = Math.max(1, Math.ceil(survey.questions.length * 0.5));

  return (
    <PublicSurveyPage
      survey={{
        title: survey.title,
        description: survey.description,
        welcomeMessage: survey.welcomeMessage,
        brandColor: survey.brandColor,
        accentColor: survey.accentColor,
        logoUrl: survey.logoUrl,
        responseCount: survey.responseCount,
        questions: survey.questions,
      }}
      waLink={waLink}
      estimatedTime={estimatedTime}
    />
  );
}
