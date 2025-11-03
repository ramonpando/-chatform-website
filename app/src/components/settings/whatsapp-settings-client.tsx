"use client";

import { useState, useEffect } from "react";
import { Save, Loader2, MessageSquare, CheckCircle, AlertCircle, Sparkles, FileText } from "lucide-react";
import Link from "next/link";

interface WhatsAppConfig {
  provider: "chatform" | "twilio";
  twilioContentSid?: string;
  twilioContentVariables?: Record<string, string>;
}

export function WhatsAppSettingsClient() {
  const [config, setConfig] = useState<WhatsAppConfig>({
    provider: "chatform",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");

  // Fetch current config
  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/settings/whatsapp");
      const data = await response.json();
      if (data.config) {
        setConfig(data.config);
      }
    } catch (error) {
      console.error("Error fetching WhatsApp config:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus("idle");

    try {
      const response = await fetch("/api/settings/whatsapp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });

      if (!response.ok) {
        throw new Error("Failed to save config");
      }

      setSaveStatus("success");
      setTimeout(() => setSaveStatus("idle"), 3000);
    } catch (error) {
      console.error("Error saving config:", error);
      setSaveStatus("error");
    } finally {
      setIsSaving(false);
    }
  };

  const addVariable = () => {
    setConfig({
      ...config,
      twilioContentVariables: {
        ...config.twilioContentVariables,
        "": "",
      },
    });
  };

  const updateVariable = (oldKey: string, newKey: string, value: string) => {
    const newVars = { ...config.twilioContentVariables };
    delete newVars[oldKey];
    if (newKey) {
      newVars[newKey] = value;
    }
    setConfig({ ...config, twilioContentVariables: newVars });
  };

  const removeVariable = (key: string) => {
    const newVars = { ...config.twilioContentVariables };
    delete newVars[key];
    setConfig({ ...config, twilioContentVariables: newVars });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Provider Selection */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Proveedor de Plantillas</h3>
        <p className="text-sm text-slate-600 mb-4">
          Elige cómo quieres gestionar tus mensajes de WhatsApp
        </p>

        <div className="space-y-3">
          {/* ChatForm Templates */}
          <button
            onClick={() => setConfig({ ...config, provider: "chatform" })}
            className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
              config.provider === "chatform"
                ? "border-blue-600 bg-blue-50"
                : "border-slate-200 bg-white hover:border-slate-300"
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg ${
                config.provider === "chatform" ? "bg-blue-100" : "bg-slate-100"
              }`}>
                <Sparkles className={`w-5 h-5 ${
                  config.provider === "chatform" ? "text-blue-600" : "text-slate-600"
                }`} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-bold text-slate-900">ChatForm Templates</h4>
                  <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded">
                    Recomendado
                  </span>
                </div>
                <p className="text-sm text-slate-600 mb-2">
                  Usa nuestras plantillas predefinidas o crea las tuyas propias con nuestro editor visual
                </p>
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <span>✓ Editor visual</span>
                  <span>✓ Variables automáticas</span>
                  <span>✓ Sin aprobación requerida</span>
                </div>
              </div>
            </div>
          </button>

          {/* Twilio Content API */}
          <button
            onClick={() => setConfig({ ...config, provider: "twilio" })}
            className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
              config.provider === "twilio"
                ? "border-blue-600 bg-blue-50"
                : "border-slate-200 bg-white hover:border-slate-300"
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg ${
                config.provider === "twilio" ? "bg-blue-100" : "bg-slate-100"
              }`}>
                <MessageSquare className={`w-5 h-5 ${
                  config.provider === "twilio" ? "text-blue-600" : "text-slate-600"
                }`} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-bold text-slate-900">Twilio Content API</h4>
                  <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-semibold rounded">
                    Avanzado
                  </span>
                </div>
                <p className="text-sm text-slate-600 mb-2">
                  Usa plantillas de WhatsApp aprobadas por Meta desde tu cuenta de Twilio
                </p>
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <span>✓ Aprobación de Meta</span>
                  <span>✓ Mayor deliverability</span>
                  <span>✓ Formato oficial</span>
                </div>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Twilio Configuration (only if provider is twilio) */}
      {config.provider === "twilio" && (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Configuración de Twilio</h3>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-semibold mb-1">¿Dónde encuentro mi Content SID?</p>
                <ol className="list-decimal ml-4 space-y-1">
                  <li>Ve a tu <a href="https://console.twilio.com/us1/develop/sms/content-editor" target="_blank" rel="noopener noreferrer" className="underline">Twilio Console → Content Editor</a></li>
                  <li>Encuentra tu plantilla aprobada de WhatsApp</li>
                  <li>Copia el Content SID (empieza con "HX...")</li>
                  <li>Pégalo abajo</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Content SID */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Content SID *
            </label>
            <input
              type="text"
              value={config.twilioContentSid || ""}
              onChange={(e) => setConfig({ ...config, twilioContentSid: e.target.value })}
              placeholder="HX88109752780f9fd3a409cb4b7409d376"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
            />
            <p className="text-xs text-slate-500 mt-1">
              El identificador único de tu plantilla aprobada en Twilio
            </p>
          </div>

          {/* Variables Mapping */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-semibold text-slate-700">
                Variables del Template
              </label>
              <button
                onClick={addVariable}
                className="text-xs text-blue-600 hover:text-blue-700 font-semibold"
              >
                + Agregar Variable
              </button>
            </div>
            <p className="text-xs text-slate-600 mb-3">
              Mapea las variables de tu Twilio Content Template a los datos de ChatForm
            </p>

            <div className="space-y-2">
              {Object.entries(config.twilioContentVariables || {}).map(([key, value], idx) => (
                <div key={idx} className="flex gap-2">
                  <input
                    type="text"
                    value={key}
                    onChange={(e) => updateVariable(key, e.target.value, value)}
                    placeholder="Variable (ej: 1, 2, name)"
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-mono"
                  />
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => updateVariable(key, key, e.target.value)}
                    placeholder="Valor (ej: {{name}}, {{topic}})"
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                  <button
                    onClick={() => removeVariable(key)}
                    className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    ✕
                  </button>
                </div>
              ))}

              {(!config.twilioContentVariables || Object.keys(config.twilioContentVariables).length === 0) && (
                <div className="text-center py-6 text-slate-500 text-sm">
                  No hay variables configuradas. Haz clic en "+ Agregar Variable" para empezar.
                </div>
              )}
            </div>

            {/* Example */}
            <div className="mt-4 bg-slate-50 border border-slate-200 rounded-lg p-3">
              <p className="text-xs font-semibold text-slate-700 mb-2">Ejemplo de mapeo:</p>
              <div className="space-y-1 text-xs font-mono text-slate-600">
                <div className="flex gap-2">
                  <span className="text-slate-400">1</span>
                  <span>→</span>
                  <span>{"{{name}}"}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-slate-400">2</span>
                  <span>→</span>
                  <span>{"{{topic}}"}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-slate-400">3</span>
                  <span>→</span>
                  <span>{"{{link}}"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ChatForm Templates Link */}
      {config.provider === "chatform" && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-white rounded-lg shadow-sm">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-slate-900 mb-2">Gestiona tus plantillas</h4>
              <p className="text-sm text-slate-600 mb-4">
                Crea y personaliza plantillas de mensajes con nuestro editor visual
              </p>
              <Link
                href="/settings/whatsapp-templates"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors text-sm"
              >
                <Sparkles className="w-4 h-4" />
                Ir a Plantillas
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Save Button */}
      <div className="flex items-center justify-end gap-3">
        {saveStatus === "success" && (
          <div className="flex items-center gap-2 text-green-600 text-sm font-semibold">
            <CheckCircle className="w-5 h-5" />
            Configuración guardada
          </div>
        )}
        {saveStatus === "error" && (
          <div className="flex items-center gap-2 text-red-600 text-sm font-semibold">
            <AlertCircle className="w-5 h-5" />
            Error al guardar
          </div>
        )}
        <button
          onClick={handleSave}
          disabled={isSaving || (config.provider === "twilio" && !config.twilioContentSid)}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Guardando...
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              Guardar Configuración
            </>
          )}
        </button>
      </div>
    </div>
  );
}
