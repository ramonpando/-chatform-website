import { db } from "@/lib/db";
import { tenants } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import Stripe from "stripe";

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-10-29.clover",
  });
}

export async function POST(request: Request) {
  try {
    const stripe = getStripe();
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
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

  // Get plan limits to update in database
  const { getPlanDetails } = await import("@/lib/constants/pricing");
  const planDetails = getPlanDetails(plan as any);

  // Update tenant with subscription info AND plan limits
  await db
    .update(tenants)
    .set({
      plan: plan as any,
      stripeSubscriptionId: subscriptionId,
      subscriptionStatus: "active",
      stripeCustomerId: session.customer as string,
      // Update plan limits based on new plan
      responsesLimit: planDetails.maxWhatsAppResponses,
      surveysLimit: planDetails.maxSurveys === -1 ? 999999 : planDetails.maxSurveys,
      responsesUsedThisMonth: 0, // Reset counter on upgrade
    })
    .where(eq(tenants.id, tenantId));

  console.log(`✅ Checkout completed for tenant ${tenantId}, plan: ${plan}, limits: ${planDetails.maxSurveys} surveys, ${planDetails.maxWhatsAppResponses} WhatsApp responses/month`);
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

  // Downgrade to free plan (reset counters and limits)
  const { getPlanDetails } = await import("@/lib/constants/pricing");
  const freePlanDetails = getPlanDetails("free");

  await db
    .update(tenants)
    .set({
      plan: "free",
      subscriptionStatus: "canceled",
      stripeSubscriptionId: null,
      responsesLimit: freePlanDetails.maxWhatsAppResponses,
      surveysLimit: freePlanDetails.maxSurveys,
      responsesUsedThisMonth: 0, // Reset counter on downgrade
    })
    .where(eq(tenants.id, tenantId));

  // NOTE: Existing surveys beyond free plan limit (1) will remain accessible
  // but user won't be able to create new ones until they delete some or upgrade
  // This is intentional to avoid data loss

  console.log(`✅ Subscription deleted for tenant ${tenantId}, downgraded to free (existing data preserved)`);
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  // In newer Stripe API versions, subscription may not be directly on Invoice
  // We can skip this handler or retrieve subscription from metadata if needed
  console.log(`✅ Payment succeeded for invoice ${invoice.id}`);
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  // For payment failures, we rely on subscription.updated events
  // which are more reliable for status changes
  console.log(`⚠️ Payment failed for invoice ${invoice.id}`);
}
