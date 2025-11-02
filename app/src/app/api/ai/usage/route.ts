import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { db } from '@/lib/db';
import { aiGenerations, tenants } from '@/lib/db/schema';
import { AI_LIMITS, RATE_LIMIT } from '@/lib/ai/openai-client';
import { eq, and, gte, sql } from 'drizzle-orm';

export async function GET() {
  try {
    // 1. Autenticación
    const session = await auth();
    if (!session?.user?.tenantId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // 2. Obtener tenant y plan
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

    // 3. Calcular uso mensual
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
    // Handle unlimited plans (-1)
    const remaining = planLimits.generations === -1
      ? -1
      : Math.max(0, planLimits.generations - usedThisMonth);

    // 4. Calcular rate limit actual (última hora)
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

    // 5. Fecha de reset
    const nextMonth = new Date(startOfMonth);
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    // 6. Calcular reset de rate limit
    const nextHourReset = new Date(Date.now() + RATE_LIMIT.window_minutes * 60 * 1000);

    return NextResponse.json({
      success: true,
      usage: {
        plan,
        limits: {
          surveyGenerator: {
            used: usedThisMonth,
            limit: planLimits.generations,
            remaining,
            resetDate: nextMonth.toISOString(),
            available: planLimits.generations === -1 || planLimits.generations > 0,
            unlimited: planLimits.generations === -1,
          },
        },
        rateLimit: {
          current: usedLastHour,
          max: RATE_LIMIT.generations_per_hour,
          windowMinutes: RATE_LIMIT.window_minutes,
          resetAt: nextHourReset.toISOString(),
          canGenerate: usedLastHour < RATE_LIMIT.generations_per_hour,
        }
      }
    });

  } catch (error) {
    console.error('AI Usage error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch usage' },
      { status: 500 }
    );
  }
}
