/**
 * ChatForm - Pricing & Plan Limits
 * Updated: 2025-11-01
 * Using Meta Direct (not Twilio) for WhatsApp
 */

export const PLANS = {
  FREE: 'free',
  STARTER: 'starter',
  PRO: 'pro',
  BUSINESS: 'business',
} as const;

export type PlanType = typeof PLANS[keyof typeof PLANS];

export const PLAN_LIMITS = {
  free: {
    name: 'FREE',
    price: 0,
    priceAnnual: 0,
    maxSurveys: 1,
    maxWhatsAppResponses: 0, // NO WhatsApp en FREE
    maxAIGenerations: 0, // NO AI en FREE
    maxAIAnalyses: 0,
    features: [
      '1 encuesta',
      'Sin respuestas WhatsApp',
      'Analytics básicos',
      'Public survey page',
    ],
  },
  starter: {
    name: 'STARTER',
    price: 39,
    priceAnnual: 374, // 20% discount: $39 × 12 × 0.8
    maxSurveys: 5,
    maxWhatsAppResponses: 200, // 200 responses/mes
    maxAIGenerations: 0, // NO AI en Starter
    maxAIAnalyses: 0,
    features: [
      '5 encuestas',
      '200 respuestas WhatsApp/mes',
      'Form Builder avanzado',
      'Analytics y gráficos',
      'CSV export',
      'Email support',
    ],
  },
  pro: {
    name: 'PRO',
    price: 99,
    priceAnnual: 950, // 20% discount: $99 × 12 × 0.8
    maxSurveys: 20,
    maxWhatsAppResponses: 1000, // 1,000 responses/mes
    maxAIGenerations: -1, // Unlimited AI
    maxAIAnalyses: -1, // Unlimited AI
    popular: true,
    features: [
      '20 encuestas',
      '1,000 respuestas WhatsApp/mes',
      '✓ AI Survey Generator',
      '✓ AI Response Analyzer',
      'Advanced analytics',
      'CSV export',
      'Priority support',
    ],
  },
  business: {
    name: 'BUSINESS',
    price: 299,
    priceAnnual: 2870, // 20% discount: $299 × 12 × 0.8
    maxSurveys: -1, // Unlimited
    maxWhatsAppResponses: 3000, // 3,000 responses/mes
    maxAIGenerations: -1, // Unlimited AI
    maxAIAnalyses: -1, // Unlimited AI
    features: [
      'Encuestas ilimitadas',
      '3,000 respuestas WhatsApp/mes',
      '✓ AI Survey Generator',
      '✓ AI Response Analyzer',
      'Advanced analytics',
      'CSV export',
      'API access',
      'Dedicated support',
      'Custom integrations',
    ],
  },
} as const;

/**
 * Overage pricing (when user exceeds monthly limit)
 */
export const OVERAGE_PRICING = {
  starter: 0.25, // $0.25 per additional response
  pro: 0.15, // $0.15 per additional response
  business: 0.10, // $0.10 per additional response
} as const;

/**
 * WhatsApp costs (Meta Direct)
 */
export const WHATSAPP_COSTS = {
  // Per-response cost using Meta Direct
  costPerResponse: 0.04, // $0.04 per complete survey response

  // Breakdown:
  // - Template message: $0.035
  // - All messages within 24h window: FREE
  // - Average 10-15 messages per survey = $0.04 total

  // Notes:
  // - Using Meta Direct (no Twilio markup)
  // - Business-initiated conversation (we send first)
  // - All responses within 24h are FREE
} as const;

/**
 * AI costs (OpenAI GPT-4o-mini)
 */
export const AI_COSTS = {
  surveyGeneration: 0.001, // $0.001 per survey generated
  responseAnalysis: 0.003, // $0.003 per analysis
} as const;

/**
 * Get plan details by plan type
 */
export function getPlanDetails(plan: PlanType) {
  return PLAN_LIMITS[plan] || PLAN_LIMITS.free;
}

/**
 * Check if plan has AI features
 */
export function hasAIFeatures(plan: PlanType): boolean {
  const details = getPlanDetails(plan);
  return details.maxAIGenerations !== 0;
}

/**
 * Check if plan has WhatsApp
 */
export function hasWhatsApp(plan: PlanType): boolean {
  const details = getPlanDetails(plan);
  return details.maxWhatsAppResponses > 0;
}

/**
 * Calculate overage cost
 */
export function calculateOverageCost(
  plan: Exclude<PlanType, 'free'>,
  responsesOver: number
): number {
  return responsesOver * OVERAGE_PRICING[plan];
}
