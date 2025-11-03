import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { db } from "@/lib/db";
import { whatsappTemplates } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

// GET - Get single template
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();

    if (!session?.user?.tenantId) {
      return NextResponse.json(
        { error: "unauthorized" },
        { status: 401 }
      );
    }

    const template = await db.query.whatsappTemplates.findFirst({
      where: and(
        eq(whatsappTemplates.id, id),
        eq(whatsappTemplates.tenantId, session.user.tenantId)
      ),
    });

    if (!template) {
      return NextResponse.json(
        { error: "not_found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ template });
  } catch (error) {
    console.error("Error fetching template:", error);
    return NextResponse.json(
      { error: "internal_error" },
      { status: 500 }
    );
  }
}

// PATCH - Update template
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();

    if (!session?.user?.tenantId) {
      return NextResponse.json(
        { error: "unauthorized" },
        { status: 401 }
      );
    }

    // Check ownership
    const existing = await db.query.whatsappTemplates.findFirst({
      where: and(
        eq(whatsappTemplates.id, id),
        eq(whatsappTemplates.tenantId, session.user.tenantId)
      ),
    });

    if (!existing) {
      return NextResponse.json(
        { error: "not_found" },
        { status: 404 }
      );
    }

    // Parse body
    const body = await req.json();
    const { name, description, message, variables, category, estimatedResponseRate, status } = body;

    // Build update object
    const updates: any = {
      updatedAt: new Date(),
    };

    if (name !== undefined) {
      if (name.length > 100) {
        return NextResponse.json(
          { error: "invalid_name", message: "Name must be 100 characters or less" },
          { status: 400 }
        );
      }
      updates.name = name;
    }

    if (description !== undefined) updates.description = description;

    if (message !== undefined) {
      if (message.length > 1000) {
        return NextResponse.json(
          { error: "invalid_message", message: "Message must be 1000 characters or less" },
          { status: 400 }
        );
      }
      updates.message = message;

      // Re-extract variables if message changed
      const extractedVariables = [...message.matchAll(/\{\{(\w+)\}\}/g)].map(m => m[1]);
      updates.variables = variables || extractedVariables;
    } else if (variables !== undefined) {
      updates.variables = variables;
    }

    if (category !== undefined) updates.category = category;
    if (estimatedResponseRate !== undefined) updates.estimatedResponseRate = estimatedResponseRate;
    if (status !== undefined) updates.status = status;

    // Update
    const [updated] = await db
      .update(whatsappTemplates)
      .set(updates)
      .where(eq(whatsappTemplates.id, id))
      .returning();

    return NextResponse.json({ template: updated });
  } catch (error) {
    console.error("Error updating template:", error);
    return NextResponse.json(
      { error: "internal_error" },
      { status: 500 }
    );
  }
}

// DELETE - Delete template
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();

    if (!session?.user?.tenantId) {
      return NextResponse.json(
        { error: "unauthorized" },
        { status: 401 }
      );
    }

    // Check ownership
    const existing = await db.query.whatsappTemplates.findFirst({
      where: and(
        eq(whatsappTemplates.id, id),
        eq(whatsappTemplates.tenantId, session.user.tenantId)
      ),
    });

    if (!existing) {
      return NextResponse.json(
        { error: "not_found" },
        { status: 404 }
      );
    }

    // Delete
    await db
      .delete(whatsappTemplates)
      .where(eq(whatsappTemplates.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting template:", error);
    return NextResponse.json(
      { error: "internal_error" },
      { status: 500 }
    );
  }
}
