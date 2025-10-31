import { auth } from "@/lib/auth/config";
import { redirect } from "next/navigation";
import { ProfileForm } from "./profile-form";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="max-w-2xl space-y-6">
      {/* Profile Section */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">
            Información Personal
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Actualiza tu información de perfil
          </p>
        </div>

        <div className="p-6">
          <ProfileForm
            defaultName={session.user.name || ""}
            defaultEmail={session.user.email || ""}
          />
        </div>
      </div>

      {/* Password Section */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">
            Cambiar Contraseña
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Actualiza tu contraseña para mantener tu cuenta segura
          </p>
        </div>

        <div className="p-6">
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Contraseña Actual
              </label>
              <input
                type="password"
                className="w-full px-4 py-2.5 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Ingresa tu contraseña actual"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Nueva Contraseña
              </label>
              <input
                type="password"
                className="w-full px-4 py-2.5 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Mínimo 8 caracteres"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Confirmar Nueva Contraseña
              </label>
              <input
                type="password"
                className="w-full px-4 py-2.5 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Repite la nueva contraseña"
              />
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 bg-slate-900 text-white rounded-md hover:bg-slate-800 transition-colors font-semibold"
            >
              Actualizar Contraseña
            </button>
          </form>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-white rounded-xl border-2 border-red-200 shadow-sm">
        <div className="p-6 border-b border-red-200 bg-red-50">
          <h2 className="text-lg font-semibold text-red-900">Zona de Peligro</h2>
          <p className="mt-1 text-sm text-red-700">
            Acciones irreversibles con tu cuenta
          </p>
        </div>

        <div className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-slate-900">
                Eliminar Cuenta
              </h3>
              <p className="mt-1 text-sm text-slate-600">
                Elimina permanentemente tu cuenta y todos los datos asociados.
                Esta acción no se puede deshacer.
              </p>
            </div>
            <button className="ml-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors font-semibold text-sm">
              Eliminar Cuenta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
