"use client";

import { useState } from "react";

export function PasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validate
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Todos los campos son requeridos");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Las contraseñas nuevas no coinciden");
      return;
    }

    if (newPassword.length < 8) {
      setError("La nueva contraseña debe tener al menos 8 caracteres");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/user/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al actualizar contraseña");
      }

      setSuccess("Contraseña actualizada exitosamente");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {success && (
        <div className="rounded-lg bg-green-50 border border-green-200 p-4">
          <p className="text-sm text-green-800">{success}</p>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Contraseña Actual
        </label>
        <input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className="w-full px-4 py-2.5 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          placeholder="Ingresa tu contraseña actual"
          disabled={loading}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Nueva Contraseña
        </label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full px-4 py-2.5 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          placeholder="Mínimo 8 caracteres"
          disabled={loading}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Confirmar Nueva Contraseña
        </label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full px-4 py-2.5 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          placeholder="Repite la nueva contraseña"
          disabled={loading}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="px-5 py-2.5 bg-slate-900 text-white rounded-md hover:bg-slate-800 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Actualizando..." : "Actualizar Contraseña"}
      </button>
    </form>
  );
}
