import OpenAI from 'openai';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY environment variable is not set');
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const AI_CONFIG = {
  model: 'gpt-4o-mini' as const,
  temperature: 0.7,
  max_tokens: 1000,
};

// Límites por plan
export const AI_LIMITS = {
  free: {
    generations: 0,
    message: 'Actualiza a Starter para usar AI Generator'
  },
  starter: {
    generations: 30,
    message: '30 generaciones AI/mes'
  },
  pro: {
    generations: 100,
    message: '100 generaciones AI/mes + análisis'
  }
} as const;

// Rate limiting
export const RATE_LIMIT = {
  generations_per_hour: 5,
  window_minutes: 60,
  cooldown_seconds: 3
} as const;

// Costos (en microdólares - 1 USD = 1,000,000 microdólares)
export const AI_PRICING = {
  'gpt-4o-mini': {
    input_per_1m_tokens: 150, // $0.15
    output_per_1m_tokens: 600, // $0.60
  }
} as const;

export function calculateCost(
  inputTokens: number,
  outputTokens: number,
  model: keyof typeof AI_PRICING = 'gpt-4o-mini'
): number {
  const pricing = AI_PRICING[model];
  const inputCost = (inputTokens / 1_000_000) * pricing.input_per_1m_tokens;
  const outputCost = (outputTokens / 1_000_000) * pricing.output_per_1m_tokens;
  return Math.round((inputCost + outputCost) * 1_000_000); // Return in microdollars
}
