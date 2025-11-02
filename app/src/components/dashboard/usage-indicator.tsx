"use client";

import { PLAN_LIMITS, getPlanDetails, type PlanType } from "@/lib/constants/pricing";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, Zap } from "lucide-react";
import Link from "next/link";

interface UsageIndicatorProps {
  plan: PlanType;
  responsesUsed: number;
  surveysCount: number;
}

export function UsageIndicator({ plan, responsesUsed, surveysCount }: UsageIndicatorProps) {
  const planDetails = getPlanDetails(plan);

  // Calculate usage percentages
  const responsesLimit = planDetails.maxWhatsAppResponses;
  const surveysLimit = planDetails.maxSurveys;

  const responsesPercentage = responsesLimit > 0
    ? Math.min((responsesUsed / responsesLimit) * 100, 100)
    : 0;

  const surveysPercentage = surveysLimit > 0
    ? Math.min((surveysCount / surveysLimit) * 100, 100)
    : 0;

  // Check if approaching limits (>80%)
  const approachingResponsesLimit = responsesPercentage > 80;
  const approachingSurveysLimit = surveysPercentage > 80;
  const exceeded = responsesUsed > responsesLimit || surveysCount > surveysLimit;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-slate-900">
          Plan Actual: {planDetails.name}
        </h3>
        <Link
          href="/billing"
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          Actualizar
        </Link>
      </div>

      <div className="space-y-4">
        {/* WhatsApp Responses Usage */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-700">
              Respuestas WhatsApp
            </span>
            <span className="text-sm text-slate-600">
              {responsesUsed} / {responsesLimit}
            </span>
          </div>
          {responsesLimit > 0 && (
            <>
              <Progress
                value={responsesPercentage}
                className={`h-2 ${
                  approachingResponsesLimit
                    ? 'bg-red-100'
                    : 'bg-slate-100'
                }`}
                indicatorClassName={
                  approachingResponsesLimit
                    ? 'bg-red-600'
                    : 'bg-blue-600'
                }
              />
              {approachingResponsesLimit && (
                <div className="flex items-center gap-1 mt-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-orange-600" />
                  <span className="text-xs text-orange-600 font-medium">
                    Te estás acercando al límite
                  </span>
                </div>
              )}
            </>
          )}
          {responsesLimit === 0 && (
            <div className="flex items-center gap-1.5 mt-1">
              <Zap className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-xs text-slate-500">
                No disponible en plan FREE
              </span>
            </div>
          )}
        </div>

        {/* Surveys Usage */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-700">
              Encuestas
            </span>
            <span className="text-sm text-slate-600">
              {surveysCount} / {surveysLimit === -1 ? '∞' : surveysLimit}
            </span>
          </div>
          {surveysLimit > 0 && (
            <>
              <Progress
                value={surveysPercentage}
                className={`h-2 ${
                  approachingSurveysLimit
                    ? 'bg-red-100'
                    : 'bg-slate-100'
                }`}
                indicatorClassName={
                  approachingSurveysLimit
                    ? 'bg-red-600'
                    : 'bg-blue-600'
                }
              />
              {approachingSurveysLimit && (
                <div className="flex items-center gap-1 mt-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-orange-600" />
                  <span className="text-xs text-orange-600 font-medium">
                    Te estás acercando al límite
                  </span>
                </div>
              )}
            </>
          )}
          {surveysLimit === -1 && (
            <div className="flex items-center gap-1.5 mt-1">
              <Zap className="w-3.5 h-3.5 text-green-600" />
              <span className="text-xs text-green-600 font-medium">
                Ilimitadas
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Upgrade CTA if exceeded */}
      {exceeded && (
        <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-orange-900">
                Has excedido tu límite
              </p>
              <p className="text-xs text-orange-700 mt-0.5">
                Actualiza tu plan para continuar recibiendo respuestas
              </p>
              <Link
                href="/billing"
                className="inline-block mt-2 px-3 py-1.5 bg-orange-600 text-white text-xs font-semibold rounded hover:bg-orange-700 transition-colors"
              >
                Ver Planes
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Free plan upgrade CTA */}
      {plan === 'free' && (
        <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-2">
            <Zap className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-blue-900">
                Desbloquea WhatsApp + AI
              </p>
              <p className="text-xs text-blue-700 mt-0.5">
                Desde $39/mes - 200 respuestas WhatsApp, AI Generator y más
              </p>
              <Link
                href="/billing"
                className="inline-block mt-2 px-3 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded hover:bg-blue-700 transition-colors"
              >
                Ver Planes
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
