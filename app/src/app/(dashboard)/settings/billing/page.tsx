import { auth } from "@/lib/auth/config";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { tenants } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { Check, Sparkles, Zap, Crown } from "lucide-react";
import Link from "next/link";

export default async function BillingPage() {
  const session = await auth();

  if (!session?.user?.tenantId) {
    redirect("/login");
  }

  // Get tenant info
  const tenant = await db.query.tenants.findFirst({
    where: eq(tenants.id, session.user.tenantId),
  });

  if (!tenant) {
    redirect("/login");
  }

  const currentPlan = (tenant.plan || "free").toLowerCase();

  // Define plans
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "siempre gratis",
      icon: Check,
      iconColor: "text-slate-600",
      bgColor: "bg-slate-50",
      borderColor: "border-slate-200",
      features: [
        "25 respuestas por mes",
        "1 encuesta activa",
        "Link y QR básico",
        "Branding de ChatForm",
      ],
      limits: {
        responses: 25,
        surveys: 1,
        sends: 0,
      },
    },
    {
      name: "Starter",
      price: "$29",
      period: "/mes",
      icon: Zap,
      iconColor: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      popular: true,
      features: [
        "500 respuestas por mes",
        "3 encuestas activas",
        "AI Survey Generator",
        "Exportar CSV",
        "100 envíos automáticos",
        "Sin branding",
      ],
      limits: {
        responses: 500,
        surveys: 3,
        sends: 100,
      },
    },
    {
      name: "Pro",
      price: "$79",
      period: "/mes",
      icon: Crown,
      iconColor: "text-purple-600",
      bgColor: "bg-gradient-to-br from-purple-50 to-pink-50",
      borderColor: "border-purple-200",
      features: [
        "2,000 respuestas por mes",
        "Encuestas ilimitadas",
        "AI Analysis & Insights",
        "500 envíos automáticos",
        "API completa",
        "Soporte prioritario",
      ],
      limits: {
        responses: 2000,
        surveys: 999,
        sends: 500,
      },
    },
  ];

  const currentPlanData = plans.find(
    (p) => p.name.toLowerCase() === currentPlan
  ) || plans[0];

  return (
    <div className="max-w-5xl space-y-6">
      {/* Current Plan Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">Plan Actual</h2>
          <p className="mt-1 text-sm text-slate-600">
            Tu plan y uso del servicio
          </p>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div
                className={`p-3 rounded-lg ${currentPlanData.bgColor} border ${currentPlanData.borderColor}`}
              >
                <currentPlanData.icon
                  className={`w-6 h-6 ${currentPlanData.iconColor}`}
                />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900">
                  {currentPlanData.name}
                </h3>
                <p className="text-sm text-slate-600">
                  {currentPlanData.price}
                  {currentPlanData.period}
                </p>
              </div>
            </div>

            {currentPlan !== "pro" && (
              <Link
                href="#planes"
                className="px-5 py-2.5 bg-slate-900 text-white rounded-md hover:bg-slate-800 transition-colors font-semibold"
              >
                Actualizar Plan
              </Link>
            )}
          </div>

          {/* Usage Stats */}
          <div className="space-y-4">
            <UsageBar
              label="Respuestas este mes"
              used={tenant.responsesUsed || 0}
              limit={tenant.responsesLimit || currentPlanData.limits.responses}
            />
            <UsageBar
              label="Encuestas activas"
              used={0} // TODO: Get from DB count
              limit={tenant.surveysLimit || currentPlanData.limits.surveys}
            />
            <UsageBar
              label="Envíos automáticos"
              used={tenant.whatsappSendsUsed || 0}
              limit={
                tenant.whatsappSendsLimit || currentPlanData.limits.sends
              }
            />
          </div>
        </div>
      </div>

      {/* All Plans */}
      <div id="planes">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">
          Todos los Planes
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan) => {
            const isCurrent = plan.name.toLowerCase() === currentPlan;
            const PlanIcon = plan.icon;

            return (
              <div
                key={plan.name}
                className={`bg-white rounded-xl border-2 shadow-sm transition-all hover:shadow-md ${
                  plan.popular
                    ? "border-blue-500 ring-2 ring-blue-100"
                    : "border-slate-200"
                } ${isCurrent ? "ring-2 ring-slate-900" : ""}`}
              >
                {plan.popular && (
                  <div className="bg-blue-500 text-white text-xs font-bold text-center py-2 rounded-t-lg">
                    MÁS POPULAR
                  </div>
                )}

                <div className="p-6">
                  <div
                    className={`inline-flex p-3 rounded-lg ${plan.bgColor} border ${plan.borderColor} mb-4`}
                  >
                    <PlanIcon className={`w-6 h-6 ${plan.iconColor}`} />
                  </div>

                  <h3 className="text-2xl font-bold text-slate-900 mb-1">
                    {plan.name}
                  </h3>

                  <div className="mb-6">
                    <span className="text-4xl font-bold text-slate-900">
                      {plan.price}
                    </span>
                    <span className="text-slate-600 ml-1">{plan.period}</span>
                  </div>

                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {isCurrent ? (
                    <button
                      disabled
                      className="w-full py-2.5 bg-slate-100 text-slate-400 rounded-md font-semibold cursor-not-allowed"
                    >
                      Plan Actual
                    </button>
                  ) : (
                    <button className="w-full py-2.5 bg-slate-900 text-white rounded-md hover:bg-slate-800 transition-colors font-semibold">
                      {currentPlan === "free"
                        ? "Comenzar"
                        : plan.name === "Free"
                        ? "Downgrade"
                        : "Actualizar"}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Billing History (if Pro/Starter) */}
      {currentPlan !== "free" && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-lg font-semibold text-slate-900">
              Historial de Pagos
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Descarga tus facturas anteriores
            </p>
          </div>

          <div className="p-6">
            <div className="text-center py-12 text-slate-500">
              <p className="text-sm">No hay pagos registrados aún</p>
              <p className="text-xs mt-1">
                Tus facturas aparecerán aquí después del primer cobro
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function UsageBar({
  label,
  used,
  limit,
}: {
  label: string;
  used: number;
  limit: number;
}) {
  const percentage = limit > 0 ? Math.min((used / limit) * 100, 100) : 0;
  const isNearLimit = percentage > 80;

  return (
    <div>
      <div className="flex items-center justify-between text-sm mb-2">
        <span className="font-medium text-slate-700">{label}</span>
        <span
          className={`font-semibold ${
            isNearLimit ? "text-orange-600" : "text-slate-600"
          }`}
        >
          {used} / {limit === 999 ? "∞" : limit}
        </span>
      </div>
      <div className="w-full bg-slate-100 rounded-full h-2.5">
        <div
          className={`h-2.5 rounded-full transition-all ${
            isNearLimit
              ? "bg-gradient-to-r from-orange-500 to-red-500"
              : "bg-gradient-to-r from-blue-600 to-cyan-600"
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
