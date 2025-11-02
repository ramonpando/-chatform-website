import { auth } from "@/lib/auth/config";
import { db } from "@/lib/db";
import { tenants } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { isOwner } from "@/lib/auth/rbac";

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-10-29.clover",
  });
}

export async function GET() {
  try {
    const session = await auth();
    const stripe = getStripe();

    if (!session?.user?.id || !session?.user?.tenantId) {
      return NextResponse.json(
        { error: "No autenticado" },
        { status: 401 }
      );
    }

    // Check if user is owner
    const isOwnerUser = await isOwner(session.user.id, session.user.tenantId);
    if (!isOwnerUser) {
      return NextResponse.json(
        { error: "Solo el owner puede acceder al portal de billing" },
        { status: 403 }
      );
    }

    // Get tenant
    const tenant = await db.query.tenants.findFirst({
      where: eq(tenants.id, session.user.tenantId),
    });

    if (!tenant) {
      return NextResponse.json(
        { error: "Tenant no encontrado" },
        { status: 404 }
      );
    }

    if (!tenant.stripeCustomerId) {
      return NextResponse.json(
        { error: "No hay customer de Stripe. Primero suscríbete a un plan." },
        { status: 400 }
      );
    }

    // Create portal session
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: tenant.stripeCustomerId,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings/billing`,
    });

    return NextResponse.json({
      success: true,
      portalUrl: portalSession.url,
    });
  } catch (error: any) {
    console.error("Error creating portal session:", error);
    return NextResponse.json(
      { error: error.message || "Error al crear portal session" },
      { status: 500 }
    );
  }
}
