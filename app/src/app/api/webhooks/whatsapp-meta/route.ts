import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { surveys, surveySessions, responses, questions as questionsTable } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

// Meta WhatsApp Cloud API webhook handler
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Meta sends test webhooks, ignore them
    if (body.object !== "whatsapp_business_account") {
      return NextResponse.json({ status: "ignored" }, { status: 200 });
    }

    // Extract message data
    const entry = body.entry?.[0];
    const change = entry?.changes?.[0];
    const value = change?.value;

    if (!value?.messages || value.messages.length === 0) {
      // No messages (could be status update)
      return NextResponse.json({ status: "ok" }, { status: 200 });
    }

    const message = value.messages[0];
    const from = message.from; // Phone number (e.g., "5215542317035")
    const messageBody = message.text?.body || "";
    const profileName = value.contacts?.[0]?.profile?.name || "";

    console.log("[META WEBHOOK] Message received:", { from, messageBody, profileName });

    if (!from || !messageBody) {
      return NextResponse.json({ status: "ok" }, { status: 200 });
    }

    // Normalize phone number to E.164 format
    const phoneNumber = from.startsWith("+") ? from : `+${from}`;
    const whatsappPhone = `whatsapp:${phoneNumber}`;

    // Check if message starts with "START_" (new survey)
    if (messageBody.toUpperCase().startsWith("START_")) {
      return await handleStartSurvey(whatsappPhone, messageBody, profileName);
    }

    // Check for existing active session
    const activeSession = await db.query.surveySessions.findFirst({
      where: and(
        eq(surveySessions.phoneNumber, whatsappPhone),
        eq(surveySessions.status, "active")
      ),
      with: {
        survey: {
          with: {
            questions: {
              orderBy: (questions, { asc }) => [asc(questions.orderIndex)],
            },
          },
        },
      },
    });

    if (activeSession) {
      // Check if this is a pending session (not started yet)
      if (activeSession.currentQuestionIndex === -1) {
        // Any response starts the survey
        console.log("[META WEBHOOK] Starting pending survey for:", whatsappPhone);
        return await handleStartPendingSurvey(activeSession);
      }

      // Normal active session, handle response
      return await handleSurveyResponse(activeSession, messageBody);
    }

    // No active session, send help message
    return sendMetaWhatsAppMessage(
      phoneNumber,
      "👋 ¡Hola! Para empezar una encuesta, envía START_ seguido del código de la encuesta.\n\nEjemplo: START_abc123"
    );

  } catch (error) {
    console.error("[META WEBHOOK] Error:", error);
    return NextResponse.json({ status: "error" }, { status: 500 });
  }
}

// GET endpoint for webhook verification (Meta requires this)
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const mode = searchParams.get("hub.mode");
    const token = searchParams.get("hub.verify_token");
    const challenge = searchParams.get("hub.challenge");

    const verifyToken = process.env.META_WHATSAPP_VERIFY_TOKEN || "chatform_webhook_2024";

    if (mode === "subscribe" && token === verifyToken) {
      console.log("[META WEBHOOK] Verified successfully");
      return new NextResponse(challenge, { status: 200 });
    }

    console.error("[META WEBHOOK] Verification failed");
    return new NextResponse("Forbidden", { status: 403 });

  } catch (error) {
    console.error("[META WEBHOOK] Verification error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// Handle pending survey start (session created by bulk send)
async function handleStartPendingSurvey(session: any) {
  try {
    const survey = session.survey;
    const questions = survey.questions;

    if (questions.length === 0) {
      const phone = session.phoneNumber.replace("whatsapp:", "");
      return sendMetaWhatsAppMessage(phone, "❌ Esta encuesta no tiene preguntas configuradas.");
    }

    // Update session to start from question 0
    await db.update(surveySessions)
      .set({
        currentQuestionIndex: 0,
        lastInteractionAt: new Date(),
      })
      .where(eq(surveySessions.id, session.id));

    // Send first question
    const firstQuestion = questions[0];
    const questionNumber = 1;
    const totalQuestions = questions.length;

    let questionText = `📋 *Pregunta ${questionNumber} de ${totalQuestions}*\n\n${firstQuestion.text}`;

    if (firstQuestion.type === "multiple_choice" && firstQuestion.options) {
      const options = JSON.parse(firstQuestion.options as string);
      questionText += "\n\n" + options.map((opt: string, idx: number) => `${idx + 1}. ${opt}`).join("\n");
      questionText += "\n\n_Responde con el número o el texto de tu opción_";
    } else if (firstQuestion.type === "rating") {
      questionText += "\n\n_Responde con un número del 1 al 5_\n⭐ = 1 | ⭐⭐⭐⭐⭐ = 5";
    } else {
      questionText += "\n\n_Escribe tu respuesta_";
    }

    const phone = session.phoneNumber.replace("whatsapp:", "");
    return sendMetaWhatsAppMessage(phone, questionText);
  } catch (error) {
    console.error("[META WEBHOOK] Error starting pending survey:", error);
    const phone = session.phoneNumber.replace("whatsapp:", "");
    return sendMetaWhatsAppMessage(phone, "❌ Hubo un error al iniciar la encuesta. Por favor intenta de nuevo.");
  }
}

// Handle new survey start
async function handleStartSurvey(phoneNumber: string, message: string, profileName: string) {
  try {
    // Extract shortCode from "START_abc123"
    const shortCode = message.replace(/^START_/i, "").trim();

    if (!shortCode) {
      const phone = phoneNumber.replace("whatsapp:", "");
      return sendMetaWhatsAppMessage(phone, "❌ Código de encuesta inválido. Por favor usa el link que te compartieron.");
    }

    // Find survey
    const survey = await db.query.surveys.findFirst({
      where: eq(surveys.shortCode, shortCode),
      with: {
        questions: {
          orderBy: (questions, { asc }) => [asc(questions.orderIndex)],
        },
      },
    });

    if (!survey) {
      const phone = phoneNumber.replace("whatsapp:", "");
      return sendMetaWhatsAppMessage(phone, "❌ Encuesta no encontrada. Verifica el código e intenta de nuevo.");
    }

    if (survey.status !== "active") {
      const phone = phoneNumber.replace("whatsapp:", "");
      return sendMetaWhatsAppMessage(phone, "❌ Esta encuesta ya no está disponible.");
    }

    if (survey.questions.length === 0) {
      const phone = phoneNumber.replace("whatsapp:", "");
      return sendMetaWhatsAppMessage(phone, "❌ Esta encuesta no tiene preguntas configuradas.");
    }

    // Check if user already completed this survey
    const existingCompletedSession = await db.query.surveySessions.findFirst({
      where: and(
        eq(surveySessions.phoneNumber, phoneNumber),
        eq(surveySessions.surveyId, survey.id),
        eq(surveySessions.status, "completed")
      ),
    });

    if (existingCompletedSession) {
      const phone = phoneNumber.replace("whatsapp:", "");
      return sendMetaWhatsAppMessage(phone, "✅ Ya completaste esta encuesta anteriormente. ¡Gracias por tu participación!");
    }

    // Create or reuse active session
    let activeSession = await db.query.surveySessions.findFirst({
      where: and(
        eq(surveySessions.phoneNumber, phoneNumber),
        eq(surveySessions.surveyId, survey.id),
        eq(surveySessions.status, "active")
      ),
    });

    if (!activeSession) {
      const [createdSession] = await db.insert(surveySessions).values({
        surveyId: survey.id,
        tenantId: survey.tenantId,
        phoneNumber,
        whatsappName: profileName || null,
        status: "active",
        currentQuestionIndex: 0,
        deliveryMethod: "link",
      }).returning();

      activeSession = createdSession;
    } else {
      await db.update(surveySessions)
        .set({
          currentQuestionIndex: 0,
          lastInteractionAt: new Date(),
        })
        .where(eq(surveySessions.id, activeSession.id));
    }

    // Send welcome + first question
    const welcomeText = survey.welcomeMessage || `¡Hola! Gracias por participar en: ${survey.title}`;
    const intro = `${welcomeText}\n\n📊 Esta encuesta tiene ${survey.questions.length} preguntas y toma ~${Math.ceil(survey.questions.length * 0.5)} minutos.`;

    const firstQuestion = survey.questions[0];
    const questionText = formatQuestion(firstQuestion, 1, survey.questions.length);

    const phone = phoneNumber.replace("whatsapp:", "");
    return sendMetaWhatsAppMessage(phone, `${intro}\n\n${questionText}`);

  } catch (error) {
    console.error("[META WEBHOOK] Error starting survey:", error);
    const phone = phoneNumber.replace("whatsapp:", "");
    return sendMetaWhatsAppMessage(phone, "❌ Error al iniciar la encuesta. Por favor intenta de nuevo.");
  }
}

// Handle survey response (same logic as Twilio webhook)
async function handleSurveyResponse(session: any, messageBody: string) {
  try {
    const survey = session.survey;
    const questions = survey.questions;
    const currentQuestion = questions[session.currentQuestionIndex];

    if (!currentQuestion) {
      const phone = session.phoneNumber.replace("whatsapp:", "");
      return sendMetaWhatsAppMessage(phone, "❌ Error: pregunta no encontrada.");
    }

    // Validate answer
    const validation = validateAnswer(currentQuestion, messageBody);

    if (!validation.valid) {
      const phone = session.phoneNumber.replace("whatsapp:", "");
      return sendMetaWhatsAppMessage(phone, validation.error!);
    }

    // Save response
    await db.insert(responses).values({
      sessionId: session.id,
      questionId: currentQuestion.id,
      answerText: ["open_text", "short_text", "email", "phone"].includes(currentQuestion.questionType)
        ? validation.value
        : null,
      answerOption: ["multiple_choice", "yes_no"].includes(currentQuestion.questionType)
        ? validation.value
        : null,
      answerRating: ["rating", "number"].includes(currentQuestion.questionType)
        ? validation.value
        : null,
    });

    // Move to next question or complete
    const nextIndex = session.currentQuestionIndex + 1;
    const isLastQuestion = nextIndex >= questions.length;

    if (isLastQuestion) {
      // Check quota
      const { canReceiveWhatsAppResponse, incrementWhatsAppResponses } = await import("@/lib/plan-limits");
      const quotaCheck = await canReceiveWhatsAppResponse(survey.tenantId);

      if (!quotaCheck.allowed) {
        await db.update(surveySessions)
          .set({
            status: "abandoned",
            lastInteractionAt: new Date(),
          })
          .where(eq(surveySessions.id, session.id));

        console.error(`[META WEBHOOK] Quota exceeded for tenant ${survey.tenantId}: ${quotaCheck.reason}`);

        const phone = session.phoneNumber.replace("whatsapp:", "");
        return sendMetaWhatsAppMessage(
          phone,
          "⚠️ Lo sentimos, no podemos completar tu encuesta en este momento. Por favor contacta al organizador."
        );
      }

      // Survey completed
      await db.update(surveySessions)
        .set({
          status: "completed",
          completedAt: new Date(),
          lastInteractionAt: new Date(),
        })
        .where(eq(surveySessions.id, session.id));

      await db.update(surveys)
        .set({
          responseCount: survey.responseCount + 1,
        })
        .where(eq(surveys.id, survey.id));

      await incrementWhatsAppResponses(survey.tenantId);

      const thankYouMessage = survey.thankYouMessage || "¡Gracias por completar la encuesta! Tu opinión es muy valiosa para nosotros.";
      const phone = session.phoneNumber.replace("whatsapp:", "");
      return sendMetaWhatsAppMessage(phone, `✅ ${thankYouMessage}`);

    } else {
      // Send next question
      await db.update(surveySessions)
        .set({
          currentQuestionIndex: nextIndex,
          lastInteractionAt: new Date(),
        })
        .where(eq(surveySessions.id, session.id));

      const nextQuestion = questions[nextIndex];
      const questionText = formatQuestion(nextQuestion, nextIndex + 1, questions.length);

      const phone = session.phoneNumber.replace("whatsapp:", "");
      return sendMetaWhatsAppMessage(phone, questionText);
    }

  } catch (error) {
    console.error("[META WEBHOOK] Error handling response:", error);
    const phone = session.phoneNumber.replace("whatsapp:", "");
    return sendMetaWhatsAppMessage(phone, "❌ Error al procesar tu respuesta. Por favor intenta de nuevo.");
  }
}

// Format question (reuse from Twilio webhook)
const optionsCache = new Map<string, string[]>();

function formatQuestion(question: any, index: number, total: number): string {
  let text = `*Pregunta ${index}/${total}*\n\n${question.questionText}`;

  if (question.questionType === "multiple_choice" && question.options) {
    let options = optionsCache.get(question.id);
    if (!options) {
      const parsed = JSON.parse(question.options);
      options = Array.isArray(parsed) ? parsed : [];
      optionsCache.set(question.id, options);
    }
    text += "\n\n*Opciones:*";
    options.forEach((opt: string, i: number) => {
      text += `\n${i + 1}. ${opt}`;
    });
    text += "\n\n_Responde con el número de tu opción (ej: 1)_";
  } else if (question.questionType === "rating") {
    text += "\n\n_Responde con un número del 1 al 10_";
  } else if (question.questionType === "open_text") {
    text += "\n\n_Escribe tu respuesta_";
  } else if (question.questionType === "short_text") {
    text += "\n\n_Escribe tu respuesta (máximo 100 caracteres)_";
  } else if (question.questionType === "email") {
    text += "\n\n_Escribe tu email (ej: nombre@ejemplo.com)_";
  } else if (question.questionType === "phone") {
    text += "\n\n_Escribe tu número de teléfono (ej: +52 55 1234 5678)_";
  } else if (question.questionType === "number") {
    text += "\n\n_Escribe solo números (ej: 123)_";
  } else if (question.questionType === "yes_no") {
    text += "\n\n_Responde Sí o No (o 1 para Sí, 2 para No)_";
  }

  return text;
}

// Validate answer (reuse from Twilio webhook)
function validateAnswer(question: any, answer: string): { valid: boolean; value?: any; error?: string } {
  const trimmed = answer.trim();

  if (question.questionType === "multiple_choice") {
    let options = optionsCache.get(question.id);
    if (!options) {
      const parsed = JSON.parse(question.options || "[]");
      options = Array.isArray(parsed) ? parsed : [];
      optionsCache.set(question.id, options);
    }
    const optionIndex = parseInt(trimmed) - 1;

    if (isNaN(optionIndex) || optionIndex < 0 || optionIndex >= options.length) {
      return {
        valid: false,
        error: `❌ Por favor responde con un número del 1 al ${options.length}`
      };
    }

    return { valid: true, value: options[optionIndex] };
  }

  if (question.questionType === "rating") {
    const rating = parseInt(trimmed);
    if (isNaN(rating) || rating < 1 || rating > 10) {
      return { valid: false, error: "❌ Por favor responde con un número del 1 al 10" };
    }
    return { valid: true, value: rating };
  }

  if (question.questionType === "open_text") {
    if (trimmed.length === 0) {
      return { valid: false, error: "❌ Por favor escribe tu respuesta" };
    }
    if (trimmed.length > 1000) {
      return { valid: false, error: "❌ Tu respuesta es muy larga. Máximo 1000 caracteres." };
    }
    return { valid: true, value: trimmed };
  }

  if (question.questionType === "short_text") {
    if (trimmed.length === 0) {
      return { valid: false, error: "❌ Por favor escribe tu respuesta" };
    }
    if (trimmed.length > 100) {
      return { valid: false, error: "❌ Tu respuesta es muy larga. Máximo 100 caracteres." };
    }
    return { valid: true, value: trimmed };
  }

  if (question.questionType === "email") {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (trimmed.length === 0) {
      return { valid: false, error: "❌ Por favor escribe tu email" };
    }
    if (!emailRegex.test(trimmed)) {
      return { valid: false, error: "❌ Por favor escribe un email válido (ejemplo: nombre@ejemplo.com)" };
    }
    return { valid: true, value: trimmed.toLowerCase() };
  }

  if (question.questionType === "phone") {
    const cleanedPhone = trimmed.replace(/[\s\-\(\)]/g, "");
    const phoneRegex = /^\+?[0-9]{10,15}$/;
    if (trimmed.length === 0) {
      return { valid: false, error: "❌ Por favor escribe tu número de teléfono" };
    }
    if (!phoneRegex.test(cleanedPhone)) {
      return { valid: false, error: "❌ Por favor escribe un número válido (ejemplo: +52 55 1234 5678)" };
    }
    return { valid: true, value: cleanedPhone };
  }

  if (question.questionType === "number") {
    const number = parseFloat(trimmed);
    if (trimmed.length === 0) {
      return { valid: false, error: "❌ Por favor escribe un número" };
    }
    if (isNaN(number)) {
      return { valid: false, error: "❌ Por favor escribe solo números (ejemplo: 123)" };
    }
    return { valid: true, value: number };
  }

  if (question.questionType === "yes_no") {
    const normalized = trimmed.toLowerCase();
    if (normalized === "sí" || normalized === "si" || normalized === "yes" || normalized === "1") {
      return { valid: true, value: "Sí" };
    }
    if (normalized === "no" || normalized === "2") {
      return { valid: true, value: "No" };
    }
    return { valid: false, error: "❌ Por favor responde Sí o No (o 1 para Sí, 2 para No)" };
  }

  return { valid: false, error: "❌ Tipo de pregunta no soportado" };
}

// Send WhatsApp message via Meta Cloud API
async function sendMetaWhatsAppMessage(to: string, message: string) {
  try {
    const phoneId = process.env.META_WHATSAPP_PHONE_ID;
    const accessToken = process.env.META_WHATSAPP_ACCESS_TOKEN;

    if (!phoneId || !accessToken) {
      console.error("[META] Credentials not configured");
      return NextResponse.json({ status: "error" }, { status: 500 });
    }

    // Remove + from phone if present (Meta doesn't use +)
    const cleanPhone = to.replace(/\+/g, "");

    const url = `https://graph.facebook.com/v21.0/${phoneId}/messages`;

    const payload = {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: cleanPhone,
      type: "text",
      text: {
        preview_url: false,
        body: message,
      },
    };

    console.log("[META] Sending message to:", cleanPhone);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("[META] API error:", error);
    } else {
      const result = await response.json();
      console.log("[META] Message sent:", result);
    }

    return NextResponse.json({ status: "ok" }, { status: 200 });

  } catch (error) {
    console.error("[META] Error sending message:", error);
    return NextResponse.json({ status: "error" }, { status: 500 });
  }
}
