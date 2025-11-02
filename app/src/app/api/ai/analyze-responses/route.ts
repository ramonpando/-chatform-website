import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { db } from '@/lib/db';
import { surveys, surveySessions, aiGenerations, tenants } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { openai, AI_CONFIG, calculateCost } from '@/lib/ai/openai-client';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.tenantId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { surveyId } = await req.json();

    if (!surveyId) {
      return NextResponse.json({ error: 'Survey ID is required' }, { status: 400 });
    }

    // Verificar que la encuesta pertenece al tenant
    const survey = await db.query.surveys.findFirst({
      where: and(
        eq(surveys.id, surveyId),
        eq(surveys.tenantId, session.user.tenantId)
      ),
      with: {
        questions: {
          orderBy: (questions, { asc }) => [asc(questions.orderIndex)],
        },
      },
    });

    if (!survey) {
      return NextResponse.json({ error: 'Survey not found' }, { status: 404 });
    }

    // Verificar que el plan tenga acceso a AI Analysis
    const tenant = await db.query.tenants.findFirst({
      where: eq(tenants.id, session.user.tenantId),
    });

    if (!tenant || (tenant.plan !== 'pro' && tenant.plan !== 'business')) {
      return NextResponse.json({
        error: 'AI_NOT_AVAILABLE',
        message: 'El análisis AI solo está disponible en los planes Pro y Business',
      }, { status: 403 });
    }

    // Obtener todas las respuestas de texto abierto
    const sessions = await db.query.surveySessions.findMany({
      where: and(
        eq(surveySessions.surveyId, surveyId),
        eq(surveySessions.status, 'completed')
      ),
      with: {
        responses: {
          with: {
            question: true,
          },
        },
      },
    });

    // Filtrar solo respuestas de texto abierto
    const openTextResponses = sessions.flatMap(s =>
      s.responses
        .filter(r => r.question.questionType === 'open_text' && r.answerText)
        .map(r => ({
          questionText: r.question.questionText,
          answer: r.answerText!,
        }))
    );

    if (openTextResponses.length === 0) {
      return NextResponse.json({
        error: 'NO_TEXT_RESPONSES',
        message: 'No hay respuestas de texto para analizar',
      }, { status: 400 });
    }

    // Preparar el prompt para OpenAI
    const prompt = `Analiza las siguientes respuestas de encuesta y proporciona un análisis detallado en formato JSON.

ENCUESTA: ${survey.title}

RESPUESTAS:
${openTextResponses.map((r, i) => `
Pregunta: ${r.questionText}
Respuesta ${i + 1}: ${r.answer}
`).join('\n')}

Proporciona un análisis en el siguiente formato JSON:
{
  "sentiment": {
    "positive": <porcentaje>,
    "neutral": <porcentaje>,
    "negative": <porcentaje>
  },
  "themes": [
    {
      "name": "<nombre del tema>",
      "frequency": <número de menciones>,
      "sentiment": "<positive|neutral|negative>"
    }
  ],
  "keywords": ["palabra1", "palabra2", ...],
  "summary": "<resumen ejecutivo de 2-3 oraciones>",
  "insights": [
    "<insight 1>",
    "<insight 2>",
    "<insight 3>"
  ],
  "actionItems": [
    "<recomendación 1>",
    "<recomendación 2>"
  ]
}

INSTRUCCIONES:
- Identifica el sentimiento general (positivo, neutral, negativo)
- Extrae los temas principales mencionados
- Identifica keywords relevantes
- Proporciona un resumen ejecutivo
- Da insights accionables
- Sugiere mejoras o acciones
- Responde SOLO con JSON válido, sin texto adicional`;

    const startTime = Date.now();

    // Llamar a OpenAI
    const completion = await openai.chat.completions.create({
      model: AI_CONFIG.model,
      messages: [
        {
          role: 'system',
          content: 'Eres un experto analista de datos especializado en análisis de sentimientos y extracción de insights de encuestas. Respondes siempre en formato JSON válido.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3, // Más bajo para respuestas más consistentes
      max_tokens: 1500,
      response_format: { type: 'json_object' },
    });

    const latencyMs = Date.now() - startTime;

    const responseText = completion.choices[0]?.message?.content || '{}';
    const analysis = JSON.parse(responseText);

    // Calcular costo
    const inputTokens = completion.usage?.prompt_tokens || 0;
    const outputTokens = completion.usage?.completion_tokens || 0;
    const costUsd = calculateCost(inputTokens, outputTokens);

    // Guardar en aiGenerations
    await db.insert(aiGenerations).values({
      tenantId: session.user.tenantId,
      userId: session.user.id,
      generationType: 'ai_analysis',
      prompt,
      response: analysis,
      tokensUsedInput: inputTokens,
      tokensUsedOutput: outputTokens,
      costUsd,
      latencyMs,
      model: AI_CONFIG.model,
      success: true,
    });

    return NextResponse.json({
      success: true,
      analysis,
      metadata: {
        responsesAnalyzed: openTextResponses.length,
        tokensUsed: inputTokens + outputTokens,
        costUsd: costUsd / 1_000_000, // Convert microdollars to dollars
        latencyMs,
      },
    });

  } catch (error: any) {
    console.error('AI Analysis error:', error);

    return NextResponse.json({
      error: 'ANALYSIS_ERROR',
      message: error.message || 'Error al analizar respuestas',
    }, { status: 500 });
  }
}
