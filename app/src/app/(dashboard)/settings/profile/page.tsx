import { auth } from "@/lib/auth/config";
import { redirect } from "next/navigation";
import { ProfileForm } from "./profile-form";
import { PasswordForm } from "./password-form";
import { DeleteAccountButton } from "./delete-account-button";

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
          <PasswordForm />
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
            <DeleteAccountButton />
          </div>
        </div>
      </div>
    </div>
  );
}
