import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { surveys, surveySessions, responses, questions as questionsTable } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

// Twilio WhatsApp webhook handler
export async function POST(req: Request) {
  try {
    // Parse Twilio webhook payload (application/x-www-form-urlencoded)
    const formData = await req.formData();

    const from = formData.get("From") as string; // +14155238886 (WhatsApp number)
    const to = formData.get("To") as string; // Your Twilio number
    const body = formData.get("Body") as string; // Message text
    const profileName = formData.get("ProfileName") as string; // WhatsApp profile name

    console.log("WhatsApp webhook received:", { from, to, body, profileName });

    if (!from || !body) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Check if message starts with "START_" (new survey)
    if (body.toUpperCase().startsWith("START_")) {
      return await handleStartSurvey(from, body, profileName);
    }

    // Check for existing active session
    const activeSession = await db.query.surveySessions.findFirst({
      where: and(
        eq(surveySessions.phoneNumber, from),
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
      return await handleSurveyResponse(activeSession, body);
    }

    // No active session, send help message
    return sendWhatsAppMessage(from, "👋 ¡Hola! Para empezar una encuesta, envía START_ seguido del código de la encuesta.\n\nEjemplo: START_abc123");

  } catch (error) {
    console.error("WhatsApp webhook error:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

// Handle new survey start
async function handleStartSurvey(phoneNumber: string, message: string, profileName: string) {
  try {
    // Extract shortCode from "START_abc123"
    const shortCode = message.replace(/^START_/i, "").trim();

    if (!shortCode) {
      return sendWhatsAppMessage(phoneNumber, "❌ Código de encuesta inválido. Por favor usa el link que te compartieron.");
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
      return sendWhatsAppMessage(phoneNumber, "❌ Encuesta no encontrada. Verifica el código e intenta de nuevo.");
    }

    if (survey.status !== "active") {
      return sendWhatsAppMessage(phoneNumber, "❌ Esta encuesta ya no está disponible.");
    }

    if (survey.questions.length === 0) {
      return sendWhatsAppMessage(phoneNumber, "❌ Esta encuesta no tiene preguntas configuradas.");
    }

    // Check if user already completed this survey
    const existingSession = await db.query.surveySessions.findFirst({
      where: and(
        eq(surveySessions.phoneNumber, phoneNumber),
        eq(surveySessions.surveyId, survey.id),
        eq(surveySessions.status, "completed")
      ),
    });

    if (existingSession) {
      return sendWhatsAppMessage(phoneNumber, "✅ Ya completaste esta encuesta anteriormente. ¡Gracias por tu participación!");
    }

    // Create new session
    const [newSession] = await db.insert(surveySessions).values({
      surveyId: survey.id,
      tenantId: survey.tenantId,
      phoneNumber,
      whatsappName: profileName || null,
      status: "active",
      currentQuestionIndex: 0,
      deliveryMethod: "link",
    }).returning();

    // Send welcome message + first question
    let welcomeText = survey.welcomeMessage || `¡Hola! Gracias por participar en: ${survey.title}`;
    welcomeText += `\n\n📊 Esta encuesta tiene ${survey.questions.length} preguntas y toma ~${Math.ceil(survey.questions.length * 0.5)} minutos.`;

    const firstQuestion = survey.questions[0];
    const questionText = formatQuestion(firstQuestion, 1, survey.questions.length);

    const fullMessage = `${welcomeText}\n\n${questionText}`;

    return sendWhatsAppMessage(phoneNumber, fullMessage);

  } catch (error) {
    console.error("Error starting survey:", error);
    return sendWhatsAppMessage(phoneNumber, "❌ Error al iniciar la encuesta. Por favor intenta de nuevo.");
  }
}

// Handle survey response
async function handleSurveyResponse(session: any, messageBody: string) {
  try {
    const survey = session.survey;
    const questions = survey.questions;
    const currentQuestion = questions[session.currentQuestionIndex];

    if (!currentQuestion) {
      return sendWhatsAppMessage(session.phoneNumber, "❌ Error: pregunta no encontrada.");
    }

    // Validate answer based on question type
    const validation = validateAnswer(currentQuestion, messageBody);

    if (!validation.valid) {
      return sendWhatsAppMessage(session.phoneNumber, validation.error!);
    }

    // Save response
    await db.insert(responses).values({
      sessionId: session.id,
      questionId: currentQuestion.id,
      answerText: currentQuestion.questionType === "open_text" ? validation.value : null,
      answerOption: currentQuestion.questionType === "multiple_choice" ? validation.value : null,
      answerRating: currentQuestion.questionType === "rating" ? validation.value : null,
    });

    // Move to next question or complete
    const nextIndex = session.currentQuestionIndex + 1;
    const isLastQuestion = nextIndex >= questions.length;

    if (isLastQuestion) {
      // Survey completed!
      await db.update(surveySessions)
        .set({
          status: "completed",
          completedAt: new Date(),
          lastInteractionAt: new Date(),
        })
        .where(eq(surveySessions.id, session.id));

      // Update survey stats
      await db.update(surveys)
        .set({
          responseCount: survey.responseCount + 1,
        })
        .where(eq(surveys.id, survey.id));

      const thankYouMessage = survey.thankYouMessage || "¡Gracias por completar la encuesta! Tu opinión es muy valiosa para nosotros.";
      return sendWhatsAppMessage(session.phoneNumber, `✅ ${thankYouMessage}`);

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

      return sendWhatsAppMessage(session.phoneNumber, questionText);
    }

  } catch (error) {
    console.error("Error handling survey response:", error);
    return sendWhatsAppMessage(session.phoneNumber, "❌ Error al procesar tu respuesta. Por favor intenta de nuevo.");
  }
}

// Format question based on type
function formatQuestion(question: any, index: number, total: number): string {
  let text = `*Pregunta ${index}/${total}*\n\n${question.questionText}`;

  if (question.questionType === "multiple_choice" && question.options) {
    const options = JSON.parse(question.options);
    text += "\n\n*Opciones:*";
    options.forEach((opt: string, i: number) => {
      text += `\n${i + 1}. ${opt}`;
    });
    text += "\n\n_Responde con el número de tu opción (ej: 1)_";
  } else if (question.questionType === "rating") {
    text += "\n\n_Responde con un número del 1 al 10_";
  } else if (question.questionType === "open_text") {
    text += "\n\n_Escribe tu respuesta_";
  }

  return text;
}

// Validate answer based on question type
function validateAnswer(question: any, answer: string): { valid: boolean; value?: any; error?: string } {
  const trimmed = answer.trim();

  if (question.questionType === "multiple_choice") {
    const options = JSON.parse(question.options || "[]");
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
      return {
        valid: false,
        error: "❌ Por favor responde con un número del 1 al 10"
      };
    }

    return { valid: true, value: rating };
  }

  if (question.questionType === "open_text") {
    if (trimmed.length === 0) {
      return {
        valid: false,
        error: "❌ Por favor escribe tu respuesta"
      };
    }

    if (trimmed.length > 1000) {
      return {
        valid: false,
        error: "❌ Tu respuesta es muy larga. Máximo 1000 caracteres."
      };
    }

    return { valid: true, value: trimmed };
  }

  return { valid: false, error: "❌ Tipo de pregunta no soportado" };
}

// Send WhatsApp message via Twilio
async function sendWhatsAppMessage(to: string, message: string) {
  try {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.TWILIO_WHATSAPP_NUMBER || "whatsapp:+14155238886";

    if (!accountSid || !authToken) {
      console.error("Twilio credentials not configured");
      return new NextResponse("OK", { status: 200 });
    }

    const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;

    const params = new URLSearchParams({
      From: fromNumber,
      To: to,
      Body: message,
    });

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": "Basic " + Buffer.from(`${accountSid}:${authToken}`).toString("base64"),
      },
      body: params.toString(),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Twilio API error:", error);
    }

    // Return 200 OK to Twilio (acknowledge webhook)
    return new NextResponse("OK", { status: 200 });

  } catch (error) {
    console.error("Error sending WhatsApp message:", error);
    return new NextResponse("OK", { status: 200 }); // Still return 200 to avoid retries
  }
}

// GET endpoint for webhook verification (Twilio doesn't use this, but good to have)
export async function GET(req: Request) {
  return NextResponse.json({
    status: "ok",
    message: "WhatsApp webhook endpoint",
  });
}
