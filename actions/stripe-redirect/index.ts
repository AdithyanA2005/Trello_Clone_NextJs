"use server";

import { revalidatePath } from "next/cache";
import { auth, currentUser } from "@clerk/nextjs/server";
import { siteConfig } from "@/config/site";
import { createSafeAction } from "@/lib/create-safe-action";
import { prisma } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { absoluteUrl } from "@/lib/utils";
import { StripeRedirect } from "./schema";
import { InputType, ReturnType } from "./types";

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

  const settingsUrl = absoluteUrl(`/organization/${orgId}`);
  let url = "";

  try {
    const orgSubscription = await prisma.orgSubscription.findUnique({
      where: {
        orgId,
      },
    });

    if (orgSubscription && orgSubscription.stripeCustomerId) {
      const stripeSession = await stripe.billingPortal.sessions.create({
        customer: orgSubscription.stripeCustomerId,
        return_url: settingsUrl,
      });
      url = stripeSession.url;
    } else {
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
    return {
      error: "Something went wrong",
    };
  }

  revalidatePath(`/organization/${orgId}`);
  return { data: url };
});
