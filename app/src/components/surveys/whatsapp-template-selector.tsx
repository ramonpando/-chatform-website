"use client";

import { useState, useEffect } from "react";
import { DEFAULT_TEMPLATES, fillTemplate, type WhatsAppTemplate } from "@/lib/whatsapp/templates";
import { MessageSquare, X, TrendingUp, Info, Sparkles, ExternalLink } from "lucide-react";
import Link from "next/link";

interface WhatsAppTemplateSelectorProps {
  surveyTitle: string;
  questionCount: number;
  recipientName?: string;
  onSelect: (templateId: string, customVariables: Record<string, string>) => void;
  defaultTemplateId?: string;
}

export function WhatsAppTemplateSelector({
  surveyTitle,
  questionCount,
  recipientName,
  onSelect,
  defaultTemplateId = "friendly-short",
}: WhatsAppTemplateSelectorProps) {
  const [selectedTemplateId, setSelectedTemplateId] = useState(defaultTemplateId);
  const [customVariables, setCustomVariables] = useState<Record<string, string>>({});
  const [showPreview, setShowPreview] = useState(false);
  const [customTemplates, setCustomTemplates] = useState<any[]>([]);
  const [isLoadingCustom, setIsLoadingCustom] = useState(true);

  // Fetch custom templates from API
  useEffect(() => {
    fetchCustomTemplates();
  }, []);

  const fetchCustomTemplates = async () => {
    try {
      const response = await fetch("/api/whatsapp/templates?status=active");
      const data = await response.json();
      setCustomTemplates(data.templates || []);
    } catch (error) {
      console.error("Error fetching custom templates:", error);
    } finally {
      setIsLoadingCustom(false);
    }
  };

  // Combine default and custom templates
  const allTemplates = [
    ...DEFAULT_TEMPLATES.map(t => ({ ...t, isDefault: true })),
    ...customTemplates.map((t: any) => ({
      id: t.id,
      name: t.name,
      description: t.description || "",
      message: t.message,
      variables: t.variables,
      category: t.category,
      estimatedResponseRate: t.estimatedResponseRate || "~35%",
      isDefault: false,
    })),
  ];

  const selectedTemplate = allTemplates.find(t => t.id === selectedTemplateId) || DEFAULT_TEMPLATES[0];

  // Auto-generate variables for preview
  const previewVariables = {
    name: recipientName || "Juan",
    topic: surveyTitle,
    question_count: questionCount.toString(),
    estimated_time: Math.max(1, Math.ceil(questionCount * 0.5)).toString(),
    link: `Para empezar, responde con: START_ABC123`,
    company: "nuestro equipo",
    sender: "el equipo",
    ...customVariables,
  };

  // Get preview message
  const previewMessage = fillTemplate(selectedTemplate.message, previewVariables);

  // Notify parent of selection
  useEffect(() => {
    onSelect(selectedTemplateId, customVariables);
  }, [selectedTemplateId, customVariables, onSelect]);

  // Get custom variable fields (those not auto-filled)
  const customVariableFields = selectedTemplate.variables.filter(
    (v: string) => !["name", "topic", "question_count", "estimated_time", "link", "company", "sender"].includes(v)
  );

  return (
    <div className="space-y-4">
      {/* Template Selection */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-semibold text-slate-700">
            Plantilla de Mensaje
          </label>
          <Link
            href="/settings/whatsapp-templates"
            className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
            target="_blank"
          >
            {customTemplates.length > 0
              ? `Gestionar plantillas (${customTemplates.length} personalizadas)`
              : "Crear plantilla personalizada"}
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {allTemplates.map((template) => (
            <button
              key={template.id}
              onClick={() => setSelectedTemplateId(template.id)}
              className={`relative p-4 rounded-lg border-2 text-left transition-all ${
                selectedTemplateId === template.id
                  ? "border-blue-600 bg-blue-50 shadow-md"
                  : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
              } ${!template.isDefault ? "ring-2 ring-purple-200" : ""}`}
            >
              {/* Custom Template Badge */}
              {!template.isDefault && (
                <div className="absolute top-2 left-2">
                  <span className="px-2 py-0.5 bg-purple-600 text-white text-xs font-semibold rounded-full flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Custom
                  </span>
                </div>
              )}
              {/* Badge with response rate */}
              <div className={`absolute top-2 ${!template.isDefault ? "right-2" : "right-2"}`}>
                <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                  selectedTemplateId === template.id
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 text-slate-600"
                }`}>
                  {template.estimatedResponseRate}
                </span>
              </div>

              {/* Category icon */}
              <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium mb-2 ${
                template.category === "professional"
                  ? "bg-purple-50 text-purple-700"
                  : template.category === "friendly"
                  ? "bg-green-50 text-green-700"
                  : template.category === "direct"
                  ? "bg-orange-50 text-orange-700"
                  : "bg-slate-50 text-slate-700"
              }`}>
                {template.category === "professional" && "👔"}
                {template.category === "friendly" && "👋"}
                {template.category === "direct" && "⚡"}
                {template.category === "minimal" && "📝"}
                <span className="capitalize">{template.category}</span>
              </div>

              {/* Template name */}
              <h3 className={`font-bold mb-1 ${
                selectedTemplateId === template.id ? "text-blue-900" : "text-slate-900"
              }`}>
                {template.name}
              </h3>

              {/* Description */}
              <p className="text-xs text-slate-600 line-clamp-2">
                {template.description}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Variables (if any) */}
      {customVariableFields.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start gap-2 mb-3">
            <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-amber-900 text-sm">
                Personaliza tu mensaje
              </h4>
              <p className="text-xs text-amber-700 mt-0.5">
                Esta plantilla requiere información adicional
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {customVariableFields.map((variable: string) => (
              <div key={variable}>
                <label className="block text-sm font-medium text-amber-900 mb-1">
                  {variable === "context" && "Contexto (ej: 'cliente nuestro', 'usuario de nuestra app')"}
                  {variable === "incentive" && "Incentivo (ej: 'recibirás un 10% de descuento')"}
                  {!["context", "incentive"].includes(variable) && variable}
                </label>
                <input
                  type="text"
                  value={customVariables[variable] || ""}
                  onChange={(e) =>
                    setCustomVariables({ ...customVariables, [variable]: e.target.value })
                  }
                  placeholder={
                    variable === "context"
                      ? "cliente nuestro"
                      : variable === "incentive"
                      ? "recibirás un beneficio exclusivo"
                      : `Ingresa ${variable}`
                  }
                  className="w-full px-3 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white text-slate-900"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Preview Button */}
      <div>
        <button
          onClick={() => setShowPreview(!showPreview)}
          className="w-full px-4 py-3 bg-slate-100 text-slate-700 rounded-lg font-semibold hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
        >
          <MessageSquare className="w-5 h-5" />
          {showPreview ? "Ocultar" : "Ver"} Vista Previa del Mensaje
        </button>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-white" />
                <h3 className="font-bold text-white">Vista Previa - WhatsApp</h3>
              </div>
              <button
                onClick={() => setShowPreview(false)}
                className="p-1 hover:bg-white/20 rounded transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Preview */}
            <div className="p-6 bg-[#e5ddd5] min-h-[300px]" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg width=%2760%27 height=%2760%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cpath d=%27M30 30L0 0%27 stroke=%27%23000%27 stroke-opacity=%270.03%27 fill=%27none%27/%3E%3C/svg%3E')" }}>
              {/* WhatsApp Message Bubble */}
              <div className="bg-white rounded-lg p-3 shadow-md max-w-[85%] ml-auto">
                <div className="text-sm text-slate-800 whitespace-pre-wrap break-words">
                  {previewMessage}
                </div>
                <div className="text-[10px] text-slate-400 text-right mt-1">
                  12:34
                </div>
              </div>

              {/* Info about variables */}
              <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-800">
                <p className="font-semibold mb-1">📝 Variables automáticas:</p>
                <ul className="space-y-0.5 text-blue-700">
                  <li>• Nombre: {recipientName || "del CSV"}</li>
                  <li>• Tema: {surveyTitle}</li>
                  <li>• Preguntas: {questionCount}</li>
                  <li>• Tiempo: ~{Math.max(1, Math.ceil(questionCount * 0.5))} min</li>
                </ul>
              </div>
            </div>

            {/* Stats */}
            <div className="bg-slate-50 border-t border-slate-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-600">Tasa de respuesta estimada</div>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <span className="text-lg font-bold text-green-600">
                      {selectedTemplate.estimatedResponseRate}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-600">Categoría</div>
                  <div className="text-sm font-semibold text-slate-900 capitalize mt-1">
                    {selectedTemplate.category}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Selected Template Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <TrendingUp className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-semibold text-blue-900 text-sm mb-1">
              Plantilla seleccionada: {selectedTemplate.name}
            </h4>
            <p className="text-xs text-blue-700 mb-2">
              {selectedTemplate.description}
            </p>
            <div className="flex items-center gap-4 text-xs text-blue-600">
              <span>Tasa estimada: <strong>{selectedTemplate.estimatedResponseRate}</strong></span>
              <span>•</span>
              <span className="capitalize">{selectedTemplate.category}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
