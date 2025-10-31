"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

export function WorkspaceForm({
  tenantId,
  defaultName,
  defaultSlug,
}: {
  tenantId: string;
  defaultName: string;
  defaultSlug: string;
}) {
  const [name, setName] = useState(defaultName);
  const [slug, setSlug] = useState(defaultSlug);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/tenant", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, slug }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Error al actualizar workspace");
      }

      setMessage({
        type: "success",
        text: "Workspace actualizado correctamente",
      });
    } catch (error: any) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Nombre del Workspace
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2.5 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          placeholder="Mi Empresa"
        />
        <p className="mt-2 text-sm text-slate-500">
          El nombre visible de tu workspace
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Slug del Workspace
        </label>
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-500">chatform.io/</span>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value.toLowerCase())}
            className="flex-1 px-4 py-2.5 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors font-mono"
            placeholder="mi-empresa"
            pattern="[a-z0-9-]+"
          />
        </div>
        <p className="mt-2 text-sm text-slate-500">
          Solo letras minúsculas, números y guiones
        </p>
      </div>

      {message && (
        <div
          className={`p-4 rounded-md ${
            message.type === "success"
              ? "bg-green-50 border border-green-200 text-green-800"
              : "bg-red-50 border border-red-200 text-red-800"
          }`}
        >
          <p className="text-sm font-medium">{message.text}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={saving}
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-md hover:bg-slate-800 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {saving ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Guardando...
          </>
        ) : (
          "Guardar Cambios"
        )}
      </button>
    </form>
  );
}
