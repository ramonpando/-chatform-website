import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { db } from '@/lib/db';
import { aiGenerations, tenants } from '@/lib/db/schema';
import { openai, AI_CONFIG, AI_LIMITS, RATE_LIMIT, calculateCost } from '@/lib/ai/openai-client';
import { SYSTEM_PROMPT, createUserPrompt, type GeneratedSurvey } from '@/lib/ai/prompts';
import { eq, and, gte, sql } from 'drizzle-orm';
import { z } from 'zod';

const GenerateInputSchema = z.object({
  description: z.string().min(10, 'Descripción muy corta').max(200, 'Descripción muy larga'),
  numQuestions: z.number().int().min(3).max(10).default(5),
  tone: z.enum(['formal', 'casual']).default('casual'),
  language: z.string().length(2).default('es'),
});

export async function POST(req: Request) {
  const startTime = Date.now();

  try {
    // 1. Autenticación
    const session = await auth();
    if (!session?.user?.tenantId) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Debes iniciar sesión' },
        { status: 401 }
      );
    }

    // 2. Parse y validar input
    const body = await req.json();
    const input = GenerateInputSchema.parse(body);

    // 3. Obtener tenant y verificar plan
    const tenant = await db.query.tenants.findFirst({
      where: eq(tenants.id, session.user.tenantId),
    });

    if (!tenant) {
      return NextResponse.json(
        { error: 'Tenant not found' },
        { status: 404 }
      );
    }

    const plan = (tenant.plan || 'free') as keyof typeof AI_LIMITS;
    const planLimits = AI_LIMITS[plan];

    // 4. Verificar si el plan permite AI
    if (planLimits.generations === 0) {
      return NextResponse.json(
        {
          error: 'AI_NOT_AVAILABLE',
          message: planLimits.message,
          upgradeUrl: '/settings/billing'
        },
        { status: 403 }
      );
    }

    // 5. Verificar uso mensual
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const monthlyUsage = await db
      .select({ count: sql<number>`COUNT(*)::int` })
      .from(aiGenerations)
      .where(
        and(
          eq(aiGenerations.tenantId, session.user.tenantId),
          eq(aiGenerations.generationType, 'survey_generator'),
          gte(aiGenerations.createdAt, startOfMonth),
          eq(aiGenerations.success, true)
        )
      );

    const usedThisMonth = monthlyUsage[0]?.count || 0;
    const remaining = planLimits.generations - usedThisMonth;

    if (remaining <= 0) {
      // Calcular fecha de reset
      const nextMonth = new Date(startOfMonth);
      nextMonth.setMonth(nextMonth.getMonth() + 1);

      return NextResponse.json(
        {
          error: 'LIMIT_EXCEEDED',
          message: `Has alcanzado el límite de ${planLimits.generations} generaciones este mes`,
          resetDate: nextMonth.toISOString(),
          upgradeUrl: '/settings/billing'
        },
        { status: 429 }
      );
    }

    // 6. Verificar rate limit (últimas 1 hora)
    const oneHourAgo = new Date(Date.now() - RATE_LIMIT.window_minutes * 60 * 1000);

    const hourlyUsage = await db
      .select({ count: sql<number>`COUNT(*)::int` })
      .from(aiGenerations)
      .where(
        and(
          eq(aiGenerations.tenantId, session.user.tenantId),
          eq(aiGenerations.generationType, 'survey_generator'),
          gte(aiGenerations.createdAt, oneHourAgo),
          eq(aiGenerations.success, true)
        )
      );

    const usedLastHour = hourlyUsage[0]?.count || 0;

    if (usedLastHour >= RATE_LIMIT.generations_per_hour) {
      return NextResponse.json(
        {
          error: 'RATE_LIMIT',
          message: `Máximo ${RATE_LIMIT.generations_per_hour} generaciones por hora. Intenta más tarde.`,
          retryAfter: 3600
        },
        { status: 429 }
      );
    }

    // 7. Llamar a OpenAI
    const completion = await openai.chat.completions.create({
      model: AI_CONFIG.model,
      temperature: AI_CONFIG.temperature,
      max_tokens: AI_CONFIG.max_tokens,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: createUserPrompt(input) }
      ],
    });

    const latency = Date.now() - startTime;

    // 8. Parse response
    let content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from AI');
    }

    // Limpiar markdown si existe
    content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    let survey: GeneratedSurvey;
    try {
      survey = JSON.parse(content);
    } catch (parseError) {
      console.error('Failed to parse AI response:', content);
      throw new Error('Invalid JSON response from AI');
    }

    // 9. Calcular costo
    const inputTokens = completion.usage?.prompt_tokens || 0;
    const outputTokens = completion.usage?.completion_tokens || 0;
    const cost = calculateCost(inputTokens, outputTokens);

    // 10. Guardar en DB
    await db.insert(aiGenerations).values({
      tenantId: session.user.tenantId,
      userId: session.user.id,
      generationType: 'survey_generator',
      prompt: input.description,
      response: survey as any,
      tokensUsedInput: inputTokens,
      tokensUsedOutput: outputTokens,
      costUsd: cost,
      latencyMs: latency,
      model: AI_CONFIG.model,
      success: true,
    });

    // 11. Retornar resultado
    return NextResponse.json({
      success: true,
      data: survey,
      usage: {
        used: usedThisMonth + 1,
        limit: planLimits.generations,
        remaining: remaining - 1,
      },
      meta: {
        latency,
        tokensUsed: inputTokens + outputTokens,
      }
    });

  } catch (error: any) {
    console.error('AI Generation error:', error);

    // Guardar error en DB si tenemos session
    const session = await auth();
    if (session?.user?.tenantId) {
      try {
        await db.insert(aiGenerations).values({
          tenantId: session.user.tenantId,
          userId: session.user.id,
          generationType: 'survey_generator',
          prompt: 'Error occurred',
          response: { error: error.message } as any,
          tokensUsedInput: 0,
          tokensUsedOutput: 0,
          costUsd: 0,
          latencyMs: Date.now() - startTime,
          model: AI_CONFIG.model,
          success: false,
          errorMessage: error.message,
        });
      } catch (dbError) {
        console.error('Failed to log error:', dbError);
      }
    }

    return NextResponse.json(
      {
        error: 'GENERATION_FAILED',
        message: 'No pudimos generar la encuesta. Intenta de nuevo.',
      },
      { status: 500 }
    );
  }
}
