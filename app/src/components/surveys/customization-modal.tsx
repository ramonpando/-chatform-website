"use client";

import { useState } from "react";
import { X, Palette, Image as ImageIcon, Sparkles } from "lucide-react";

interface CustomizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialBrandColor?: string;
  initialAccentColor?: string;
  initialLogoUrl?: string;
  onSave: (data: {
    brandColor: string;
    accentColor: string;
    logoUrl: string;
  }) => void;
}

export function CustomizationModal({
  isOpen,
  onClose,
  initialBrandColor = "#2563eb",
  initialAccentColor = "#06b6d4",
  initialLogoUrl = "",
  onSave,
}: CustomizationModalProps) {
  const [brandColor, setBrandColor] = useState(initialBrandColor);
  const [accentColor, setAccentColor] = useState(initialAccentColor);
  const [logoUrl, setLogoUrl] = useState(initialLogoUrl);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave({ brandColor, accentColor, logoUrl });
    onClose();
  };

  // Preset colors
  const presetColors = [
    { name: "Azul", primary: "#2563eb", accent: "#06b6d4" },
    { name: "Verde", primary: "#059669", accent: "#10b981" },
    { name: "Púrpura", primary: "#7c3aed", accent: "#a78bfa" },
    { name: "Rosa", primary: "#db2777", accent: "#f472b6" },
    { name: "Naranja", primary: "#ea580c", accent: "#fb923c" },
    { name: "Índigo", primary: "#4f46e5", accent: "#818cf8" },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg">
              <Palette className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Personalizar Encuesta
              </h2>
              <p className="text-sm text-slate-600 mt-0.5">
                Cambia colores y logo de la página pública
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Color Presets */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-3">
              🎨 Colores Predefinidos
            </label>
            <div className="grid grid-cols-3 gap-3">
              {presetColors.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => {
                    setBrandColor(preset.primary);
                    setAccentColor(preset.accent);
                  }}
                  className="p-4 border-2 border-slate-200 rounded-xl hover:border-slate-300 transition-all hover:shadow-md group"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className="w-8 h-8 rounded-lg shadow-sm"
                      style={{ backgroundColor: preset.primary }}
                    />
                    <div
                      className="w-8 h-8 rounded-lg shadow-sm"
                      style={{ backgroundColor: preset.accent }}
                    />
                  </div>
                  <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">
                    {preset.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Colors */}
          <div className="grid grid-cols-2 gap-4">
            {/* Brand Color */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Color Principal
              </label>
              <div className="flex gap-3">
                <input
                  type="color"
                  value={brandColor}
                  onChange={(e) => setBrandColor(e.target.value)}
                  className="w-16 h-12 rounded-lg border-2 border-slate-200 cursor-pointer"
                />
                <input
                  type="text"
                  value={brandColor}
                  onChange={(e) => setBrandColor(e.target.value)}
                  placeholder="#2563eb"
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Cabecera y botones principales
              </p>
            </div>

            {/* Accent Color */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Color de Acento
              </label>
              <div className="flex gap-3">
                <input
                  type="color"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="w-16 h-12 rounded-lg border-2 border-slate-200 cursor-pointer"
                />
                <input
                  type="text"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  placeholder="#06b6d4"
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Degradados y detalles
              </p>
            </div>
          </div>

          {/* Logo URL */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2 flex items-center gap-2">
              <ImageIcon className="w-4 h-4" />
              Logo (URL)
            </label>
            <input
              type="url"
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              placeholder="https://tu-sitio.com/logo.png"
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="text-xs text-slate-500 mt-2">
              URL de tu logo (opcional). Aparecerá en la cabecera de la encuesta.
            </p>
            {logoUrl && (
              <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                <p className="text-xs font-medium text-slate-600 mb-2">Vista previa:</p>
                <img
                  src={logoUrl}
                  alt="Logo preview"
                  className="max-h-16 rounded"
                  onError={(e) => {
                    e.currentTarget.src = "";
                    e.currentTarget.alt = "Error al cargar imagen";
                  }}
                />
              </div>
            )}
          </div>

          {/* Preview */}
          <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl p-6 border border-slate-200">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-semibold text-slate-900">
                Vista Previa
              </h3>
            </div>

            {/* Mock Survey Page */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-sm mx-auto">
              {/* Header */}
              <div
                className="px-6 py-5 text-white"
                style={{
                  background: `linear-gradient(135deg, ${brandColor} 0%, ${accentColor} 100%)`,
                }}
              >
                <div className="flex items-center gap-3">
                  {logoUrl ? (
                    <img
                      src={logoUrl}
                      alt="Logo"
                      className="h-10 w-auto bg-white/20 rounded-lg p-1"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">📋</span>
                    </div>
                  )}
                  <div>
                    <h4 className="font-bold text-lg">Tu Encuesta</h4>
                    <p className="text-sm opacity-90">Vista previa</p>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="p-4 space-y-3">
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100 rounded-lg p-3">
                  <p className="text-sm text-slate-700">
                    ¡Hola! Gracias por tu tiempo...
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                  <Sparkles
                    className="w-4 h-4"
                    style={{ color: brandColor }}
                  />
                  <span>Preguntas</span>
                </div>

                <div className="space-y-2">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <p className="text-sm font-medium text-slate-900">
                      1. ¿Cuál es tu email?
                    </p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <p className="text-sm font-medium text-slate-900">
                      2. Califica el servicio
                    </p>
                  </div>
                </div>

                <button
                  className="w-full py-3 rounded-lg text-white font-semibold text-sm shadow-md"
                  style={{ backgroundColor: brandColor }}
                >
                  Responder en WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200 bg-slate-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-700 hover:bg-slate-200 rounded-lg transition-colors font-medium"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-sm hover:shadow-md flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            Guardar Personalización
          </button>
        </div>
      </div>
    </div>
  );
}
