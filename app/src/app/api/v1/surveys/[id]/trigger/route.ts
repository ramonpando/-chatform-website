import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { surveys, surveySessions, tenants } from "@/lib/db/schema";
import { hashApiKey, verifyApiKey } from "@/lib/security/api-keys";
import { eq } from "drizzle-orm";
import { z } from "zod";

// Validation schema
const triggerSchema = z.object({
  recipient: z.object({
    phone: z.string().regex(/^\+\d{10,15}$/, "Phone must be in E.164 format (+52...)"),
    name: z.string().optional(),
    email: z.string().email().optional(),
  }),
  variables: z.record(z.string(), z.any()).optional(),
  deliveryMethod: z.enum(["automatic", "link"]).optional().default("automatic"),
  metadata: z.record(z.string(), z.any()).optional(),
});

const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 60;

type RateRecord = {
  windowStart: number;
  count: number;
};

const rateTracker = new Map<string, RateRecord>();

function enforceRateLimit(apiKeyHash: string) {
  const now = Date.now();
  const record = rateTracker.get(apiKeyHash);

  if (!record || now - record.windowStart > RATE_LIMIT_WINDOW_MS) {
    rateTracker.set(apiKeyHash, { windowStart: now, count: 1 });
    return;
  }

  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    throw new Error("rate_limit_exceeded");
  }

  record.count += 1;
}

function hasTwilioCredentials() {
  return Boolean(
    process.env.TWILIO_ACCOUNT_SID &&
    process.env.TWILIO_AUTH_TOKEN &&
    process.env.TWILIO_WHATSAPP_NUMBER
  );
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: surveyId } = await params;

    // Check API key authentication
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "unauthorized", message: "Missing or invalid API key" },
        { status: 401 }
      );
    }

    const apiKey = authHeader.replace("Bearer ", "").trim();

    if (!apiKey) {
      return NextResponse.json(
        { error: "unauthorized", message: "Invalid API key" },
        { status: 401 }
      );
    }

    const providedKeyHash = hashApiKey(apiKey);

    // Parse and validate request body
    const body = await req.json();
    const validation = triggerSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: "validation_error",
          message: validation.error.issues[0].message,
          details: validation.error.issues,
        },
        { status: 400 }
      );
    }

    const { recipient, variables, deliveryMethod, metadata } = validation.data;

    // Get survey
    const survey = await db.query.surveys.findFirst({
      where: eq(surveys.id, surveyId),
      with: {
        tenant: true,
        questions: {
          orderBy: (questions, { asc }) => [asc(questions.orderIndex)],
        },
      },
    });

    if (!survey) {
      return NextResponse.json(
        { error: "not_found", message: "Survey not found" },
        { status: 404 }
      );
    }

    if (survey.status !== "active") {
      return NextResponse.json(
        { error: "survey_inactive", message: "Survey is not active" },
        { status: 403 }
      );
    }

    const tenant = survey.tenant;

    if (!tenant.apiKeyHash) {
      return NextResponse.json(
        { error: "unauthorized", message: "API access not enabled for this account" },
        { status: 401 }
      );
    }

    if (tenant.apiKeyPrefix && !apiKey.startsWith(tenant.apiKeyPrefix)) {
      return NextResponse.json(
        { error: "unauthorized", message: "API key does not belong to this tenant" },
        { status: 401 }
      );
    }

    if (!verifyApiKey(apiKey, tenant.apiKeyHash)) {
      return NextResponse.json(
        { error: "unauthorized", message: "Invalid API key" },
        { status: 401 }
      );
    }

    try {
      enforceRateLimit(providedKeyHash);
    } catch (error) {
      if ((error as Error).message === "rate_limit_exceeded") {
        return NextResponse.json(
          { error: "rate_limited", message: "Too many requests. Try again shortly." },
          { status: 429 }
        );
      }

      throw error;
    }

    // Check if delivery method is automatic
    if (deliveryMethod === "automatic") {
      // Check if tenant has send credits available
      if (tenant.sendCreditsUsed >= tenant.sendCreditsLimit) {
        // No credits, fallback to link generation
        return generateLinkResponse(survey, recipient, variables, {
          reason: "no_credits",
        });
      }

      if (!hasTwilioCredentials()) {
        return generateLinkResponse(survey, recipient, variables, {
          reason: "missing_twilio_credentials",
        });
      }

      try {
        // Send via WhatsApp (Twilio)
        const result = await sendWhatsAppSurvey(survey, recipient, metadata);

        // Increment credits used
        await db
          .update(tenants)
          .set({
            sendCreditsUsed: tenant.sendCreditsUsed + 1,
          })
          .where(eq(tenants.id, tenant.id));

        return NextResponse.json({
          status: "sent",
          deliveryMethod: "automatic",
          messageId: result.messageId,
          recipient: recipient.phone,
          creditsUsed: 1,
          creditsRemaining: tenant.sendCreditsLimit - tenant.sendCreditsUsed - 1,
          sessionId: result.sessionId,
          estimatedDeliveryTime: new Date(Date.now() + 60000).toISOString(), // +1 min
        });
      } catch (error) {
        console.error("Failed to deliver survey automatically:", error);
        return generateLinkResponse(survey, recipient, variables, {
          reason: "automatic_delivery_failed",
        });
      }
    } else {
      // Generate personalized link
      return generateLinkResponse(survey, recipient, variables);
    }
  } catch (error) {
    console.error("Error in trigger endpoint:", error);
    return NextResponse.json(
      { error: "internal_error", message: "Internal server error" },
      { status: 500 }
    );
  }
}

// Send survey via WhatsApp
async function sendWhatsAppSurvey(
  survey: any,
  recipient: any,
  metadata: any
) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_WHATSAPP_NUMBER || "whatsapp:+14155238886";

  if (!accountSid || !authToken) {
    throw new Error("Twilio credentials not configured");
  }

  // Create session first (for tracking)
  const [session] = await db.insert(surveySessions).values({
    surveyId: survey.id,
    tenantId: survey.tenantId,
    phoneNumber: recipient.phone,
    whatsappName: recipient.name || null,
    status: "active",
    currentQuestionIndex: -1, // -1 means not started yet
    deliveryMethod: "automatic",
  }).returning();

  // Prepare message
  const message = `¡Hola${recipient.name ? ` ${recipient.name}` : ""}! 👋\n\nTe invitamos a compartir tu opinión sobre: *${survey.title}*\n\nPara empezar, responde con: START_${survey.shortCode}\n\n📊 Solo ${survey.questions.length} preguntas, ~${Math.ceil(survey.questions.length * 0.5)} minutos.`;

  // Send via Twilio
  const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;

  const params = new URLSearchParams({
    From: fromNumber,
    To: recipient.phone.startsWith("whatsapp:") ? recipient.phone : `whatsapp:${recipient.phone}`,
    Body: message,
  });

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: "Basic " + Buffer.from(`${accountSid}:${authToken}`).toString("base64"),
    },
    body: params.toString(),
  });

  try {
    if (!response.ok) {
      const error = await response.text();
      console.error("Twilio API error:", error);
      throw new Error("Failed to send WhatsApp message");
    }

    const result = await response.json();

    return {
      messageId: result.sid,
      sessionId: session.id,
    };
  } catch (error) {
    await db
      .delete(surveySessions)
      .where(eq(surveySessions.id, session.id));
    throw error;
  }
}

// Generate personalized link response
function generateLinkResponse(
  survey: any,
  recipient: any,
  variables: any,
  options?: {
    reason?: "no_credits" | "missing_twilio_credentials" | "automatic_delivery_failed" | "manual";
  }
) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const publicUrl = `${baseUrl}/s/${survey.shortCode}`;

  // Build personalized link with query params
  const params = new URLSearchParams();
  if (recipient.name) params.append("name", recipient.name);
  if (variables) {
    Object.entries(variables).forEach(([key, value]) => {
      params.append(key, String(value));
    });
  }

  const personalizedLink = params.toString()
    ? `${publicUrl}?${params.toString()}`
    : publicUrl;

  // WhatsApp link
  const whatsappNumber = process.env.TWILIO_WHATSAPP_NUMBER || "whatsapp:+14155238886";
  const cleanNumber = whatsappNumber.replace(/whatsapp:/g, "").replace(/\+/g, "");
  const waMessage = recipient.name
    ? `Hola ${recipient.name}, completa tu encuesta: ${personalizedLink}`
    : `Completa esta encuesta: ${personalizedLink}`;
  const waLink = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(waMessage)}`;

  const reason = options?.reason ?? "manual";

  const messageMap: Record<string, string> = {
    no_credits: "No hay créditos disponibles, se generó un link de invitación.",
    missing_twilio_credentials: "Faltan credenciales de WhatsApp, se generó un link de invitación.",
    automatic_delivery_failed: "No se pudo enviar automáticamente, se generó un link de invitación.",
    manual: "Link de invitación generado exitosamente.",
  };

  return NextResponse.json({
    status: "link_generated",
    deliveryMethod: "link",
    personalizedLink,
    waLink,
    qrCodeUrl: `${baseUrl}/api/v1/surveys/${survey.id}/qr`,
    creditsRemaining: Math.max(0, survey.tenant.sendCreditsLimit - survey.tenant.sendCreditsUsed),
    message: messageMap[reason] ?? messageMap.manual,
    reason,
  });
}

// OPTIONS for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Authorization, Content-Type",
    },
  });
}
