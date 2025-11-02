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

export async function POST(request: Request) {
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
        { error: "Solo el owner puede gestionar la suscripción" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { priceId, plan } = body;

    if (!priceId || !plan) {
      return NextResponse.json(
        { error: "priceId y plan son requeridos" },
        { status: 400 }
      );
    }

    // Validate plan
    const validPlans = ["starter", "pro", "business"];
    if (!validPlans.includes(plan)) {
      return NextResponse.json(
        { error: "Plan inválido" },
        { status: 400 }
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

    // Check if tenant already has active subscription
    if (tenant.stripeSubscriptionId && tenant.subscriptionStatus === "active") {
      return NextResponse.json(
        { error: "Ya tienes una suscripción activa. Cancela primero o usa el Customer Portal para cambiar de plan." },
        { status: 400 }
      );
    }

    // Create or retrieve Stripe customer
    let customerId = tenant.stripeCustomerId;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: session.user.email!,
        metadata: {
          tenantId: tenant.id,
          tenantName: tenant.name,
        },
      });

      customerId = customer.id;

      // Update tenant with Stripe customer ID
      await db
        .update(tenants)
        .set({ stripeCustomerId: customerId })
        .where(eq(tenants.id, tenant.id));
    }

    // Create Checkout Session
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings/billing?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings/billing?canceled=true`,
      metadata: {
        tenantId: tenant.id,
        plan: plan,
      },
      subscription_data: {
        metadata: {
          tenantId: tenant.id,
          plan: plan,
        },
      },
    });

    return NextResponse.json({
      success: true,
      checkoutUrl: checkoutSession.url,
      sessionId: checkoutSession.id,
    });
  } catch (error: any) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { error: error.message || "Error al crear sesión de checkout" },
      { status: 500 }
    );
  }
}
