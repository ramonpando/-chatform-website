"use client";

import { useState, useEffect } from "react";
import { Sparkles, Loader2, X, AlertCircle, CheckCircle } from "lucide-react";

interface GeneratedSurvey {
  title: string;
  welcomeMessage: string;
  questions: Array<{
    text: string;
    type: "multiple_choice" | "yes_no" | "rating" | "open_text" | "email";
    options?: string[];
  }>;
  thankYouMessage: string;
}

interface Props {
  onGenerate: (survey: GeneratedSurvey) => void;
  onClose: () => void;
  userPlan?: string;
}

export function AIGeneratorModal({ onGenerate, onClose, userPlan = "free" }: Props) {
  const [description, setDescription] = useState("");
  const [numQuestions, setNumQuestions] = useState(5);
  const [loading, setLoading] = useState(false);
  const [loadingUsage, setLoadingUsage] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [generatedSurvey, setGeneratedSurvey] = useState<GeneratedSurvey | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [usage, setUsage] = useState<{
    used: number;
    limit: number;
    remaining: number;
  } | null>(null);

  // Fetch usage on mount
  useEffect(() => {
    if (userPlan !== "free") {
      fetchUsage();
    }
  }, [userPlan]);

  const fetchUsage = async () => {
    try {
      const res = await fetch("/api/ai/usage");
      if (res.ok) {
        const data = await res.json();
        setUsage(data.usage);
      }
    } catch (err) {
      console.error("Error fetching usage:", err);
    } finally {
      setLoadingUsage(false);
    }
  };

  const handleGenerateClick = () => {
    if (!description.trim() || description.length < 10) {
      setError("Por favor describe tu encuesta con al menos 10 caracteres");
      return;
    }
    setShowConfirmation(true);
  };

  const handleConfirmGenerate = async () => {
    setShowConfirmation(false);
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/ai/generate-survey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: description.trim(),
          numQuestions,
          tone: "casual",
          language: "es",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.error === "AI_NOT_AVAILABLE") {
          setError("Actualiza a Starter para usar el generador AI");
        } else if (data.error === "LIMIT_EXCEEDED") {
          setError(`${data.message}. Actualiza tu plan para más generaciones.`);
        } else if (data.error === "RATE_LIMIT") {
          setError(data.message);
        } else {
          setError(data.message || "Error al generar encuesta");
        }
        return;
      }

      if (data.success && data.data) {
        setUsage(data.usage);
        setGeneratedSurvey(data.data);
        setShowPreview(true);
      }
    } catch (err: any) {
      console.error("AI Generation error:", err);
      setError("Error de conexión. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptSurvey = () => {
    if (generatedSurvey) {
      onGenerate(generatedSurvey);
      onClose();
    }
  };

  const handleReject = () => {
    setShowPreview(false);
    setGeneratedSurvey(null);
  };

  // Upgrade prompt para usuarios Free
  if (userPlan === "free") {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-md w-full p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg">
                <Sparkles className="w-6 h-6 text-purple-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">AI Generator</h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-slate-100 rounded-md transition-colors"
            >
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>

          <div className="text-center py-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Feature Premium
            </h3>
            <p className="text-slate-800 mb-4">
              Crea encuestas perfectas en segundos con inteligencia artificial.
            </p>

            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-4 mb-6">
              <p className="text-sm font-medium text-slate-800 mb-2">Incluido en:</p>
              <ul className="text-sm text-slate-800 space-y-1">
                <li>• Starter: 30 generaciones/mes</li>
                <li>• Pro: 100 generaciones/mes</li>
              </ul>
            </div>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-slate-900 font-medium hover:bg-slate-50 transition-colors"
              >
                Cerrar
              </button>
              <a
                href="/settings/billing"
                className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 transition-colors text-center"
              >
                Ver Planes
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Confirmation Dialog
  if (showConfirmation) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-md w-full p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-amber-50 rounded-lg">
              <AlertCircle className="w-6 h-6 text-amber-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Confirmar Generación</h2>
          </div>

          <p className="text-slate-700 mb-4">
            Estás a punto de usar <span className="font-semibold">1 generación</span> de tu límite mensual.
          </p>

          {usage && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-900">
                <span className="font-bold">{usage.remaining}</span> de {usage.limit} generaciones disponibles este mes
              </p>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => setShowConfirmation(false)}
              className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-slate-900 font-medium hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirmGenerate}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 transition-colors"
            >
              Generar
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Preview Dialog
  if (showPreview && generatedSurvey) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-50 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Encuesta Generada</h2>
          </div>

          <div className="space-y-4 mb-6">
            <div>
              <p className="text-sm font-medium text-slate-700 mb-1">Título</p>
              <p className="text-slate-900 font-semibold">{generatedSurvey.title}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-slate-700 mb-1">Mensaje de Bienvenida</p>
              <p className="text-slate-900">{generatedSurvey.welcomeMessage}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-slate-700 mb-2">Preguntas ({generatedSurvey.questions.length})</p>
              <div className="space-y-3">
                {generatedSurvey.questions.map((q, idx) => (
                  <div key={idx} className="bg-slate-50 rounded-lg p-3">
                    <p className="text-sm font-medium text-slate-900 mb-1">
                      {idx + 1}. {q.text}
                    </p>
                    <p className="text-xs text-slate-600">
                      Tipo: {q.type === "multiple_choice" ? "Opción múltiple" : q.type === "yes_no" ? "Sí/No" : q.type === "rating" ? "Calificación" : q.type === "email" ? "Email" : "Texto abierto"}
                    </p>
                    {q.options && q.options.length > 0 && (
                      <ul className="mt-2 space-y-1">
                        {q.options.map((opt, i) => (
                          <li key={i} className="text-xs text-slate-700">• {opt}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-slate-700 mb-1">Mensaje de Agradecimiento</p>
              <p className="text-slate-900">{generatedSurvey.thankYouMessage}</p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleReject}
              className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-slate-900 font-medium hover:bg-slate-50 transition-colors"
            >
              Descartar
            </button>
            <button
              onClick={handleAcceptSurvey}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 transition-colors"
            >
              Usar esta Encuesta
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Modal principal para usuarios con acceso
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-lg w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg">
              <Sparkles className="w-6 h-6 text-purple-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              Generar Encuesta con IA
            </h2>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="p-1 hover:bg-slate-100 rounded-md transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Usage Info Upfront */}
          {loadingUsage ? (
            <div className="bg-slate-50 rounded-lg p-3 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-slate-600" />
              <p className="text-sm text-slate-600">Cargando información...</p>
            </div>
          ) : usage ? (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-900">
                🎯 Tienes <span className="font-bold">{usage.remaining}</span> de {usage.limit} generaciones disponibles este mes
              </p>
            </div>
          ) : null}
          {/* Description Input */}
          <div>
            <label className="block text-sm font-medium text-slate-900 mb-2">
              Describe tu encuesta en una frase
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ej: Satisfacción de clientes en restaurante"
              className="w-full border border-slate-300 rounded-lg p-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              rows={3}
              disabled={loading}
              maxLength={200}
            />
            <p className="text-xs text-slate-700 mt-1">
              {description.length}/200 caracteres
            </p>
          </div>

          {/* Number of Questions */}
          <div>
            <label className="block text-sm font-medium text-slate-900 mb-2">
              Número de preguntas
            </label>
            <select
              value={numQuestions}
              onChange={(e) => setNumQuestions(parseInt(e.target.value))}
              className="w-full border border-slate-300 rounded-lg p-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            >
              <option value={3}>3 preguntas</option>
              <option value={4}>4 preguntas</option>
              <option value={5}>5 preguntas (recomendado)</option>
              <option value={6}>6 preguntas</option>
              <option value={7}>7 preguntas</option>
              <option value={8}>8 preguntas</option>
            </select>
          </div>

          {/* Examples */}
          <div className="bg-slate-50 rounded-lg p-3">
            <p className="text-xs font-medium text-slate-900 mb-2">
              💡 Ejemplos:
            </p>
            <ul className="text-xs text-slate-800 space-y-1">
              <li>• Feedback de curso online</li>
              <li>• NPS para app móvil</li>
              <li>• Evaluación de evento</li>
              <li>• Satisfacción post-compra</li>
            </ul>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-slate-900 font-medium hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleGenerateClick}
              disabled={loading || !description.trim() || description.length < 10 || loadingUsage}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generando...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generar Encuesta
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
