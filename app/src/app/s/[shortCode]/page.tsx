import { db } from "@/lib/db";
import { surveys } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { MessageCircle, Sparkles } from "lucide-react";

export default async function PublicSurveyPage({
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
  // TODO: Replace with actual WhatsApp Business number from tenant
  const whatsappNumber = process.env.TWILIO_WHATSAPP_NUMBER || "+14155238886"; // Twilio sandbox default
  const startMessage = `START_${shortCode}`;
  const waLink = `https://wa.me/${whatsappNumber.replace(/\+/g, "")}?text=${encodeURIComponent(startMessage)}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-8 py-6 text-white">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <MessageCircle className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">{survey.title}</h1>
                {survey.description && (
                  <p className="text-blue-100 text-sm mt-1">{survey.description}</p>
                )}
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="px-8 py-8">
            {/* Welcome Message */}
            {survey.welcomeMessage && (
              <div className="mb-8 p-6 bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100 rounded-xl">
                <p className="text-slate-900 leading-relaxed">{survey.welcomeMessage}</p>
              </div>
            )}

            {/* Preview Questions */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-600" />
                Lo que te preguntaremos:
              </h3>
              <div className="space-y-3">
                {survey.questions.map((question, index) => (
                  <div
                    key={question.id}
                    className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-all"
                  >
                    <div className="flex-shrink-0 w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-slate-900 font-medium">{question.questionText}</p>
                      {question.questionType === "rating" && (
                        <p className="text-sm text-slate-500 mt-1">Calificación del 1 al 10</p>
                      )}
                      {question.questionType === "multiple_choice" && question.options ? (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {(JSON.parse(question.options as string) as string[]).map((opt, i) => (
                            <span
                              key={i}
                              className="text-xs px-2 py-1 bg-white border border-slate-200 rounded-full text-slate-600"
                            >
                              {opt}
                            </span>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Time Estimate */}
            <div className="mb-8 p-4 bg-slate-50 border border-slate-200 rounded-lg">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">⏱️ Tiempo estimado:</span>
                <span className="font-semibold text-slate-900">
                  ~{Math.ceil(survey.questions.length * 0.5)} minutos
                </span>
              </div>
              <div className="flex items-center justify-between text-sm mt-2">
                <span className="text-slate-600">📊 Preguntas:</span>
                <span className="font-semibold text-slate-900">{survey.questions.length}</span>
              </div>
            </div>

            {/* CTA - Open WhatsApp */}
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl opacity-75 blur-lg"></div>

              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="relative block w-full py-5 px-6 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <div className="flex items-center justify-center gap-3">
                  <svg
                    className="w-7 h-7"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                  <span>Responder en WhatsApp</span>
                </div>
              </a>
            </div>

            {/* Info below button */}
            <p className="text-center text-sm text-slate-500 mt-4">
              ✓ Conversación privada y segura
              <span className="mx-2">•</span>
              ✓ Responde a tu ritmo
              <span className="mx-2">•</span>
              ✓ 100% confidencial
            </p>
          </div>

          {/* Footer */}
          <div className="px-8 py-4 bg-slate-50 border-t border-slate-200 text-center">
            <p className="text-xs text-slate-500">
              Encuesta creada con{" "}
              <a
                href="https://chatform.mx"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 font-semibold hover:underline"
              >
                ChatForm
              </a>
              {" "}- Encuestas conversacionales por WhatsApp
            </p>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-6 grid grid-cols-3 gap-4 text-center">
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 border border-slate-200">
            <div className="text-2xl font-bold text-blue-600">{survey.responseCount}</div>
            <div className="text-xs text-slate-600 mt-1">Respuestas</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 border border-slate-200">
            <div className="text-2xl font-bold text-green-600">~2 min</div>
            <div className="text-xs text-slate-600 mt-1">Duración</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 border border-slate-200">
            <div className="text-2xl font-bold text-purple-600">100%</div>
            <div className="text-xs text-slate-600 mt-1">Privado</div>
          </div>
        </div>
      </div>
    </div>
  );
}
