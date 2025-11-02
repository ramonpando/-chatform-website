import { auth } from "@/lib/auth/config";
import { db } from "@/lib/db";
import { tenants } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";
import { isOwnerOrAdmin } from "@/lib/auth/rbac";

// GET /api/tenant - Get current tenant info
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id || !session?.user?.tenantId) {
      return NextResponse.json(
        { error: "No autenticado" },
        { status: 401 }
      );
    }

    const tenant = await db.query.tenants.findFirst({
      where: eq(tenants.id, session.user.tenantId),
      columns: {
        id: true,
        name: true,
        slug: true,
        plan: true,
        createdAt: true,
        subscriptionStatus: true,
        apiKeyPrefix: true,
        // Limits
        responsesUsedThisMonth: true,
      },
    });

    if (!tenant) {
      return NextResponse.json(
        { error: "Workspace no encontrado" },
        { status: 404 }
      );
    }

    // Get plan limits from constants
    const planLimits = {
      free: { maxSurveys: 1, maxWhatsAppResponses: 50 },
      starter: { maxSurveys: 3, maxWhatsAppResponses: 200 },
      pro: { maxSurveys: -1, maxWhatsAppResponses: 1000 },
      business: { maxSurveys: -1, maxWhatsAppResponses: 3000 },
    };

    const limits = planLimits[tenant.plan as keyof typeof planLimits] || planLimits.free;

    return NextResponse.json({
      ...tenant,
      limits: {
        maxSurveys: limits.maxSurveys,
        maxWhatsAppResponses: limits.maxWhatsAppResponses,
        responsesUsedThisMonth: tenant.responsesUsedThisMonth,
      },
    });
  } catch (error) {
    console.error("Error fetching tenant:", error);
    return NextResponse.json(
      { error: "Error al obtener workspace" },
      { status: 500 }
    );
  }
}

// PATCH /api/tenant - Update tenant info
const updateTenantSchema = z.object({
  name: z.string().min(2, "Nombre debe tener al menos 2 caracteres").max(100).optional(),
  slug: z
    .string()
    .min(2, "Slug debe tener al menos 2 caracteres")
    .max(50)
    .regex(/^[a-z0-9-]+$/, "Slug solo puede contener letras minúsculas, números y guiones")
    .optional(),
});

export async function PATCH(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id || !session?.user?.tenantId) {
      return NextResponse.json(
        { error: "No autenticado" },
        { status: 401 }
      );
    }

    // Check if user is owner or admin
    const isAuthorized = await isOwnerOrAdmin(session.user.id, session.user.tenantId);
    if (!isAuthorized) {
      return NextResponse.json(
        { error: "No tienes permisos para actualizar el workspace. Solo owners y admins pueden hacerlo." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validation = updateTenantSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const { name, slug } = validation.data;

    // Check if slug is already taken by another tenant
    if (slug) {
      const existingTenant = await db.query.tenants.findFirst({
        where: eq(tenants.slug, slug),
      });

      if (existingTenant && existingTenant.id !== session.user.tenantId) {
        return NextResponse.json(
          { error: "El slug ya está en uso por otro workspace" },
          { status: 400 }
        );
      }
    }

    // Prepare update object
    const updateData: any = {};
    if (name) updateData.name = name;
    if (slug) updateData.slug = slug;

    // Update tenant
    const [updatedTenant] = await db
      .update(tenants)
      .set(updateData)
      .where(eq(tenants.id, session.user.tenantId))
      .returning({
        id: tenants.id,
        name: tenants.name,
        slug: tenants.slug,
      });

    return NextResponse.json({
      success: true,
      tenant: updatedTenant,
    });
  } catch (error) {
    console.error("Error updating tenant:", error);
    return NextResponse.json(
      { error: "Error al actualizar workspace" },
      { status: 500 }
    );
  }
}
