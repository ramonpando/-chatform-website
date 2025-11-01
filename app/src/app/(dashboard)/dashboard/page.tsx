import { auth } from "@/lib/auth/config";
import { redirect } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { surveys, surveySessions, tenants } from "@/lib/db/schema";
import { eq, and, gte, sql } from "drizzle-orm";
import { FileText, MessageSquare, TrendingUp, ArrowRight, Sparkles, CheckCircle } from "lucide-react";
import { UsageIndicator } from "@/components/dashboard/usage-indicator";
import { type PlanType } from "@/lib/constants/pricing";

type ChangeType = "positive" | "negative" | "neutral";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.tenantId) {
    redirect("/login");
  }

  // Fetch tenant data for plan limits
  const tenant = await db.query.tenants.findFirst({
    where: eq(tenants.id, session.user.tenantId),
  });

  if (!tenant) {
    redirect("/login");
  }

  // Fetch real stats from DB
  const tenantSurveys = await db.query.surveys.findMany({
    where: eq(surveys.tenantId, session.user.tenantId),
  });

  const activeSurveys = tenantSurveys.filter((s) => s.status === "active").length;

  // Get responses this month
  const firstDayOfMonth = new Date();
  firstDayOfMonth.setDate(1);
  firstDayOfMonth.setHours(0, 0, 0, 0);

  const responsesThisMonth = await db.query.surveySessions.findMany({
    where: and(
      eq(surveySessions.tenantId, session.user.tenantId),
      eq(surveySessions.status, "completed"),
      gte(surveySessions.completedAt, firstDayOfMonth)
    ),
  });

  const totalResponsesThisMonth = responsesThisMonth.length;

  // Calculate completion rate
  const totalViews = tenantSurveys.reduce((sum, s) => sum + (s.viewCount || 0), 0);
  const totalResponses = tenantSurveys.reduce((sum, s) => sum + (s.responseCount || 0), 0);
  const completionRate = totalViews > 0 ? Math.round((totalResponses / totalViews) * 100) : 0;

  const stats: Array<{
    name: string;
    value: string;
    icon: any;
    change: string;
    changeType: ChangeType;
  }> = [
    {
      name: "Encuestas Activas",
      value: activeSurveys.toString(),
      icon: FileText,
      change: `${tenantSurveys.length} total`,
      changeType: "neutral",
    },
    {
      name: "Respuestas este mes",
      value: totalResponsesThisMonth.toString(),
      icon: MessageSquare,
      change: "en el mes actual",
      changeType: totalResponsesThisMonth > 0 ? "positive" : "neutral",
    },
    {
      name: "Tasa de Completado",
      value: `${completionRate}%`,
      icon: TrendingUp,
      change: `${totalResponses} de ${totalViews} vistas`,
      changeType: completionRate >= 50 ? "positive" : completionRate > 0 ? "neutral" : "neutral",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Hola, {session.user.name} 👋
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Aquí está el resumen de tus encuestas
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 lg:grid-cols-4 sm:grid-cols-2">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.name}
              className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-xs font-medium text-slate-600">
                    {stat.name}
                  </p>
                  <p className="mt-1.5 text-2xl font-bold text-slate-900">
                    {stat.value}
                  </p>
                </div>
                <div className="rounded-lg bg-blue-50 p-2">
                  <Icon className="h-4 w-4 text-blue-600" />
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-100">
                <span
                  className={`text-xs font-medium ${
                    stat.changeType === "positive"
                      ? "text-green-600"
                      : stat.changeType === "negative"
                      ? "text-red-600"
                      : "text-slate-500"
                  }`}
                >
                  {stat.change}
                </span>
                <span className="text-xs text-slate-500"> vs último mes</span>
              </div>
            </div>
          );
        })}

        {/* Usage Indicator Card */}
        <div className="lg:col-span-1">
          <UsageIndicator
            plan={tenant.plan as PlanType}
            responsesUsed={tenant.responsesUsedThisMonth}
            surveysCount={tenantSurveys.length}
          />
        </div>
      </div>

      {/* Empty State - AI Highlight */}
      <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl border border-slate-200 p-8 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100">
          <Sparkles className="h-8 w-8 text-blue-600" />
        </div>
        <h3 className="mt-4 text-xl font-bold text-slate-900">
          Crea tu primera encuesta con IA
        </h3>
        <p className="mt-2 text-sm text-slate-600 max-w-md mx-auto">
          Describe lo que quieres preguntar y la IA genera la encuesta completa en segundos
        </p>
        <div className="mt-6">
          <div className="relative inline-block group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-md opacity-75 group-hover:opacity-100 transition duration-300 blur-sm"></div>
            <Link
              href="/surveys/new"
              className="relative inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-md font-semibold hover:bg-slate-800 transition-all text-sm"
            >
              <Sparkles className="w-4 h-4" />
              Crear con IA
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Quick Benefits */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-4">
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <CheckCircle className="w-3.5 h-3.5 text-green-500" />
            <span>Gratis 25 respuestas</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <CheckCircle className="w-3.5 h-3.5 text-green-500" />
            <span>Lista en 2 minutos</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <CheckCircle className="w-3.5 h-3.5 text-green-500" />
            <span>Sin tarjeta</span>
          </div>
        </div>
      </div>

      {/* Quick Start Guide - AI Version */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="text-base font-semibold text-slate-900 mb-4">
          Cómo funciona ChatForm
        </h3>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-900 text-xs font-bold text-white flex-shrink-0">
              1
            </div>
            <div>
              <p className="font-semibold text-sm text-slate-900">Describe tu encuesta</p>
              <p className="text-xs text-slate-600 mt-0.5">
                "Quiero medir satisfacción post-compra" → La IA genera 5 preguntas optimizadas
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-900 text-xs font-bold text-white flex-shrink-0">
              2
            </div>
            <div>
              <p className="font-semibold text-sm text-slate-900">Comparte por WhatsApp</p>
              <p className="text-xs text-slate-600 mt-0.5">
                Obtén link corto o QR code. Tus clientes responden conversando
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-900 text-xs font-bold text-white flex-shrink-0">
              3
            </div>
            <div>
              <p className="font-semibold text-sm text-slate-900">Análisis automático</p>
              <p className="text-xs text-slate-600 mt-0.5">
                IA analiza respuestas, calcula NPS y genera insights accionables
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
