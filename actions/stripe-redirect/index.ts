"use server";

import { revalidatePath } from "next/cache";
import { auth, currentUser } from "@clerk/nextjs/server";
import { siteConfig } from "@/config/site";
import { createSafeAction } from "@/lib/create-safe-action";
import { prisma } from "@/lib/database/prisma";
import { stripe } from "@/lib/stripe";
import { absoluteUrl } from "@/lib/utils";
import { StripeRedirect } from "./schema";
import { InputType, ReturnType } from "./types";

/**
 * Handles Stripe redirection for subscription management.
 *
 * This function checks if the user is authenticated and then proceeds to either redirect the user to the Stripe billing portal
 * for existing subscriptions or to a Stripe checkout session for new subscriptions. It uses the organization ID to determine
 * the subscription status and constructs the appropriate Stripe session accordingly. The function also ensures that the user
 * is redirected back to the organization settings page after completing their interaction with Stripe.
 *
 * @param {InputType} data - The input data for the action, including any necessary identifiers.
 * @returns {Promise<ReturnType>} - An object containing either the URL to redirect to or an error message.
 */
export const stripeRedirect = createSafeAction(StripeRedirect, async (data: InputType): Promise<ReturnType> => {
  // Check if the user is authenticated
  const { userId, orgId } = auth();
  const user = await currentUser();
  if (!userId || !orgId || !user) {
    // Return an error if the user is not authenticated
    return {
      error: "Unauthorized",
    };
  }

  // the page to which the user will be redirected after the stripe page is closed
  const settingsUrl = absoluteUrl(`/organization/${orgId}`);
  let url = "";

  try {
    // Check if the organization has a subscription
    const orgSubscription = await prisma.orgSubscription.findUnique({
      where: {
        orgId,
      },
    });

    // If the organization has a subscription, redirect to the billing portal
    if (orgSubscription && orgSubscription.stripeCustomerId) {
      const stripeSession = await stripe.billingPortal.sessions.create({
        customer: orgSubscription.stripeCustomerId,
        return_url: settingsUrl,
      });
      url = stripeSession.url;
    }
    // If the organization does not have a subscription, create a new subscription
    else {
      const stripeSession = await stripe.checkout.sessions.create({
        success_url: settingsUrl,
        cancel_url: settingsUrl,
        payment_method_types: ["card"],
        mode: "subscription",
        billing_address_collection: "required",
        customer_email: user.emailAddresses[0].emailAddress,
        line_items: [
          {
            price_data: {
              currency: "INR",
              product_data: {
                name: `${siteConfig.name} Pro`,
                description: "Unlimited boards for your organization",
              },
              unit_amount: 200000,
              recurring: {
                interval: "month",
              },
            },
            quantity: 1,
          },
        ],
        metadata: {
          orgId,
        },
      });
      url = stripeSession.url || "";
    }
  } catch {
    // Return an error if the stripe session creation fails
    return {
      error: "Something went wrong",
    };
  }

  // Redirect the user to organization page
  revalidatePath(`/organization/${orgId}`);
  return { data: url };
});
