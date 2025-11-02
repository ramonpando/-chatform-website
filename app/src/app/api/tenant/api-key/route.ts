import { auth } from "@/lib/auth/config";
import { db } from "@/lib/db";
import { tenants } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { hashApiKey, getApiKeyPrefix } from "@/lib/security/api-keys";
import { isOwnerOrAdmin } from "@/lib/auth/rbac";

// POST /api/tenant/api-key - Generate new API key
export async function POST() {
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
        { error: "No tienes permisos para generar API keys. Solo owners y admins pueden hacerlo." },
        { status: 403 }
      );
    }

    // Generate API key with prefix
    const rawKey = `cfk_${nanoid(32)}`;
    const hashedKey = hashApiKey(rawKey);
    const prefix = getApiKeyPrefix(rawKey, 10);

    // Update tenant with new API key (this will revoke the old one)
    const [updatedTenant] = await db
      .update(tenants)
      .set({
        apiKeyHash: hashedKey,
        apiKeyPrefix: prefix,
      })
      .where(eq(tenants.id, session.user.tenantId))
      .returning({
        id: tenants.id,
        name: tenants.name,
        apiKeyPrefix: tenants.apiKeyPrefix,
      });

    return NextResponse.json({
      success: true,
      apiKey: rawKey, // Return the raw key ONLY ONCE
      prefix: prefix,
      tenant: updatedTenant,
      warning: "Guarda esta key ahora. No podrás verla de nuevo.",
      createdAt: new Date(),
    });
  } catch (error) {
    console.error("Error generating API key:", error);
    return NextResponse.json(
      { error: "Error al generar API key" },
      { status: 500 }
    );
  }
}

// DELETE /api/tenant/api-key - Revoke API key
export async function DELETE() {
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
        { error: "No tienes permisos para revocar API keys. Solo owners y admins pueden hacerlo." },
        { status: 403 }
      );
    }

    // Get current tenant to check if it has an API key
    const tenant = await db.query.tenants.findFirst({
      where: eq(tenants.id, session.user.tenantId),
      columns: {
        apiKeyHash: true,
      },
    });

    if (!tenant?.apiKeyHash) {
      return NextResponse.json(
        { error: "No hay API key para revocar" },
        { status: 400 }
      );
    }

    // Revoke API key by setting to null
    await db
      .update(tenants)
      .set({
        apiKeyHash: null,
        apiKeyPrefix: null,
      })
      .where(eq(tenants.id, session.user.tenantId));

    return NextResponse.json({
      success: true,
      message: "API key revocada exitosamente",
    });
  } catch (error) {
    console.error("Error revoking API key:", error);
    return NextResponse.json(
      { error: "Error al revocar API key" },
      { status: 500 }
    );
  }
}
