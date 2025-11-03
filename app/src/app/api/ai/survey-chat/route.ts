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

    // Clean response by removing command markers for user-facing display
    const cleanResponse = cleanAIResponse(aiResponse);

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
      message: cleanResponse,
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
  return `Eres un asistente experto en diseño de encuestas para ChatForm. Tu trabajo es ayudar a crear encuestas efectivas con conversación natural y amigable.

REGLAS DE COMUNICACIÓN:
- Sé conversacional, amigable y conciso (máximo 80 palabras)
- NUNCA muestres detalles técnicos como "(tipo: multiple_choice)" al usuario
- Resume las preguntas con bullets simples, no las escribas completas
- Usa emojis ocasionalmente para ser más amigable ✓
- NO uses formato de lista numerada técnica

COMANDOS INTERNOS (el usuario NO los verá):
Cuando agregues preguntas, usa este formato exacto en tu respuesta:

[ADD_QUESTION] "Texto de la pregunta" (tipo: question_type)
- Tipos: multiple_choice, open_text, short_text, rating, email, phone, number, date
- Para multiple_choice: (opciones: Opción1, Opción2, Opción3)

[MODIFY_QUESTION #N] "Nuevo texto"
[DELETE_QUESTION #N]
[GENERATE_DRAFT] - Úsalo SOLO después de agregar todas las preguntas

FLUJO DE CONVERSACIÓN:
1. Pregunta sobre el objetivo (1-2 preguntas clarificadoras)
2. Agrega preguntas con [ADD_QUESTION] (el usuario no verá estos comandos)
3. Resume lo que agregaste de forma amigable
4. Usa [GENERATE_DRAFT] al final
5. Pregunta si quiere ajustes

EJEMPLO CORRECTO:
User: "Genera encuesta de satisfacción con 3 preguntas"

AI: "¡Perfecto! He creado tu encuesta de satisfacción con:

[ADD_QUESTION] "¿Cómo calificarías tu experiencia general?" (tipo: rating)
[ADD_QUESTION] "¿Qué es lo que más te gustó?" (tipo: open_text)
[ADD_QUESTION] "¿Recomendarías nuestro servicio?" (tipo: multiple_choice, opciones: Sí, No, Tal vez)
[GENERATE_DRAFT]

✓ Calificación de experiencia
✓ Feedback abierto sobre lo positivo
✓ Intención de recomendación

¿Quieres ajustar algo o agregamos más preguntas?"

EJEMPLO INCORRECTO (NO hagas esto):
"1. '¿Cómo calificarías tu experiencia?' (tipo: rating)
2. '¿Qué te gustó?' (tipo: open_text)"

Recuerda: Los comandos [ADD_QUESTION] son internos, el usuario solo verá el texto limpio y amigable.`;
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

/**
 * Clean AI response by removing technical command markers
 * This ensures users only see natural language, not internal commands
 */
function cleanAIResponse(aiResponse: string): string {
  return aiResponse
    // Remove [ADD_QUESTION] commands and their format details
    .replace(/\[ADD_QUESTION\][^\n]*/g, '')
    // Remove [MODIFY_QUESTION] commands
    .replace(/\[MODIFY_QUESTION\s*#?\d+\][^\n]*/g, '')
    // Remove [DELETE_QUESTION] commands
    .replace(/\[DELETE_QUESTION\s*#?\d+\][^\n]*/g, '')
    // Remove [GENERATE_DRAFT] command
    .replace(/\[GENERATE_DRAFT\]/g, '')
    // Remove [SHOW_DRAFT] command
    .replace(/\[SHOW_DRAFT\]/g, '')
    // Clean up multiple consecutive newlines
    .replace(/\n{3,}/g, '\n\n')
    // Trim whitespace
    .trim();
}
