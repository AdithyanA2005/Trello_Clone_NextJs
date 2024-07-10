import { auth } from "@clerk/nextjs/server";
import { MAX_FREE_BOARDS } from "@/lib/constants/boards";
import { prisma } from "@/lib/database/prisma";

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

export async function getUsedBoardCount() {
  const { orgId } = auth();
  if (!orgId) return 0;

  const orgLimit = await prisma.orgLimit.findUnique({
    where: { orgId },
  });

  if (!orgLimit) return 0;
  return orgLimit.count;
}

export async function hasUnusedBoard() {
  const { orgId } = auth();
  if (!orgId) throw new Error("Unauthorized");

  const orgLimit = await prisma.orgLimit.findUnique({
    where: { orgId },
  });

  return !orgLimit || orgLimit.count < MAX_FREE_BOARDS;
}
