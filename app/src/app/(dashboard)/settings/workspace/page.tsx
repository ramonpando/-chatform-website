import { auth } from "@/lib/auth/config";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { tenants } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { WorkspaceForm } from "./workspace-form";

export default async function WorkspacePage() {
  const session = await auth();

  if (!session?.user?.tenantId) {
    redirect("/login");
  }

  const tenant = await db.query.tenants.findFirst({
    where: eq(tenants.id, session.user.tenantId),
  });

  if (!tenant) {
    redirect("/login");
  }

  return (
    <div className="max-w-2xl space-y-6">
      {/* Workspace Info */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">
            Información del Workspace
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Configura el nombre y branding de tu workspace
          </p>
        </div>

        <div className="p-6">
          <WorkspaceForm
            tenantId={tenant.id}
            defaultName={tenant.name}
            defaultSlug={tenant.slug}
          />
        </div>
      </div>

      {/* Branding Settings */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">
            Personalización de Marca
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Personaliza cómo se ven tus encuestas para tus clientes
          </p>
        </div>

        <div className="p-6 space-y-4">
          {/* Primary Color */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Color Primario
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                defaultValue="#1e293b"
                className="h-12 w-20 rounded-md border border-slate-300 cursor-pointer"
              />
              <input
                type="text"
                defaultValue="#1e293b"
                className="flex-1 px-4 py-2.5 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors font-mono text-sm"
                placeholder="#1e293b"
              />
            </div>
            <p className="mt-2 text-sm text-slate-500">
              Se usa en botones y elementos de la encuesta
            </p>
          </div>

          {/* Logo Upload */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Logo del Workspace
            </label>
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-slate-400 transition-colors cursor-pointer">
              <div className="flex flex-col items-center">
                <svg
                  className="w-12 h-12 text-slate-400 mb-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                <p className="text-sm font-medium text-slate-700 mb-1">
                  Click para subir o arrastra tu logo aquí
                </p>
                <p className="text-xs text-slate-500">
                  PNG, JPG o SVG (máx. 2MB)
                </p>
              </div>
              <input
                type="file"
                className="hidden"
                accept="image/png,image/jpeg,image/svg+xml"
              />
            </div>
          </div>

          {/* Custom Footer Text */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Texto de Footer (Opcional)
            </label>
            <input
              type="text"
              className="w-full px-4 py-2.5 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Ej: © 2025 Mi Empresa. Todos los derechos reservados."
            />
            <p className="mt-2 text-sm text-slate-500">
              Aparece al final de tus encuestas (solo plan Pro)
            </p>
          </div>

          {/* Show Branding Toggle */}
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-slate-900">
                Ocultar "Powered by ChatForm"
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                Remueve el branding de ChatForm en tus encuestas
              </p>
            </div>
            <div className="ml-4">
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" disabled />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
          <p className="text-xs text-slate-500 -mt-2">
            Disponible en plan Starter y superior
          </p>

          <button className="px-5 py-2.5 bg-slate-900 text-white rounded-md hover:bg-slate-800 transition-colors font-semibold">
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
}
