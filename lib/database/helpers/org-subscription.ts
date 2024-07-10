import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/database/prisma";

const DAY_IN_MS = 1000 * 60 * 60 * 24;

export async function checkSubscription() {
  const { orgId } = auth();
  if (!orgId) return false;

  const orgSubscription = await prisma.orgSubscription.findUnique({
    where: { orgId },
    select: {
      stripePriceId: true,
      stripeCustomerId: true,
      stripeSubscriptionId: true,
      stripeCurrentPeriodEnd: true,
    },
  });
  if (!orgSubscription) return false;

  const isValid =
    orgSubscription.stripePriceId && orgSubscription.stripeCurrentPeriodEnd?.getTime()! + DAY_IN_MS > Date.now();

  return !!isValid;
}
