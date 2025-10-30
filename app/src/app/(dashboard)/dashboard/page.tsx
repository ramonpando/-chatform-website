import { auth } from "@/lib/auth/config";
import { redirect } from "next/navigation";
import { FileText, MessageSquare, TrendingUp, Users } from "lucide-react";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  // TODO: Fetch real stats from DB
  const stats = [
    {
      name: "Encuestas Activas",
      value: "0",
      icon: FileText,
      change: "+0%",
      changeType: "neutral" as const,
    },
    {
      name: "Respuestas este mes",
      value: "0",
      icon: MessageSquare,
      change: "+0%",
      changeType: "neutral" as const,
    },
    {
      name: "Tasa de Completado",
      value: "0%",
      icon: TrendingUp,
      change: "+0%",
      changeType: "neutral" as const,
    },
    {
      name: "Encuestas Totales",
      value: "0",
      icon: Users,
      change: "+0%",
      changeType: "neutral" as const,
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Bienvenido, {session.user.name}
        </h1>
        <p className="mt-2 text-gray-600">
          Aquí está un resumen de tus encuestas
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.name}
              className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {stat.name}
                  </p>
                  <p className="mt-2 text-3xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                </div>
                <div className="rounded-full bg-blue-50 p-3">
                  <Icon className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-4">
                <span
                  className={`text-sm font-medium ${
                    stat.changeType === "positive"
                      ? "text-green-600"
                      : stat.changeType === "negative"
                      ? "text-red-600"
                      : "text-gray-500"
                  }`}
                >
                  {stat.change}
                </span>
                <span className="text-sm text-gray-500"> vs mes anterior</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">
          <FileText className="h-8 w-8 text-blue-600" />
        </div>
        <h3 className="mt-4 text-lg font-semibold text-gray-900">
          No tienes encuestas todavía
        </h3>
        <p className="mt-2 text-gray-600">
          Comienza creando tu primera encuesta en WhatsApp
        </p>
        <div className="mt-6">
          <a
            href="/surveys/new"
            className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
          >
            Crear Primera Encuesta
          </a>
        </div>
      </div>

      {/* Quick Start Guide */}
      <div className="mt-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Guía Rápida
        </h3>
        <ol className="space-y-3">
          <li className="flex items-start gap-3">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
              1
            </span>
            <div>
              <p className="font-medium text-gray-900">Crea tu encuesta</p>
              <p className="text-sm text-gray-600">
                Agrega preguntas de opción múltiple, rating o texto abierto
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
              2
            </span>
            <div>
              <p className="font-medium text-gray-900">Comparte el link</p>
              <p className="text-sm text-gray-600">
                Obtén un link corto o QR code para compartir
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
              3
            </span>
            <div>
              <p className="font-medium text-gray-900">Recibe respuestas</p>
              <p className="text-sm text-gray-600">
                Tus clientes responden directamente por WhatsApp
              </p>
            </div>
          </li>
        </ol>
      </div>
    </div>
  );
}
