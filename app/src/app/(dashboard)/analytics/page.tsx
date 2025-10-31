import { auth } from "@/lib/auth/config";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { surveys, surveySessions, responses } from "@/lib/db/schema";
import { eq, and, gte, desc, sql, count } from "drizzle-orm";
import {
  TrendingUp,
  Users,
  MessageSquare,
  FileText,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import Link from "next/link";
import { AnalyticsCharts } from "./analytics-charts";

export default async function AnalyticsPage() {
  const session = await auth();

  if (!session?.user?.tenantId) {
    redirect("/login");
  }

  // Get tenant surveys
  const tenantSurveys = await db.query.surveys.findMany({
    where: eq(surveys.tenantId, session.user.tenantId),
    orderBy: [desc(surveys.createdAt)],
  });

  // Calculate date range (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  // Get all completed sessions in last 30 days
  const recentSessions = await db.query.surveySessions.findMany({
    where: and(
      eq(surveySessions.tenantId, session.user.tenantId),
      eq(surveySessions.status, "completed"),
      gte(surveySessions.completedAt, thirtyDaysAgo)
    ),
    with: {
      survey: true,
      responses: true,
    },
    orderBy: [desc(surveySessions.completedAt)],
  });

  // Calculate stats
  const totalSurveys = tenantSurveys.length;
  const activeSurveys = tenantSurveys.filter((s) => s.status === "active").length;
  const totalResponses = recentSessions.length;
  const totalViews = tenantSurveys.reduce((sum, s) => sum + (s.viewCount || 0), 0);

  // Calculate average completion rate
  const avgCompletionRate =
    totalViews > 0 ? Math.round((totalResponses / totalViews) * 100) : 0;

  // Group responses by date for chart
  const responsesByDate = recentSessions.reduce((acc: Record<string, number>, session) => {
    if (session.completedAt) {
      const date = session.completedAt.toISOString().split("T")[0];
      acc[date] = (acc[date] || 0) + 1;
    }
    return acc;
  }, {});

  // Convert to array for chart
  const chartData = Object.entries(responsesByDate)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));

  // Top performing surveys
  const surveyPerformance = tenantSurveys
    .map((survey) => {
      const surveyResponses = recentSessions.filter(
        (s) => s.surveyId === survey.id
      ).length;
      const completionRate =
        survey.viewCount > 0
          ? Math.round((surveyResponses / survey.viewCount) * 100)
          : 0;

      return {
        id: survey.id,
        title: survey.title,
        responses: surveyResponses,
        views: survey.viewCount || 0,
        completionRate,
      };
    })
    .sort((a, b) => b.responses - a.responses)
    .slice(0, 5);

  // Calculate trend (compare with previous 30 days)
  const sixtyDaysAgo = new Date();
  sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

  const previousPeriodSessions = await db.query.surveySessions.findMany({
    where: and(
      eq(surveySessions.tenantId, session.user.tenantId),
      eq(surveySessions.status, "completed"),
      gte(surveySessions.completedAt, sixtyDaysAgo),
      sql`${surveySessions.completedAt} < ${thirtyDaysAgo}`
    ),
  });

  const previousResponses = previousPeriodSessions.length;
  const responseTrend =
    previousResponses > 0
      ? Math.round(((totalResponses - previousResponses) / previousResponses) * 100)
      : totalResponses > 0
      ? 100
      : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Analíticas</h1>
          <p className="mt-2 text-slate-600">
            Vista general del rendimiento de todas tus encuestas
          </p>
        </div>

        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Calendar className="w-4 h-4" />
          <span>Últimos 30 días</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Respuestas"
          value={totalResponses.toString()}
          icon={<MessageSquare className="w-5 h-5" />}
          trend={responseTrend}
          trendLabel="vs mes anterior"
        />
        <StatCard
          title="Encuestas Activas"
          value={activeSurveys.toString()}
          subtitle={`de ${totalSurveys} total`}
          icon={<FileText className="w-5 h-5" />}
        />
        <StatCard
          title="Total Vistas"
          value={totalViews.toString()}
          icon={<Users className="w-5 h-5" />}
        />
        <StatCard
          title="Tasa Promedio"
          value={`${avgCompletionRate}%`}
          icon={<TrendingUp className="w-5 h-5" />}
          subtitle="de completado"
        />
      </div>

      {/* Charts */}
      <AnalyticsCharts data={chartData} />

      {/* Top Performing Surveys */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">
            Top 5 Encuestas
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Las encuestas con más respuestas en los últimos 30 días
          </p>
        </div>

        <div className="p-6">
          {surveyPerformance.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <p className="text-sm">No hay datos suficientes aún</p>
              <Link
                href="/surveys/new"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium mt-2 inline-block"
              >
                Crea tu primera encuesta
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {surveyPerformance.map((survey, index) => (
                <div
                  key={survey.id}
                  className="flex items-center gap-4 p-4 border border-slate-200 rounded-lg hover:border-slate-300 hover:shadow-sm transition-all"
                >
                  {/* Rank */}
                  <div className="flex-shrink-0 w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-slate-700">
                      #{index + 1}
                    </span>
                  </div>

                  {/* Survey Info */}
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/surveys/${survey.id}/results`}
                      className="font-semibold text-slate-900 hover:text-blue-600 transition-colors truncate block"
                    >
                      {survey.title}
                    </Link>
                    <div className="flex items-center gap-4 mt-1 text-sm text-slate-600">
                      <span>{survey.responses} respuestas</span>
                      <span>•</span>
                      <span>{survey.views} vistas</span>
                      <span>•</span>
                      <span>{survey.completionRate}% completado</span>
                    </div>
                  </div>

                  {/* Action */}
                  <Link
                    href={`/surveys/${survey.id}/results`}
                    className="flex-shrink-0 px-4 py-2 text-sm font-semibold text-slate-700 bg-slate-100 rounded-md hover:bg-slate-200 transition-colors"
                  >
                    Ver Detalles
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">
            Actividad Reciente
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Últimas respuestas recibidas
          </p>
        </div>

        <div className="p-6">
          {recentSessions.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <p className="text-sm">No hay actividad reciente</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentSessions.slice(0, 10).map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:border-slate-300 transition-colors"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900">
                      {session.survey?.title || "Encuesta"}
                    </p>
                    <p className="text-xs text-slate-600 mt-1">
                      {session.whatsappName || session.phoneNumber || "Anónimo"} •{" "}
                      {session.responses?.length || 0} respuestas
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500">
                      {session.completedAt
                        ? new Date(session.completedAt).toLocaleDateString("es", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : ""}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  trendLabel,
}: {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: number;
  trendLabel?: string;
}) {
  const isPositive = trend && trend > 0;
  const isNegative = trend && trend < 0;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg">{icon}</div>
        {trend !== undefined && (
          <div
            className={`flex items-center gap-1 text-xs font-semibold ${
              isPositive
                ? "text-green-600"
                : isNegative
                ? "text-red-600"
                : "text-slate-500"
            }`}
          >
            {isPositive && <ArrowUpRight className="w-3.5 h-3.5" />}
            {isNegative && <ArrowDownRight className="w-3.5 h-3.5" />}
            {trend > 0 ? "+" : ""}
            {trend}%
          </div>
        )}
      </div>

      <div>
        <p className="text-sm font-medium text-slate-600">{title}</p>
        <p className="text-3xl font-bold text-slate-900 mt-1">{value}</p>
        {(subtitle || trendLabel) && (
          <p className="text-xs text-slate-500 mt-2">
            {subtitle || trendLabel}
          </p>
        )}
      </div>
    </div>
  );
}
