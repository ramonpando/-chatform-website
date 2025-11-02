import { db } from "@/lib/db";
import { tenants } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
      console.error("No Stripe signature found");
      return NextResponse.json(
        { error: "No signature" },
        { status: 400 }
      );
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error("Webhook signature verification failed:", err.message);
      return NextResponse.json(
        { error: `Webhook Error: ${err.message}` },
        { status: 400 }
      );
    }

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case "customer.subscription.updated":
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;

      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      case "invoice.payment_succeeded":
        await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;

      case "invoice.payment_failed":
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Webhook handler error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const tenantId = session.metadata?.tenantId;
  const plan = session.metadata?.plan;

  if (!tenantId || !plan) {
    console.error("Missing metadata in checkout session");
    return;
  }

  const subscriptionId = session.subscription as string;

  // Update tenant with subscription info
  await db
    .update(tenants)
    .set({
      plan: plan as any,
      stripeSubscriptionId: subscriptionId,
      subscriptionStatus: "active",
      stripeCustomerId: session.customer as string,
    })
    .where(eq(tenants.id, tenantId));

  console.log(`✅ Checkout completed for tenant ${tenantId}, plan: ${plan}`);
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const tenantId = subscription.metadata?.tenantId;

  if (!tenantId) {
    console.error("Missing tenantId in subscription metadata");
    return;
  }

  const status = subscription.status;
  const plan = subscription.metadata?.plan;

  const updateData: any = {
    subscriptionStatus: status,
  };

  if (plan) {
    updateData.plan = plan;
  }

  await db
    .update(tenants)
    .set(updateData)
    .where(eq(tenants.id, tenantId));

  console.log(`✅ Subscription updated for tenant ${tenantId}, status: ${status}`);
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const tenantId = subscription.metadata?.tenantId;

  if (!tenantId) {
    console.error("Missing tenantId in subscription metadata");
    return;
  }

  // Downgrade to free plan
  await db
    .update(tenants)
    .set({
      plan: "free",
      subscriptionStatus: "canceled",
      stripeSubscriptionId: null,
    })
    .where(eq(tenants.id, tenantId));

  console.log(`✅ Subscription deleted for tenant ${tenantId}, downgraded to free`);
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  const subscriptionId = invoice.subscription as string;

  if (!subscriptionId) {
    return;
  }

  // Optional: Log successful payment, send receipt email, etc.
  console.log(`✅ Payment succeeded for subscription ${subscriptionId}`);
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  const subscriptionId = invoice.subscription as string;

  if (!subscriptionId) {
    return;
  }

  // Get subscription to find tenant
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  const tenantId = subscription.metadata?.tenantId;

  if (tenantId) {
    // Update status to indicate payment issue
    await db
      .update(tenants)
      .set({
        subscriptionStatus: "past_due",
      })
      .where(eq(tenants.id, tenantId));
  }

  // Optional: Send email notification to user
  console.log(`⚠️ Payment failed for subscription ${subscriptionId}`);
}
