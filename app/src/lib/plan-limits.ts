/**
 * Plan Limits Middleware & Utilities
 * Validates plan limits before allowing actions
 */

import { db } from "@/lib/db";
import { tenants, surveys, surveySessions } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";
import { PLAN_LIMITS, getPlanDetails, type PlanType } from "@/lib/constants/pricing";

export interface PlanLimitCheck {
  allowed: boolean;
  reason?: string;
  limit?: number;
  used?: number;
}

/**
 * Check if tenant can create a new survey
 */
export async function canCreateSurvey(tenantId: string): Promise<PlanLimitCheck> {
  const tenant = await db.query.tenants.findFirst({
    where: eq(tenants.id, tenantId),
  });

  if (!tenant) {
    return { allowed: false, reason: "Tenant not found" };
  }

  const planDetails = getPlanDetails(tenant.plan as PlanType);
  const currentSurveys = await db.query.surveys.findMany({
    where: eq(surveys.tenantId, tenantId),
  });

  const surveysCount = currentSurveys.length;
  const limit = planDetails.maxSurveys;

  // -1 means unlimited
  if (limit === -1) {
    return { allowed: true };
  }

  if (surveysCount >= limit) {
    return {
      allowed: false,
      reason: `Has alcanzado el límite de ${limit} encuestas para tu plan ${planDetails.name}`,
      limit,
      used: surveysCount,
    };
  }

  return { allowed: true, limit, used: surveysCount };
}

/**
 * Check if tenant can receive more WhatsApp responses this month
 */
export async function canReceiveWhatsAppResponse(tenantId: string): Promise<PlanLimitCheck> {
  const tenant = await db.query.tenants.findFirst({
    where: eq(tenants.id, tenantId),
  });

  if (!tenant) {
    return { allowed: false, reason: "Tenant not found" };
  }

  const planDetails = getPlanDetails(tenant.plan as PlanType);
  const limit = planDetails.maxWhatsAppResponses;

  // No WhatsApp in plan
  if (limit === 0) {
    return {
      allowed: false,
      reason: `WhatsApp no está disponible en tu plan ${planDetails.name}. Actualiza a Starter o superior.`,
      limit: 0,
      used: 0,
    };
  }

  // maxWhatsAppResponses is never -1 (only maxSurveys can be unlimited)
  // Valid values: 0, 200, 1000, 3000

  const used = tenant.responsesUsedThisMonth;

  if (used >= limit) {
    return {
      allowed: false,
      reason: `Has alcanzado el límite de ${limit} respuestas WhatsApp este mes. Actualiza tu plan o espera al próximo ciclo.`,
      limit,
      used,
    };
  }

  return { allowed: true, limit, used };
}

/**
 * Check if tenant can use AI features
 */
export async function canUseAI(tenantId: string): Promise<PlanLimitCheck> {
  const tenant = await db.query.tenants.findFirst({
    where: eq(tenants.id, tenantId),
  });

  if (!tenant) {
    return { allowed: false, reason: "Tenant not found" };
  }

  const planDetails = getPlanDetails(tenant.plan as PlanType);

  // No AI in plan
  if (planDetails.maxAIGenerations === 0) {
    return {
      allowed: false,
      reason: `AI features no están disponibles en tu plan ${planDetails.name}. Actualiza a Pro o superior.`,
    };
  }

  return { allowed: true };
}

/**
 * Increment WhatsApp responses counter
 */
export async function incrementWhatsAppResponses(tenantId: string): Promise<void> {
  await db
    .update(tenants)
    .set({
      responsesUsedThisMonth: sql`${tenants.responsesUsedThisMonth} + 1`,
    })
    .where(eq(tenants.id, tenantId));
}

/**
 * Reset monthly counters (run via cron at start of month)
 */
export async function resetMonthlyCounters(): Promise<void> {
  await db.update(tenants).set({
    responsesUsedThisMonth: 0,
  });
}
