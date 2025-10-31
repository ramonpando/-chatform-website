"use client";

import { useState } from "react";
import { Copy, Check, Eye, EyeOff, Key, Loader2, AlertTriangle } from "lucide-react";

export function ApiKeyManager({
  tenantId,
  hasKey,
  keyPrefix,
}: {
  tenantId: string;
  hasKey: boolean;
  keyPrefix?: string;
}) {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showConfirmRevoke, setShowConfirmRevoke] = useState(false);

  const handleGenerate = async () => {
    if (
      hasKey &&
      !confirm("Ya tienes una API key. ¿Generar una nueva revocará la anterior?")
    ) {
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/tenant/api-key", {
        method: "POST",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Error al generar API key");
      }

      const data = await res.json();
      setApiKey(data.apiKey);
      setIsRevealed(true);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRevoke = async () => {
    setLoading(true);

    try {
      const res = await fetch("/api/tenant/api-key", {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Error al revocar API key");
      }

      setApiKey(null);
      setShowConfirmRevoke(false);
      alert("API key revocada exitosamente");
      window.location.reload();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (apiKey) {
      await navigator.clipboard.writeText(apiKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-4">
      {!apiKey && !hasKey ? (
        // No API key generated
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Key className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            No tienes una API Key
          </h3>
          <p className="text-sm text-slate-600 mb-6 max-w-md mx-auto">
            Genera una API key para acceder a los endpoints de ChatForm desde tu
            aplicación
          </p>
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-md hover:bg-slate-800 transition-colors font-semibold disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generando...
              </>
            ) : (
              <>
                <Key className="w-4 h-4" />
                Generar API Key
              </>
            )}
          </button>
        </div>
      ) : apiKey ? (
        // Newly generated API key (show once)
        <div className="p-6 bg-green-50 border-2 border-green-200 rounded-lg">
          <div className="flex items-start gap-3 mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <Check className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-green-900 mb-1">
                API Key Generada
              </h3>
              <p className="text-sm text-green-700">
                Copia tu API key ahora. No podrás verla de nuevo.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 bg-white border border-green-300 rounded-md">
            <input
              type="text"
              value={apiKey}
              readOnly
              className="flex-1 bg-transparent border-none focus:outline-none font-mono text-sm text-slate-900"
            />
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center gap-2 text-sm font-semibold"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  Copiado
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copiar
                </>
              )}
            </button>
          </div>

          <p className="text-xs text-green-700 mt-3">
            Guarda esta key en un lugar seguro. Por seguridad, solo mostramos la
            key completa una vez.
          </p>
        </div>
      ) : (
        // Existing API key (hidden)
        <div>
          <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg bg-slate-50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Key className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  API Key Activa
                </h3>
                <p className="text-xs text-slate-600 font-mono">
                  {keyPrefix || "sk_"}••••••••••••
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowConfirmRevoke(true)}
              className="px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors font-semibold text-sm"
            >
              Revocar
            </button>
          </div>

          <p className="text-sm text-slate-600 mt-3">
            Tu API key está activa. Si la perdiste, genera una nueva (revocará la
            anterior).
          </p>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="mt-3 px-4 py-2 bg-slate-100 text-slate-700 rounded-md hover:bg-slate-200 transition-colors font-semibold text-sm"
          >
            Generar Nueva Key
          </button>
        </div>
      )}

      {/* Revoke Confirmation Modal */}
      {showConfirmRevoke && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl">
            <div className="flex items-start gap-3 mb-4">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-900 mb-1">
                  Revocar API Key
                </h3>
                <p className="text-sm text-slate-600">
                  Esta acción no se puede deshacer. Todas las integraciones que
                  usen esta key dejarán de funcionar.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmRevoke(false)}
                disabled={loading}
                className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-md hover:bg-slate-200 transition-colors font-semibold"
              >
                Cancelar
              </button>
              <button
                onClick={handleRevoke}
                disabled={loading}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors font-semibold inline-flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Revocando...
                  </>
                ) : (
                  "Revocar"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
