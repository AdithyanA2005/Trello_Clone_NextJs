import { auth, currentUser } from "@clerk/nextjs/server";
import { ACTION, ENTITY_TYPE } from "@prisma/client";
import { prisma } from "@/lib/database/prisma";

interface Props {
  entityId: string;
  entityType: ENTITY_TYPE;
  entityTitle: string;
  action: ACTION;
}

export async function createAuditLog({ entityId, entityType, entityTitle, action }: Props) {
  const { orgId } = auth();
  const user = await currentUser();
  if (!user || !orgId) return;

  await prisma.auditLog.create({
    data: {
      action,
      entityType,
      entityId,
      entityTitle,
      orgId,
      userId: user.id,
      userImage: user.imageUrl,
      userName: user.firstName + " " + user.lastName,
    },
  });
}
