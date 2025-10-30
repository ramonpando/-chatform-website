import { auth } from "@/lib/auth/config";
import { db } from "@/lib/db";
import { surveys } from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus, FileText, ExternalLink, QrCode, Sparkles, TrendingUp, ArrowRight } from "lucide-react";

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
          <h1 className="text-3xl font-bold text-slate-900">Mis Encuestas</h1>
          <p className="mt-2 text-slate-600">
            {userSurveys.length} de {tenant?.surveysLimit || 1} encuestas creadas
          </p>
        </div>

        {canCreateMore ? (
          <Link
            href="/surveys/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-md font-semibold hover:bg-slate-800 transition-all shadow-sm hover:shadow-md"
          >
            <Sparkles className="w-4 h-4" />
            Crear con IA
            <ArrowRight className="w-4 h-4" />
          </Link>
        ) : (
          <div className="text-right">
            <button
              disabled
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-200 text-slate-400 rounded-md cursor-not-allowed font-semibold"
            >
              <Plus className="w-4 h-4" />
              Nueva Encuesta
            </button>
            <p className="mt-2 text-sm text-slate-600">
              Límite alcanzado.{" "}
              <Link href="/settings/billing" className="text-blue-600 hover:text-blue-700 font-medium underline">
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
    <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100">
        <Sparkles className="h-10 w-10 text-blue-600" />
      </div>
      <h3 className="mt-6 text-2xl font-bold text-slate-900">
        Crea tu primera encuesta con IA
      </h3>
      <p className="mt-3 text-slate-600 max-w-md mx-auto">
        Describe lo que quieres preguntar y la IA genera la encuesta completa en segundos. Lista para enviar por WhatsApp.
      </p>
      <div className="mt-8">
        <div className="relative inline-block group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-md opacity-75 group-hover:opacity-100 transition duration-300 blur-sm"></div>
          <Link
            href="/surveys/new"
            className="relative inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-md font-semibold hover:bg-slate-800 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            Crear con IA
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
      <div className="mt-6 flex items-center justify-center gap-4 text-sm text-slate-500">
        <span>⚡ En 2 minutos</span>
        <span>•</span>
        <span>💬 Optimizado para WhatsApp</span>
        <span>•</span>
        <span>📊 Con análisis automático</span>
      </div>
    </div>
  );
}

function SurveyCard({ survey }: { survey: any }) {
  const statusColors = {
    draft: "bg-slate-100 text-slate-700 border border-slate-200",
    active: "bg-green-50 text-green-700 border border-green-200",
    paused: "bg-yellow-50 text-yellow-700 border border-yellow-200",
    archived: "bg-red-50 text-red-700 border border-red-200",
  };

  const statusLabels = {
    draft: "Borrador",
    active: "Activa",
    paused: "Pausada",
    archived: "Archivada",
  };

  // Calculate completion rate
  const completionRate = survey.viewCount > 0
    ? Math.round((survey.responseCount / survey.viewCount) * 100)
    : 0;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg hover:border-slate-300 transition-all group">
      {/* Status Badge */}
      <div className="flex items-start justify-between mb-4">
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            statusColors[survey.status as keyof typeof statusColors]
          }`}
        >
          {statusLabels[survey.status as keyof typeof statusLabels]}
        </span>

        {survey.status === "active" && (
          <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span>En vivo</span>
          </div>
        )}
      </div>

      {/* Title & Description */}
      <h3 className="text-lg font-semibold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
        {survey.title}
      </h3>
      <p className="text-slate-600 text-sm mb-4 line-clamp-2">
        {survey.description || "Sin descripción"}
      </p>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-5 pb-5 border-b border-slate-100">
        <div>
          <p className="text-2xl font-bold text-slate-900">
            {survey.responseCount || 0}
          </p>
          <p className="text-xs text-slate-500 font-medium">Respuestas</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-slate-900">
            {survey.viewCount || 0}
          </p>
          <p className="text-xs text-slate-500 font-medium">Vistas</p>
        </div>
        <div>
          <div className="flex items-baseline gap-1">
            <p className="text-2xl font-bold text-slate-900">
              {completionRate}
            </p>
            <span className="text-sm font-medium text-slate-500">%</span>
          </div>
          <p className="text-xs text-slate-500 font-medium">Tasa</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Link
          href={`/surveys/${survey.id}/edit`}
          className="flex-1 px-3 py-2 text-sm font-semibold text-slate-700 bg-slate-100 rounded-md hover:bg-slate-200 transition-colors text-center"
        >
          Editar
        </Link>

        {survey.status === "active" && (
          <>
            <Link
              href={`/surveys/${survey.id}/results`}
              className="flex-1 px-3 py-2 text-sm font-semibold text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors text-center"
            >
              Resultados
            </Link>
            <Link
              href={`/surveys/${survey.id}/share`}
              className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
              title="Compartir"
            >
              <ExternalLink className="w-5 h-5" />
            </Link>
          </>
        )}
      </div>

      {/* Short Code */}
      {survey.shortCode && (
        <div className="mt-4 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <QrCode className="w-3.5 h-3.5" />
            <code className="bg-slate-100 px-2 py-1 rounded text-slate-700 font-mono">
              chatform.io/{survey.shortCode}
            </code>
          </div>
        </div>
      )}
    </div>
  );
}
