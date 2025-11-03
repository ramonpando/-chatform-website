import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { db } from "@/lib/db";
import { tenants } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

// GET - Get current WhatsApp configuration
export async function GET(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.tenantId) {
      return NextResponse.json(
        { error: "unauthorized" },
        { status: 401 }
      );
    }

    // Get tenant config
    const tenant = await db.query.tenants.findFirst({
      where: eq(tenants.id, session.user.tenantId),
    });

    if (!tenant) {
      return NextResponse.json(
        { error: "tenant_not_found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      config: {
        provider: tenant.whatsappProvider || "chatform",
        twilioContentSid: tenant.twilioContentSid || undefined,
        twilioContentVariables: tenant.twilioContentVariables || undefined,
      },
    });
  } catch (error) {
    console.error("Error fetching WhatsApp config:", error);
    return NextResponse.json(
      { error: "internal_error" },
      { status: 500 }
    );
  }
}

// POST - Update WhatsApp configuration
export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.tenantId) {
      return NextResponse.json(
        { error: "unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { provider, twilioContentSid, twilioContentVariables } = body;

    // Validate provider
    if (!provider || !["chatform", "twilio"].includes(provider)) {
      return NextResponse.json(
        { error: "invalid_provider" },
        { status: 400 }
      );
    }

    // If provider is twilio, require ContentSid
    if (provider === "twilio" && !twilioContentSid) {
      return NextResponse.json(
        { error: "content_sid_required", message: "ContentSid is required for Twilio provider" },
        { status: 400 }
      );
    }

    // Update tenant
    await db
      .update(tenants)
      .set({
        whatsappProvider: provider,
        twilioContentSid: provider === "twilio" ? twilioContentSid : null,
        twilioContentVariables: provider === "twilio" ? twilioContentVariables || {} : null,
        updatedAt: new Date(),
      })
      .where(eq(tenants.id, session.user.tenantId));

    return NextResponse.json({
      success: true,
      config: {
        provider,
        twilioContentSid: provider === "twilio" ? twilioContentSid : undefined,
        twilioContentVariables: provider === "twilio" ? twilioContentVariables : undefined,
      },
    });
  } catch (error) {
    console.error("Error updating WhatsApp config:", error);
    return NextResponse.json(
      { error: "internal_error" },
      { status: 500 }
    );
  }
}
