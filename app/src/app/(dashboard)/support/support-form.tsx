"use client";

import { useState } from "react";
import { Send } from "lucide-react";

interface SupportFormProps {
  userEmail: string;
  userName: string;
  tenantId: string;
}

export function SupportForm({ userEmail, userName, tenantId }: SupportFormProps) {
  const [subject, setSubject] = useState("");
  const [priority, setPriority] = useState<"low" | "normal" | "high">("normal");
  const [category, setCategory] = useState("technical");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [ticketNumber, setTicketNumber] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!subject || !message) {
      setError("Por favor completa todos los campos");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/support/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject,
          priority,
          category,
          message,
          userEmail,
          userName,
          tenantId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al crear ticket");
      }

      setSuccess(true);
      setTicketNumber(data.ticket?.ticketNumber || "N/A");
      setSubject("");
      setMessage("");
      setPriority("normal");
      setCategory("technical");

      // Reset success message after 5s
      setTimeout(() => {
        setSuccess(false);
        setTicketNumber("");
      }, 5000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {success && (
        <div className="rounded-lg bg-green-50 border border-green-200 p-4">
          <p className="text-sm font-medium text-green-900">
            ✓ Ticket creado exitosamente
          </p>
          <p className="text-sm text-green-800 mt-1">
            Te responderemos a {userEmail} lo antes posible. Número de ticket: <strong>{ticketNumber}</strong>
          </p>
        </div>
      )}

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Categoría
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-2.5 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={loading}
          >
            <option value="technical">Problema Técnico</option>
            <option value="billing">Facturación</option>
            <option value="feature">Solicitud de Feature</option>
            <option value="account">Cuenta y Configuración</option>
            <option value="api">Integración API</option>
            <option value="other">Otro</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Prioridad
          </label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as any)}
            className="w-full px-4 py-2.5 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={loading}
          >
            <option value="low">Baja - Pregunta general</option>
            <option value="normal">Normal - Necesito ayuda</option>
            <option value="high">Alta - Problema urgente</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Asunto
        </label>
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Describe brevemente tu problema"
          className="w-full px-4 py-2.5 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          disabled={loading}
          maxLength={200}
        />
        <p className="mt-1 text-xs text-slate-500">
          {subject.length}/200 caracteres
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Mensaje Detallado
        </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Describe tu problema con el mayor detalle posible. Incluye pasos para reproducir el error si aplica."
          rows={8}
          className="w-full px-4 py-2.5 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          disabled={loading}
          maxLength={2000}
        />
        <p className="mt-1 text-xs text-slate-500">
          {message.length}/2000 caracteres
        </p>
      </div>

      <div className="rounded-lg bg-slate-50 border border-slate-200 p-4">
        <p className="text-xs text-slate-600">
          <strong>Tip:</strong> Para una respuesta más rápida, incluye:
        </p>
        <ul className="mt-2 text-xs text-slate-600 list-disc list-inside space-y-1">
          <li>Pasos exactos para reproducir el problema</li>
          <li>Mensajes de error (si aplica)</li>
          <li>Navegador y sistema operativo que usas</li>
          <li>Capturas de pantalla (puedes adjuntarlas por email)</li>
        </ul>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-600">
          Tiempo de respuesta: <strong>24-48 horas</strong>
          {priority === "high" && <span className="text-orange-600 font-semibold"> (urgente: 2-4 horas)</span>}
        </p>
        <button
          type="submit"
          disabled={loading || !subject || !message}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            "Enviando..."
          ) : (
            <>
              Enviar Ticket
              <Send className="h-4 w-4" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
