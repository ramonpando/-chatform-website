"use client";

import { useState } from "react";
import { Sparkles, Loader2, TrendingUp, Lightbulb, Hash, Brain, Smile, Meh, Frown } from "lucide-react";

interface AIAnalysis {
  sentiment: {
    positive: number;
    neutral: number;
    negative: number;
  };
  themes: Array<{
    name: string;
    frequency: number;
    sentiment: "positive" | "neutral" | "negative";
  }>;
  keywords: string[];
  summary: string;
  insights: string[];
  actionItems: string[];
}

interface Props {
  surveyId: string;
  userPlan: string;
}

export function AIInsightsPanel({ surveyId, userPlan }: Props) {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/ai/analyze-responses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ surveyId }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.error === "AI_NOT_AVAILABLE") {
          setError("El análisis AI solo está disponible en el plan Pro");
        } else if (data.error === "NO_TEXT_RESPONSES") {
          setError("No hay respuestas de texto para analizar");
        } else {
          setError(data.message || "Error al analizar respuestas");
        }
        return;
      }

      setAnalysis(data.analysis);
    } catch (err: any) {
      console.error("Analysis error:", err);
      setError("Error de conexión. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  // Upgrade prompt para usuarios sin acceso
  if (userPlan !== "pro") {
    return (
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 p-8">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl text-white">
            <Brain className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Análisis AI con Inteligencia Artificial
            </h3>
            <p className="text-slate-700 mb-4">
              Descubre insights automáticos de tus respuestas: sentimientos, temas, keywords y recomendaciones accionables.
            </p>
            <div className="bg-white/50 rounded-lg p-4 mb-4">
              <p className="text-sm font-semibold text-slate-800 mb-2">Incluido en Plan Pro:</p>
              <ul className="text-sm text-slate-700 space-y-1">
                <li>✨ Detección automática de sentimientos</li>
                <li>✨ Extracción de temas y tendencias</li>
                <li>✨ Keywords principales</li>
                <li>✨ Insights accionables</li>
                <li>✨ Análisis ilimitado</li>
              </ul>
            </div>
            <a
              href="/settings/billing"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-sm"
            >
              <Sparkles className="w-4 h-4" />
              Actualizar a Pro
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Panel para usuarios Pro
  return (
    <div className="space-y-6">
      {/* Header con botón de análisis */}
      {!analysis && (
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-200 p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl text-white">
              <Brain className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-slate-900 mb-1">
                Análisis AI de Respuestas
              </h3>
              <p className="text-sm text-slate-700">
                Obtén insights automáticos de las respuestas de texto abierto
              </p>
            </div>
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all shadow-sm disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analizando...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Analizar Respuestas
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Analysis Results */}
      {analysis && (
        <div className="space-y-6">
          {/* Sentiment Overview */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <Smile className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-bold text-slate-900">Análisis de Sentimientos</h3>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <SentimentCard
                label="Positivo"
                percentage={analysis.sentiment.positive}
                icon={<Smile className="w-6 h-6" />}
                color="green"
              />
              <SentimentCard
                label="Neutral"
                percentage={analysis.sentiment.neutral}
                icon={<Meh className="w-6 h-6" />}
                color="yellow"
              />
              <SentimentCard
                label="Negativo"
                percentage={analysis.sentiment.negative}
                icon={<Frown className="w-6 h-6" />}
                color="red"
              />
            </div>
          </div>

          {/* Summary */}
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Brain className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-bold text-slate-900">Resumen Ejecutivo</h3>
            </div>
            <p className="text-slate-800 leading-relaxed">{analysis.summary}</p>
          </div>

          {/* Themes */}
          {analysis.themes && analysis.themes.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-bold text-slate-900">Temas Principales</h3>
              </div>
              <div className="space-y-3">
                {analysis.themes.slice(0, 5).map((theme, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-slate-900">{theme.name}</span>
                        <span className="text-sm text-slate-600">{theme.frequency} menciones</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${
                            theme.sentiment === "positive"
                              ? "bg-green-500"
                              : theme.sentiment === "negative"
                              ? "bg-red-500"
                              : "bg-yellow-500"
                          }`}
                          style={{
                            width: `${Math.min((theme.frequency / analysis.themes[0].frequency) * 100, 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Keywords */}
          {analysis.keywords && analysis.keywords.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Hash className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-bold text-slate-900">Keywords Principales</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {analysis.keywords.slice(0, 15).map((keyword, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium border border-blue-200"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Insights */}
          {analysis.insights && analysis.insights.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="w-5 h-5 text-yellow-600" />
                <h3 className="text-lg font-bold text-slate-900">Insights</h3>
              </div>
              <ul className="space-y-3">
                {analysis.insights.map((insight, index) => (
                  <li key={index} className="flex gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-yellow-100 text-yellow-700 rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <p className="text-slate-800 flex-1">{insight}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Action Items */}
          {analysis.actionItems && analysis.actionItems.length > 0 && (
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <h3 className="text-lg font-bold text-slate-900">Recomendaciones</h3>
              </div>
              <ul className="space-y-2">
                {analysis.actionItems.map((item, index) => (
                  <li key={index} className="flex gap-3 items-start">
                    <div className="flex-shrink-0 w-5 h-5 bg-green-600 text-white rounded-full flex items-center justify-center text-xs mt-0.5">
                      ✓
                    </div>
                    <p className="text-slate-800">{item}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Regenerate Button */}
          <div className="flex justify-center">
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="px-5 py-2.5 border-2 border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-50 transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analizando...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Regenerar Análisis
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function SentimentCard({
  label,
  percentage,
  icon,
  color,
}: {
  label: string;
  percentage: number;
  icon: React.ReactNode;
  color: "green" | "yellow" | "red";
}) {
  const colorClasses = {
    green: "bg-green-50 text-green-600 border-green-200",
    yellow: "bg-yellow-50 text-yellow-600 border-yellow-200",
    red: "bg-red-50 text-red-600 border-red-200",
  };

  return (
    <div className={`rounded-xl border p-4 ${colorClasses[color]}`}>
      <div className="flex items-center justify-between mb-2">
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>{icon}</div>
        <span className="text-2xl font-bold">{percentage}%</span>
      </div>
      <p className="text-sm font-semibold">{label}</p>
    </div>
  );
}
