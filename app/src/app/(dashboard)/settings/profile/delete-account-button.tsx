"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

export function DeleteAccountButton() {
  const [showModal, setShowModal] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleDelete = async () => {
    setError("");

    if (confirmation !== "ELIMINAR") {
      setError('Debes escribir "ELIMINAR" para confirmar');
      return;
    }

    if (!password) {
      setError("Ingresa tu contraseña para confirmar");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/user/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, confirmation }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al eliminar cuenta");
      }

      // Sign out and redirect
      await signOut({ redirect: false });
      router.push("/");
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="ml-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors font-semibold text-sm"
      >
        Eliminar Cuenta
      </button>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-xl">
            <h3 className="text-xl font-bold text-slate-900 mb-4">
              ¿Eliminar Cuenta?
            </h3>

            <div className="mb-6 rounded-lg bg-red-50 border border-red-200 p-4">
              <p className="text-sm font-semibold text-red-900 mb-2">
                ⚠️ Esta acción es irreversible
              </p>
              <p className="text-sm text-red-800">
                Se eliminarán permanentemente:
              </p>
              <ul className="mt-2 text-sm text-red-800 list-disc list-inside space-y-1">
                <li>Tu cuenta y perfil</li>
                <li>Todas tus encuestas</li>
                <li>Todas las respuestas recibidas</li>
                <li>Configuraciones y datos</li>
              </ul>
            </div>

            {error && (
              <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Confirma tu contraseña
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Tu contraseña"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Escribe <strong>ELIMINAR</strong> para confirmar
                </label>
                <input
                  type="text"
                  value={confirmation}
                  onChange={(e) => setConfirmation(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="ELIMINAR"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => {
                  setShowModal(false);
                  setPassword("");
                  setConfirmation("");
                  setError("");
                }}
                disabled={loading}
                className="flex-1 px-4 py-2.5 border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50 transition-colors font-semibold disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                disabled={loading || confirmation !== "ELIMINAR"}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Eliminando..." : "Eliminar Cuenta"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
