import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { db } from "@/lib/db";
import { tenants } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import OpenAI from "openai";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Rate limiting (in-memory per instance)
// NOTE: This resets on server restart/redeploy. For production with multiple
// instances, consider Redis. Current approach is acceptable for MVP since:
// 1. Conversations are temporary (1 hour timeout)
// 2. Each user session is sticky to same instance
// 3. Main AI generation rate limiting is in DB (aiGenerations table)
const conversationLimits = new Map<string, { count: number; resetAt: number }>();
const MAX_MESSAGES_PER_CONVERSATION = 20;

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.tenantId) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    // Check if user has AI access (Pro/Business only) - fetch from DB for latest plan
    const tenant = await db.query.tenants.findFirst({
      where: eq(tenants.id, session.user.tenantId),
    });

    if (!tenant) {
      return NextResponse.json({ error: "Tenant no encontrado" }, { status: 404 });
    }

    // Use centralized AI check
    const { hasAIFeatures } = await import("@/lib/plan-limits");
    if (!hasAIFeatures(tenant.plan || "free")) {
      return NextResponse.json(
        {
          error: "Esta función requiere un plan Pro o Business",
          upgrade: true,
        },
        { status: 403 }
      );
    }

    const body = await req.json();
    const {
      sessionId,
      message,
      conversationHistory = [],
      currentDraft = null,
    } = body;

    // Validate message
    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return NextResponse.json(
        { error: "Mensaje inválido" },
        { status: 400 }
      );
    }

    // Check rate limiting
    const userId = session.user.id;
    const limitKey = `${userId}:${sessionId}`;
    const userLimit = conversationLimits.get(limitKey);

    if (userLimit) {
      if (Date.now() > userLimit.resetAt) {
        // Reset after 1 hour
        conversationLimits.delete(limitKey);
      } else if (userLimit.count >= MAX_MESSAGES_PER_CONVERSATION) {
        return NextResponse.json(
          {
            error: `Has alcanzado el límite de ${MAX_MESSAGES_PER_CONVERSATION} mensajes por conversación`,
            limitReached: true,
          },
          { status: 429 }
        );
      }
    }

    // Build conversation context for AI
    const systemPrompt = buildSystemPrompt();
    const userPrompt = buildUserPrompt(message, conversationHistory, currentDraft);

    // Call OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        ...conversationHistory.map((msg: any) => ({
          role: msg.role,
          content: msg.content,
        })),
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const aiResponse = completion.choices[0]?.message?.content || "Lo siento, no pude generar una respuesta.";

    // Parse AI response to detect actions
    const action = parseAIAction(aiResponse, currentDraft);

    // Update rate limit
    if (userLimit) {
      userLimit.count++;
    } else {
      conversationLimits.set(limitKey, {
        count: 1,
        resetAt: Date.now() + 60 * 60 * 1000, // 1 hour
      });
    }

    return NextResponse.json({
      message: aiResponse,
      action,
      messagesRemaining: MAX_MESSAGES_PER_CONVERSATION - (userLimit?.count || 1),
    });
  } catch (error: any) {
    console.error("Error in survey-chat API:", error);

    // Handle OpenAI specific errors
    if (error.code === "insufficient_quota") {
      return NextResponse.json(
        { error: "Error de configuración de OpenAI. Contacta a soporte." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Error al procesar tu mensaje" },
      { status: 500 }
    );
  }
}

/**
 * Build system prompt for AI
 */
function buildSystemPrompt(): string {
  return `Eres un asistente experto en diseño de encuestas SaaS para ChatForm.

Tu trabajo es ayudar a usuarios a crear encuestas efectivas mediante conversación natural.

IMPORTANTE: Cuando el usuario te pida generar una encuesta completa, DEBES:
1. Agregar cada pregunta individualmente usando [ADD_QUESTION]
2. Después de agregar todas las preguntas, usar [GENERATE_DRAFT]

Comandos que DEBES usar en este formato exacto:

[ADD_QUESTION] "Texto de la pregunta" (tipo: question_type)
- Tipos válidos: multiple_choice, open_text, short_text, rating, email, phone, number, date
- Para multiple_choice, agrega: (opciones: Opción1, Opción2, Opción3)

[MODIFY_QUESTION #N] "Nuevo texto"
- N es el número de pregunta (1, 2, 3...)

[DELETE_QUESTION #N]
- N es el número de pregunta a eliminar

[GENERATE_DRAFT]
- Úsalo SOLO después de agregar todas las preguntas con [ADD_QUESTION]

Formato de respuesta:
- Sé conciso (máximo 100 palabras)
- Usa lenguaje natural y amigable
- SIEMPRE usa los comandos en el formato exacto mostrado arriba
- Primero agrega todas las preguntas, luego [GENERATE_DRAFT]

Reglas:
- NO generes más de 10 preguntas sin confirmar
- SIEMPRE usa [ADD_QUESTION] antes de [GENERATE_DRAFT]
- Para encuestas completas: [ADD_QUESTION] para cada pregunta, luego [GENERATE_DRAFT]

Ejemplo de generación completa:
User: "Genera encuesta de satisfacción con 3 preguntas"
AI: "Perfecto. Aquí está tu encuesta de satisfacción:

[ADD_QUESTION] "¿Cómo calificarías tu experiencia general?" (tipo: rating)
[ADD_QUESTION] "¿Qué es lo que más te gustó?" (tipo: open_text)
[ADD_QUESTION] "¿Recomendarías nuestro servicio?" (tipo: multiple_choice, opciones: Sí, No, Tal vez)
[GENERATE_DRAFT]

He creado 3 preguntas para tu encuesta de satisfacción. ¿Quieres agregar o modificar algo?"`;
}

/**
 * Build user prompt with context
 */
function buildUserPrompt(
  message: string,
  conversationHistory: any[],
  currentDraft: any
): string {
  let prompt = `Usuario dice: "${message}"`;

  if (currentDraft && currentDraft.questions && currentDraft.questions.length > 0) {
    prompt += `\n\nBorrador actual (${currentDraft.questions.length} preguntas):`;
    currentDraft.questions.forEach((q: any, i: number) => {
      prompt += `\n${i + 1}. "${q.text}" (${q.type})`;
    });
  } else {
    prompt += "\n\n[Sin preguntas aún]";
  }

  return prompt;
}

/**
 * Parse AI response to extract actions
 */
function parseAIAction(aiResponse: string, currentDraft: any): any {
  // Detect ADD_QUESTION command
  if (aiResponse.includes("[ADD_QUESTION]")) {
    return extractAddQuestionAction(aiResponse, currentDraft);
  }

  // Detect MODIFY_QUESTION command
  if (aiResponse.includes("[MODIFY_QUESTION]")) {
    return extractModifyQuestionAction(aiResponse, currentDraft);
  }

  // Detect DELETE_QUESTION command
  if (aiResponse.includes("[DELETE_QUESTION]")) {
    return extractDeleteQuestionAction(aiResponse);
  }

  // Detect GENERATE_DRAFT command
  if (aiResponse.includes("[GENERATE_DRAFT]")) {
    return extractGenerateDraftAction(aiResponse);
  }

  // No action detected
  return null;
}

/**
 * Extract ADD_QUESTION action from AI response
 */
function extractAddQuestionAction(aiResponse: string, currentDraft: any): any {
  // Simple regex to extract question text and type
  // Format: [ADD_QUESTION] Agregué: "pregunta texto" (tipo: question_type)
  const match = aiResponse.match(/"([^"]+)"\s*\(tipo:\s*(\w+)/);

  if (!match) return null;

  const questionText = match[1];
  const questionType = match[2] as any;

  // Determine options for multiple_choice
  let options = undefined;
  if (questionType === "multiple_choice") {
    // Try to extract options
    const optionsMatch = aiResponse.match(/opciones:?\s*([^)]+)/i);
    if (optionsMatch) {
      options = optionsMatch[1].split(/[,/]/).map((opt) => opt.trim());
    } else {
      options = ["Opción 1", "Opción 2", "Opción 3"];
    }
  }

  return {
    type: "add_question",
    question: {
      text: questionText,
      type: questionType,
      options,
      required: true,
      order: currentDraft?.questions?.length || 0,
    },
  };
}

/**
 * Extract MODIFY_QUESTION action
 */
function extractModifyQuestionAction(aiResponse: string, currentDraft: any): any {
  // Format: [MODIFY_QUESTION #2] Cambié a: "nuevo texto"
  const match = aiResponse.match(/\[MODIFY_QUESTION\s*#?(\d+)\].*"([^"]+)"/);

  if (!match) return null;

  const questionIndex = parseInt(match[1]) - 1; // Convert to 0-based index
  const newText = match[2];

  return {
    type: "modify_question",
    questionIndex,
    updates: {
      text: newText,
    },
  };
}

/**
 * Extract DELETE_QUESTION action
 */
function extractDeleteQuestionAction(aiResponse: string): any {
  // Format: [DELETE_QUESTION #3]
  const match = aiResponse.match(/\[DELETE_QUESTION\s*#?(\d+)\]/);

  if (!match) return null;

  const questionIndex = parseInt(match[1]) - 1;

  return {
    type: "delete_question",
    questionIndex,
  };
}

/**
 * Extract GENERATE_DRAFT action
 */
function extractGenerateDraftAction(aiResponse: string): any {
  // This would require more complex parsing
  // For MVP, we'll return a signal to generate draft
  return {
    type: "generate_draft",
    // In real implementation, we'd parse the full draft from AI response
  };
}
