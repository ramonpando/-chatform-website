import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { db } from "@/lib/db";
import { whatsappTemplates } from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";

// GET - List all templates for tenant
export async function GET(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.tenantId) {
      return NextResponse.json(
        { error: "unauthorized" },
        { status: 401 }
      );
    }

    // Get query params
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status"); // pending, approved, rejected, active

    // Build where clause
    const whereClause = status
      ? and(
          eq(whatsappTemplates.tenantId, session.user.tenantId),
          eq(whatsappTemplates.status, status)
        )
      : eq(whatsappTemplates.tenantId, session.user.tenantId);

    // Get templates
    const templates = await db.query.whatsappTemplates.findMany({
      where: whereClause,
      orderBy: [desc(whatsappTemplates.createdAt)],
    });

    return NextResponse.json({ templates });
  } catch (error) {
    console.error("Error fetching templates:", error);
    return NextResponse.json(
      { error: "internal_error" },
      { status: 500 }
    );
  }
}

// POST - Create new template
export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.tenantId) {
      return NextResponse.json(
        { error: "unauthorized" },
        { status: 401 }
      );
    }

    // Parse body
    const body = await req.json();
    const { name, description, message, variables, category, estimatedResponseRate } = body;

    // Validation
    if (!name || !message) {
      return NextResponse.json(
        { error: "missing_fields", message: "Name and message are required" },
        { status: 400 }
      );
    }

    if (name.length > 100) {
      return NextResponse.json(
        { error: "invalid_name", message: "Name must be 100 characters or less" },
        { status: 400 }
      );
    }

    if (message.length > 1000) {
      return NextResponse.json(
        { error: "invalid_message", message: "Message must be 1000 characters or less" },
        { status: 400 }
      );
    }

    // Validate variables array
    if (variables && !Array.isArray(variables)) {
      return NextResponse.json(
        { error: "invalid_variables", message: "Variables must be an array" },
        { status: 400 }
      );
    }

    // Extract variables from message ({{variable}})
    const extractedVariables = [...message.matchAll(/\{\{(\w+)\}\}/g)].map(m => m[1]);
    const finalVariables = variables || extractedVariables;

    // Create template
    const [template] = await db.insert(whatsappTemplates).values({
      tenantId: session.user.tenantId,
      name,
      description: description || null,
      message,
      variables: finalVariables,
      category: category || "custom",
      estimatedResponseRate: estimatedResponseRate || null,
      status: "active", // Auto-approve for now (later: 'pending')
    }).returning();

    return NextResponse.json({ template }, { status: 201 });
  } catch (error) {
    console.error("Error creating template:", error);
    return NextResponse.json(
      { error: "internal_error" },
      { status: 500 }
    );
  }
}
