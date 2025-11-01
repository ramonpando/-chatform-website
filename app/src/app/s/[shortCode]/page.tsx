import { db } from "@/lib/db";
import { surveys, surveyViews } from "@/lib/db/schema";
import { eq, and, gte, sql } from "drizzle-orm";
import { notFound } from "next/navigation";
import { PublicSurveyPage } from "@/components/surveys/public-survey-page";
import { getVisitorInfo } from "@/lib/utils/tracking";

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

  // Track view with deduplication (fire and forget)
  (async () => {
    try {
      const visitor = await getVisitorInfo();

      // Solo trackear si no es un bot
      if (!visitor.isBot) {
        // Verificar si ya existe una vista de esta IP/fingerprint en las últimas 24 horas
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

        const existingView = await db.query.surveyViews.findFirst({
          where: and(
            eq(surveyViews.surveyId, survey.id),
            eq(surveyViews.fingerprint, visitor.fingerprint),
            gte(surveyViews.viewedAt, twentyFourHoursAgo)
          ),
        });

        // Solo registrar si no existe una vista reciente
        if (!existingView) {
          // Insertar vista
          await db.insert(surveyViews).values({
            surveyId: survey.id,
            ipAddress: visitor.ip,
            userAgent: visitor.userAgent,
            fingerprint: visitor.fingerprint,
            referrer: visitor.referrer,
            isBot: false,
          });

          // Actualizar contador
          await db.update(surveys)
            .set({ viewCount: sql`${surveys.viewCount} + 1` })
            .where(eq(surveys.id, survey.id));
        }
      }
    } catch (error) {
      console.error('Error tracking view:', error);
    }
  })();

  // Generate WhatsApp link
  const whatsappNumber = process.env.TWILIO_WHATSAPP_NUMBER || "whatsapp:+14155238886";
  const cleanNumber = whatsappNumber.replace(/whatsapp:/g, "").replace(/\+/g, "");
  const startMessage = `START_${shortCode}`;
  const waLink = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(startMessage)}`;

  // Calculate estimated time
  const estimatedTime = Math.max(1, Math.ceil(survey.questions.length * 0.5));

  // Map questions to proper format
  const formattedQuestions = survey.questions.map((q) => ({
    id: q.id,
    questionText: q.questionText,
    questionType: q.questionType,
    options: typeof q.options === 'string' ? q.options : (q.options as string | null),
  }));

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
        questions: formattedQuestions,
      }}
      waLink={waLink}
      estimatedTime={estimatedTime}
    />
  );
}
