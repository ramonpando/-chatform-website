"use client";

import { MessageCircle, Sparkles, Check, Clock, Shield } from "lucide-react";

interface Question {
  id: string;
  questionText: string;
  questionType: string;
  options: string | null;
}

interface PublicSurveyPageProps {
  survey: {
    title: string;
    description: string | null;
    welcomeMessage: string | null;
    brandColor: string | null;
    accentColor: string | null;
    logoUrl: string | null;
    responseCount: number;
    questions: Question[];
  };
  waLink: string;
  estimatedTime: number;
}

export function PublicSurveyPage({ survey, waLink, estimatedTime }: PublicSurveyPageProps) {
  const brandColor = survey.brandColor || "#2563eb";
  const accentColor = survey.accentColor || "#06b6d4";

  // Helper to lighten color for backgrounds
  const lightenColor = (hex: string, percent: number) => {
    const num = parseInt(hex.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = ((num >> 8) & 0x00ff) + amt;
    const B = (num & 0x0000ff) + amt;
    return (
      "#" +
      (
        0x1000000 +
        (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
        (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
        (B < 255 ? (B < 1 ? 0 : B) : 255)
      )
        .toString(16)
        .slice(1)
    );
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8"
      style={{
        background: `linear-gradient(135deg, ${lightenColor(brandColor, 45)} 0%, ${lightenColor(accentColor, 45)} 100%)`,
      }}
    >
      <div className="w-full max-w-3xl">
        {/* Main Card */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20">
          {/* Hero Header */}
          <div
            className="relative px-6 sm:px-10 py-8 sm:py-12 text-white overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${brandColor} 0%, ${accentColor} 100%)`,
            }}
          >
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

            <div className="relative z-10">
              {/* Logo or Icon */}
              <div className="flex items-center gap-4 mb-4">
                {survey.logoUrl ? (
                  <img
                    src={survey.logoUrl}
                    alt="Logo"
                    className="h-16 w-auto object-contain bg-white/20 rounded-2xl p-2 backdrop-blur-sm"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                    <MessageCircle className="w-8 h-8" />
                  </div>
                )}
                <div className="flex-1">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight">
                    {survey.title}
                  </h1>
                  {survey.description && (
                    <p className="text-white/90 text-sm sm:text-base mt-2 leading-relaxed">
                      {survey.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Stats Pills */}
              <div className="flex flex-wrap gap-3 mt-6">
                <div className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  ~{estimatedTime} min
                </div>
                <div className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  {survey.questions.length} preguntas
                </div>
                <div className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  100% privado
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 sm:px-10 py-8 sm:py-10 space-y-8">
            {/* Welcome Message */}
            {survey.welcomeMessage && (
              <div
                className="p-6 rounded-2xl border-2"
                style={{
                  background: `linear-gradient(135deg, ${lightenColor(brandColor, 47)} 0%, ${lightenColor(accentColor, 47)} 100%)`,
                  borderColor: lightenColor(brandColor, 40),
                }}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: brandColor }}>
                    <MessageCircle className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-slate-800 leading-relaxed font-medium">
                      {survey.welcomeMessage}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Questions Preview */}
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: brandColor }}>
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                  Lo que te preguntaremos
                </h2>
              </div>

              <div className="space-y-3">
                {survey.questions.map((question, index) => (
                  <div
                    key={question.id}
                    className="group p-5 bg-gradient-to-br from-slate-50 to-white rounded-2xl border-2 border-slate-100 hover:border-slate-200 transition-all hover:shadow-lg"
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-md"
                        style={{ backgroundColor: brandColor }}
                      >
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-slate-900 font-semibold text-base sm:text-lg mb-2">
                          {question.questionText}
                        </p>

                        {/* Question type indicator */}
                        {question.questionType === "rating" && (
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <span className="px-2 py-1 bg-slate-100 rounded-lg font-medium">
                              Escala 1-10
                            </span>
                          </div>
                        )}

                        {question.questionType === "email" && (
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <span className="px-2 py-1 bg-slate-100 rounded-lg font-medium">
                              📧 Email
                            </span>
                          </div>
                        )}

                        {question.questionType === "multiple_choice" && question.options && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            {(JSON.parse(question.options) as string[]).map((opt, i) => (
                              <span
                                key={i}
                                className="px-3 py-1.5 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:border-slate-300 transition-colors"
                              >
                                {opt}
                              </span>
                            ))}
                          </div>
                        )}

                        {question.questionType === "yes_no" && question.options && (
                          <div className="flex gap-2 mt-3">
                            {(JSON.parse(question.options) as string[]).map((opt, i) => (
                              <span
                                key={i}
                                className="px-4 py-2 bg-white border-2 border-slate-200 rounded-xl text-sm font-semibold text-slate-700"
                              >
                                {opt}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Button */}
            <div className="space-y-4">
              <div className="relative group">
                {/* Glow effect */}
                <div
                  className="absolute -inset-1 rounded-2xl opacity-60 group-hover:opacity-100 blur-xl transition-opacity"
                  style={{ background: `linear-gradient(135deg, ${brandColor} 0%, ${accentColor} 100%)` }}
                />

                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative block w-full py-5 px-6 rounded-2xl font-bold text-lg sm:text-xl text-white shadow-2xl transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                  style={{ background: `linear-gradient(135deg, ${brandColor} 0%, ${accentColor} 100%)` }}
                >
                  <div className="flex items-center justify-center gap-3">
                    <svg
                      className="w-7 h-7"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                    </svg>
                    <span>Responder por WhatsApp</span>
                  </div>
                </a>
              </div>

              {/* Trust badges */}
              <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4" style={{ color: brandColor }} />
                  <span className="font-medium">Privado y seguro</span>
                </div>
                <span className="text-slate-300">•</span>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4" style={{ color: brandColor }} />
                  <span className="font-medium">A tu ritmo</span>
                </div>
                <span className="text-slate-300">•</span>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4" style={{ color: brandColor }} />
                  <span className="font-medium">Sin spam</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 sm:px-10 py-5 bg-slate-50/80 backdrop-blur-sm border-t border-slate-100">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <p>
                Creado con{" "}
                <a
                  href="https://chatform.mx"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold hover:underline"
                  style={{ color: brandColor }}
                >
                  ChatForm
                </a>
              </p>
              <p className="text-slate-400">{survey.responseCount} respuestas</p>
            </div>
          </div>
        </div>

        {/* Social Proof */}
        <div className="mt-6 grid grid-cols-3 gap-3 sm:gap-4">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/20 shadow-lg">
            <div className="text-3xl font-bold" style={{ color: brandColor }}>
              {survey.responseCount}
            </div>
            <div className="text-xs text-slate-600 mt-1 font-medium">Respuestas</div>
          </div>
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/20 shadow-lg">
            <div className="text-3xl font-bold" style={{ color: accentColor }}>
              ~{estimatedTime}
            </div>
            <div className="text-xs text-slate-600 mt-1 font-medium">Minutos</div>
          </div>
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/20 shadow-lg">
            <div className="text-3xl font-bold text-emerald-600">✓</div>
            <div className="text-xs text-slate-600 mt-1 font-medium">Seguro</div>
          </div>
        </div>
      </div>
    </div>
  );
}
