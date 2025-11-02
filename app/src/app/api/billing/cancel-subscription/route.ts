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

export async function POST() {
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
        { error: "Solo el owner puede cancelar la suscripción" },
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

    if (!tenant.stripeSubscriptionId) {
      return NextResponse.json(
        { error: "No hay suscripción activa para cancelar" },
        { status: 400 }
      );
    }

    // Cancel subscription at period end (don't charge again, but let them use until end of billing cycle)
    const subscription = await stripe.subscriptions.update(
      tenant.stripeSubscriptionId,
      {
        cancel_at_period_end: true,
      }
    );

    // Update tenant status
    await db
      .update(tenants)
      .set({
        subscriptionStatus: "canceling",
      })
      .where(eq(tenants.id, tenant.id));

    return NextResponse.json({
      success: true,
      message: "Suscripción cancelada. Tendrás acceso hasta el final del periodo de facturación.",
      cancelAt: subscription.cancel_at ? new Date(subscription.cancel_at * 1000) : null,
    });
  } catch (error: any) {
    console.error("Error canceling subscription:", error);
    return NextResponse.json(
      { error: error.message || "Error al cancelar suscripción" },
      { status: 500 }
    );
  }
}
