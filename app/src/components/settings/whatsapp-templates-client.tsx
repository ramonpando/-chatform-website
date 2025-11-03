"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, MessageSquare, Check, X, TrendingUp, Loader2 } from "lucide-react";
import { fillTemplate } from "@/lib/whatsapp/templates";

interface WhatsAppTemplate {
  id: string;
  name: string;
  description: string | null;
  message: string;
  variables: string[];
  category: string;
  status: string;
  usageCount: number;
  estimatedResponseRate: string | null;
  createdAt: Date;
}

export function WhatsAppTemplatesClient() {
  const [templates, setTemplates] = useState<WhatsAppTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<WhatsAppTemplate | null>(null);

  // Fetch templates
  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/whatsapp/templates");
      const data = await response.json();
      setTemplates(data.templates || []);
    } catch (error) {
      console.error("Error fetching templates:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTemplate = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar esta plantilla?")) return;

    try {
      await fetch(`/api/whatsapp/templates/${id}`, {
        method: "DELETE",
      });
      await fetchTemplates();
    } catch (error) {
      console.error("Error deleting template:", error);
      alert("Error al eliminar plantilla");
    }
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
      {/* Create Button */}
      <div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Nueva Plantilla
        </button>
      </div>

      {/* Templates List */}
      {templates.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <MessageSquare className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            No tienes plantillas personalizadas
          </h3>
          <p className="text-slate-600 mb-4">
            Crea tu primera plantilla para personalizar tus mensajes de WhatsApp
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Crear Plantilla
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {templates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              onEdit={() => setEditingTemplate(template)}
              onDelete={() => deleteTemplate(template.id)}
            />
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      {(showCreateModal || editingTemplate) && (
        <TemplateModal
          template={editingTemplate}
          onClose={() => {
            setShowCreateModal(false);
            setEditingTemplate(null);
          }}
          onSave={async () => {
            setShowCreateModal(false);
            setEditingTemplate(null);
            await fetchTemplates();
          }}
        />
      )}
    </div>
  );
}

function TemplateCard({
  template,
  onEdit,
  onDelete,
}: {
  template: WhatsAppTemplate;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const categoryColors = {
    professional: "bg-purple-50 text-purple-700 border-purple-200",
    friendly: "bg-green-50 text-green-700 border-green-200",
    direct: "bg-orange-50 text-orange-700 border-orange-200",
    minimal: "bg-slate-50 text-slate-700 border-slate-200",
    custom: "bg-blue-50 text-blue-700 border-blue-200",
  };

  const statusColors = {
    pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
    approved: "bg-green-50 text-green-700 border-green-200",
    rejected: "bg-red-50 text-red-700 border-red-200",
    active: "bg-blue-50 text-blue-700 border-blue-200",
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-bold text-slate-900">{template.name}</h3>
            <span
              className={`px-2 py-0.5 text-xs font-semibold rounded-md border ${
                categoryColors[template.category as keyof typeof categoryColors] || categoryColors.custom
              }`}
            >
              {template.category}
            </span>
            <span
              className={`px-2 py-0.5 text-xs font-semibold rounded-md border ${
                statusColors[template.status as keyof typeof statusColors] || statusColors.active
              }`}
            >
              {template.status}
            </span>
          </div>
          {template.description && (
            <p className="text-sm text-slate-600">{template.description}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onEdit}
            className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Message Preview */}
      <div className="bg-slate-50 rounded-lg p-4 mb-4">
        <div className="text-sm text-slate-700 whitespace-pre-wrap break-words">
          {template.message}
        </div>
      </div>

      {/* Meta Info */}
      <div className="flex items-center justify-between text-sm text-slate-600">
        <div className="flex items-center gap-4">
          {template.estimatedResponseRate && (
            <div className="flex items-center gap-1">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span>{template.estimatedResponseRate}</span>
            </div>
          )}
          <div>Variables: {template.variables.length}</div>
          <div>Usos: {template.usageCount}</div>
        </div>
      </div>
    </div>
  );
}

function TemplateModal({
  template,
  onClose,
  onSave,
}: {
  template: WhatsAppTemplate | null;
  onClose: () => void;
  onSave: () => void;
}) {
  const [name, setName] = useState(template?.name || "");
  const [description, setDescription] = useState(template?.description || "");
  const [message, setMessage] = useState(template?.message || "");
  const [category, setCategory] = useState(template?.category || "custom");
  const [estimatedResponseRate, setEstimatedResponseRate] = useState(template?.estimatedResponseRate || "");
  const [isSaving, setIsSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Extract variables from message
  const variables = [...message.matchAll(/\{\{(\w+)\}\}/g)].map(m => m[1]);

  // Preview with example values
  const previewVariables = {
    name: "Juan Pérez",
    topic: "Satisfacción del Cliente",
    question_count: "5",
    estimated_time: "3",
    link: "Para empezar, responde con: START_ABC123",
    company: "Mi Empresa",
    sender: "El Equipo",
    context: "cliente nuestro",
    incentive: "recibirás un 10% de descuento",
  };

  const previewMessage = fillTemplate(message, previewVariables);

  const handleSave = async () => {
    if (!name || !message) {
      alert("Nombre y mensaje son requeridos");
      return;
    }

    setIsSaving(true);
    try {
      const url = template
        ? `/api/whatsapp/templates/${template.id}`
        : "/api/whatsapp/templates";

      const method = template ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description,
          message,
          category,
          estimatedResponseRate,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save template");
      }

      onSave();
    } catch (error) {
      console.error("Error saving template:", error);
      alert("Error al guardar plantilla");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-900">
              {template ? "Editar Plantilla" : "Nueva Plantilla"}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-slate-600" />
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Nombre *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Amigable con Incentivo"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              maxLength={100}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Descripción
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ej: Tono casual con oferta de descuento"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Categoría
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="professional">Profesional</option>
              <option value="friendly">Amigable</option>
              <option value="direct">Directo</option>
              <option value="minimal">Minimalista</option>
              <option value="custom">Personalizado</option>
            </select>
          </div>

          {/* Estimated Response Rate */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Tasa de Respuesta Estimada
            </label>
            <input
              type="text"
              value={estimatedResponseRate}
              onChange={(e) => setEstimatedResponseRate(e.target.value)}
              placeholder="Ej: ~40%"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Mensaje *
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={`¡Hola {{name}}! 👋\n\nQueremos tu opinión sobre {{topic}}.\n\n{{link}}\n\n¡Gracias!`}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
              rows={8}
              maxLength={1000}
            />
            <div className="text-xs text-slate-500 mt-1">
              {message.length}/1000 caracteres
            </div>
          </div>

          {/* Variables Info */}
          {variables.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-blue-900 mb-2">
                Variables detectadas ({variables.length}):
              </h4>
              <div className="flex flex-wrap gap-2">
                {variables.map((v) => (
                  <span
                    key={v}
                    className="px-2 py-1 bg-white border border-blue-300 rounded text-xs font-mono text-blue-700"
                  >
                    {`{{${v}}}`}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Preview Button */}
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="w-full px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-semibold hover:bg-slate-200 transition-colors"
          >
            {showPreview ? "Ocultar" : "Ver"} Vista Previa
          </button>

          {/* Preview */}
          {showPreview && (
            <div className="bg-[#e5ddd5] rounded-lg p-4" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg width=%2760%27 height=%2760%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cpath d=%27M30 30L0 0%27 stroke=%27%23000%27 stroke-opacity=%270.03%27 fill=%27none%27/%3E%3C/svg%3E')" }}>
              <div className="bg-white rounded-lg p-3 shadow-md max-w-[85%] ml-auto">
                <div className="text-sm text-slate-800 whitespace-pre-wrap break-words">
                  {previewMessage}
                </div>
                <div className="text-[10px] text-slate-400 text-right mt-1">
                  12:34
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-200 flex gap-3">
          <button
            onClick={onClose}
            disabled={isSaving}
            className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-semibold hover:bg-slate-200 transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving || !name || !message}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                {template ? "Actualizar" : "Crear"}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
