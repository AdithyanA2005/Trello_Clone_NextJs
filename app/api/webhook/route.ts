import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/database/prisma";
import { stripe } from "@/lib/integrations/stripe";

export async function POST(req: Request) {
  // Parse the request body and validate the signature.
  const body = await req.text();
  const signature = headers().get("Stripe-Signature") as string;

  // Verify the event by passing the signature and body to the Stripe SDK.
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return new NextResponse("Webhook error", { status: 400 });
  }

  // Handle the event.
  const session = event.data.object as Stripe.Checkout.Session;

  // Handle checkout session completed event.
  if (event.type === "checkout.session.completed") {
    const subscription = await stripe.subscriptions.retrieve(session.subscription as string);

    if (!session.metadata?.orgId) {
      return new NextResponse("Org ID is required", { status: 400 });
    }

    await prisma.orgSubscription.create({
      data: {
        orgId: session?.metadata?.orgId,
        stripeSubscriptionId: subscription.id,
        stripeCustomerId: subscription.customer as string,
        stripePriceId: subscription.items.data[0].price.id,
        stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
      },
    });
  }

  // Handle invoice payment succeeded event
  if (event.type === "invoice.payment_succeeded") {
    const subscription = await stripe.subscriptions.retrieve(session.subscription as string);

    await prisma.orgSubscription.update({
      where: {
        stripeSubscriptionId: subscription.id,
      },
      data: {
        stripePriceId: subscription.items.data[0].price.id,
        stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
      },
    });
  }

  return new NextResponse(null, { status: 200 });
}
