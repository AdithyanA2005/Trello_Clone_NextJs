import { auth } from "@clerk/nextjs/server";
import { MAX_FREE_BOARDS } from "@/lib/constants/boards";
import { prisma } from "@/lib/database/prisma";

// Increment the used board count for the organization.
export async function incrementUsedBoardCount() {
  const { orgId } = auth();
  if (!orgId) throw new Error("Unauthorized");

  const orgLimit = await prisma.orgLimit.findUnique({
    where: { orgId },
  });

  if (orgLimit) {
    await prisma.orgLimit.update({
      where: { orgId },
      data: { count: orgLimit.count + 1 },
    });
  } else {
    await prisma.orgLimit.create({
      data: { orgId, count: 1 },
    });
  }
}

// Decrement the used board count for the organization.
export async function decrementUsedBoardCount() {
  const { orgId } = auth();
  if (!orgId) throw new Error("Unauthorized");

  const orgLimit = await prisma.orgLimit.findUnique({
    where: { orgId },
  });

  if (orgLimit) {
    await prisma.orgLimit.update({
      where: { orgId },
      data: { count: orgLimit.count > 0 ? orgLimit.count - 1 : 0 },
    });
  } else {
    await prisma.orgLimit.create({
      data: { orgId, count: 1 },
    });
  }
}

// Gives no of board used by the organization
export async function getUsedBoardCount() {
  const { orgId } = auth();
  if (!orgId) return 0;

  const orgLimit = await prisma.orgLimit.findUnique({
    where: { orgId },
  });

  if (!orgLimit) return 0;
  return orgLimit.count;
}

// Check if the organization has any unused boards left.
export async function hasUnusedBoard() {
  const { orgId } = auth();
  if (!orgId) throw new Error("Unauthorized");

  const orgLimit = await prisma.orgLimit.findUnique({
    where: { orgId },
  });

  return !orgLimit || orgLimit.count < MAX_FREE_BOARDS;
}
