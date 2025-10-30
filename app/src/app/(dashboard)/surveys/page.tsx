import { auth } from "@/lib/auth/config";
import { db } from "@/lib/db";
import { surveys } from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus, FileText, ExternalLink, QrCode } from "lucide-react";

export default async function SurveysPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  // Get user's surveys
  const userSurveys = await db.query.surveys.findMany({
    where: eq(surveys.tenantId, session.user.tenantId),
    orderBy: [desc(surveys.createdAt)],
  });

  // Get tenant to check limits
  const tenant = await db.query.tenants.findFirst({
    where: eq(surveys.tenantId, session.user.tenantId),
  });

  const canCreateMore = userSurveys.length < (tenant?.surveysLimit || 1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mis Encuestas</h1>
          <p className="mt-2 text-gray-600">
            {userSurveys.length} de {tenant?.surveysLimit || 1} encuestas creadas
          </p>
        </div>

        {canCreateMore ? (
          <Link
            href="/surveys/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Nueva Encuesta
          </Link>
        ) : (
          <div className="text-right">
            <button
              disabled
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed"
            >
              <Plus className="w-5 h-5" />
              Nueva Encuesta
            </button>
            <p className="mt-1 text-sm text-gray-500">
              Límite alcanzado.{" "}
              <Link href="/settings/billing" className="text-blue-600 hover:underline">
                Actualiza tu plan
              </Link>
            </p>
          </div>
        )}
      </div>

      {/* Surveys List */}
      {userSurveys.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {userSurveys.map((survey) => (
            <SurveyCard key={survey.id} survey={survey} />
          ))}
        </div>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
      <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        No tienes encuestas todavía
      </h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        Crea tu primera encuesta conversacional para WhatsApp y empieza a recibir respuestas
      </p>
      <Link
        href="/surveys/new"
        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        <Plus className="w-5 h-5" />
        Crear Primera Encuesta
      </Link>
    </div>
  );
}

function SurveyCard({ survey }: { survey: any }) {
  const statusColors = {
    draft: "bg-gray-100 text-gray-700",
    active: "bg-green-100 text-green-700",
    paused: "bg-yellow-100 text-yellow-700",
    archived: "bg-red-100 text-red-700",
  };

  const statusLabels = {
    draft: "Borrador",
    active: "Activa",
    paused: "Pausada",
    archived: "Archivada",
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      {/* Status Badge */}
      <div className="flex items-start justify-between mb-4">
        <span
          className={`px-2.5 py-1 rounded-full text-xs font-medium ${
            statusColors[survey.status as keyof typeof statusColors]
          }`}
        >
          {statusLabels[survey.status as keyof typeof statusLabels]}
        </span>

        {survey.status === "active" && (
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span>En vivo</span>
          </div>
        )}
      </div>

      {/* Title & Description */}
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {survey.title}
      </h3>
      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
        {survey.description || "Sin descripción"}
      </p>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b border-gray-100">
        <div>
          <p className="text-2xl font-bold text-gray-900">
            {survey.responseCount || 0}
          </p>
          <p className="text-xs text-gray-500">Respuestas</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-900">
            {survey.viewCount || 0}
          </p>
          <p className="text-xs text-gray-500">Vistas</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Link
          href={`/surveys/${survey.id}/edit`}
          className="flex-1 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-center"
        >
          Editar
        </Link>

        {survey.status === "active" && (
          <>
            <Link
              href={`/surveys/${survey.id}/results`}
              className="flex-1 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-center"
            >
              Ver Resultados
            </Link>
            <Link
              href={`/surveys/${survey.id}/share`}
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Compartir"
            >
              <ExternalLink className="w-5 h-5" />
            </Link>
          </>
        )}
      </div>

      {/* Short Code */}
      {survey.shortCode && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <QrCode className="w-4 h-4" />
            <code className="bg-gray-100 px-2 py-1 rounded">
              chatform.io/{survey.shortCode}
            </code>
          </div>
        </div>
      )}
    </div>
  );
}
