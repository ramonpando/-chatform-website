import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { db } from "@/lib/db";
import { surveys, surveySessions, tenants } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { DEFAULT_TEMPLATES, fillTemplate } from "@/lib/whatsapp/templates";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: surveyId } = await params;
    const session = await auth();

    if (!session?.user?.tenantId) {
      return NextResponse.json(
        { error: "unauthorized" },
        { status: 401 }
      );
    }

    // Parse body
    const body = await req.json();
    const { phone, name, templateId, customVariables } = body;

    if (!phone || !/^\+\d{10,15}$/.test(phone)) {
      return NextResponse.json(
        { error: "invalid_phone", message: "Phone must be in E.164 format (+52...)" },
        { status: 400 }
      );
    }

    // Get survey
    const survey = await db.query.surveys.findFirst({
      where: and(
        eq(surveys.id, surveyId),
        eq(surveys.tenantId, session.user.tenantId)
      ),
      with: {
        tenant: true,
        questions: {
          orderBy: (questions, { asc }) => [asc(questions.orderIndex)],
        },
      },
    });

    if (!survey) {
      return NextResponse.json(
        { error: "not_found" },
        { status: 404 }
      );
    }

    if (survey.status !== "active") {
      return NextResponse.json(
        { error: "survey_inactive" },
        { status: 403 }
      );
    }

    const tenant = survey.tenant;

    // Check if has API key
    if (!tenant.apiKeyHash) {
      return NextResponse.json(
        { error: "no_api_key", message: "Generate an API key first" },
        { status: 403 }
      );
    }

    // Check credits
    if (tenant.sendCreditsUsed >= tenant.sendCreditsLimit) {
      return NextResponse.json(
        { error: "no_credits", message: "No send credits available" },
        { status: 403 }
      );
    }

    // Check if Twilio is configured
    const hasTwilio = Boolean(
      process.env.TWILIO_ACCOUNT_SID &&
      process.env.TWILIO_AUTH_TOKEN &&
      process.env.TWILIO_WHATSAPP_NUMBER
    );

    if (!hasTwilio) {
      // Generate link instead
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
      const publicUrl = `${baseUrl}/s/${survey.shortCode}`;

      return NextResponse.json({
        status: "link_generated",
        deliveryMethod: "link",
        link: publicUrl,
        message: "Twilio not configured, link generated instead",
      });
    }

    // Send via WhatsApp
    try {
      const result = await sendWhatsAppSurvey(survey, {
        phone,
        name,
        templateId: templateId || "friendly-short",
        customVariables: customVariables || {}
      });

      // Increment credits
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
        sessionId: result.sessionId,
      });
    } catch (error) {
      console.error("Failed to send WhatsApp:", error);
      return NextResponse.json(
        { error: "send_failed", message: String(error) },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error in send-bulk:", error);
    return NextResponse.json(
      { error: "internal_error" },
      { status: 500 }
    );
  }
}

async function sendWhatsAppSurvey(
  survey: any,
  recipient: {
    phone: string;
    name?: string;
    templateId: string;
    customVariables: Record<string, string>;
  }
) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_WHATSAPP_NUMBER || "whatsapp:+14155238886";

  if (!accountSid || !authToken) {
    throw new Error("Twilio credentials not configured");
  }

  // Create session
  const [session] = await db.insert(surveySessions).values({
    surveyId: survey.id,
    tenantId: survey.tenantId,
    phoneNumber: recipient.phone,
    whatsappName: recipient.name || null,
    status: "active",
    currentQuestionIndex: -1,
    deliveryMethod: "automatic",
  }).returning();

  const tenant = survey.tenant;

  // Build variables for template
  const variables: Record<string, string> = {
    // Automatic variables
    name: recipient.name || "Usuario",
    topic: survey.title,
    question_count: survey.questions.length.toString(),
    estimated_time: Math.max(1, Math.ceil(survey.questions.length * 0.5)).toString(),
    link: `Para empezar, responde con: START_${survey.shortCode}`,

    // From tenant
    company: tenant?.name || "nuestro equipo",
    sender: tenant?.name || "el equipo",

    // Custom variables (e.g., context, incentive)
    ...recipient.customVariables,
  };

  // Send via Twilio
  const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
  let params: URLSearchParams;

  // Check if using Twilio Content API or ChatForm templates
  if (tenant?.whatsappProvider === "twilio" && tenant?.twilioContentSid) {
    // Use Twilio Content API
    const contentVariables: Record<string, string> = {};

    // Map configured variables
    if (tenant.twilioContentVariables) {
      for (const [key, template] of Object.entries(tenant.twilioContentVariables as Record<string, string>)) {
        // Replace placeholders like {{name}} with actual values
        const value = template.replace(/\{\{(\w+)\}\}/g, (_, varName: string) => {
          return variables[varName] || "";
        });
        contentVariables[key] = value;
      }
    }

    params = new URLSearchParams({
      From: fromNumber,
      To: recipient.phone.startsWith("whatsapp:") ? recipient.phone : `whatsapp:${recipient.phone}`,
      ContentSid: tenant.twilioContentSid,
      ContentVariables: JSON.stringify(contentVariables),
    });
  } else {
    // Use ChatForm templates (default)
    // Get selected template
    const template = DEFAULT_TEMPLATES.find(t => t.id === recipient.templateId)
      || DEFAULT_TEMPLATES.find(t => t.id === "friendly-short")!;

    // Fill template with variables
    const message = fillTemplate(template.message, variables);

    params = new URLSearchParams({
      From: fromNumber,
      To: recipient.phone.startsWith("whatsapp:") ? recipient.phone : `whatsapp:${recipient.phone}`,
      Body: message,
    });
  }

  // Log what we're sending (for debugging)
  console.log("[SEND-BULK] Sending to Twilio:", {
    provider: tenant?.whatsappProvider,
    contentSid: tenant?.twilioContentSid,
    to: recipient.phone,
    method: tenant?.whatsappProvider === "twilio" ? "ContentSid" : "Body",
    params: params.toString().substring(0, 200), // First 200 chars
  });

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: "Basic " + Buffer.from(`${accountSid}:${authToken}`).toString("base64"),
    },
    body: params.toString(),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error("[SEND-BULK] Twilio API error:", {
      status: response.status,
      statusText: response.statusText,
      error: error,
      to: recipient.phone,
    });

    // Delete session if send failed
    await db
      .delete(surveySessions)
      .where(eq(surveySessions.id, session.id));

    throw new Error("Failed to send WhatsApp message");
  }

  const result = await response.json();

  console.log("[SEND-BULK] Message sent successfully:", {
    messageSid: result.sid,
    sessionId: session.id,
    to: recipient.phone,
  });

  // NOTE: We cannot send a follow-up message here because it would also need
  // to be an approved template (Business Initiated message).
  // The user must respond to the initial template to start the 24-hour conversation window.
  // Once they respond with anything, the webhook will detect the pending session
  // and automatically start the survey.

  return {
    messageId: result.sid,
    sessionId: session.id,
  };
}
