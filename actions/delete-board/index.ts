"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { ACTION, ENTITY_TYPE } from "@prisma/client";
import { createAuditLog } from "@/lib/create-audit-log";
import { createSafeAction } from "@/lib/create-safe-action";
import { prisma } from "@/lib/db";
import { decrementUsedBoardCount } from "@/lib/org-limit";
import { DeleteBoard } from "./schema";
import { InputType, ReturnType } from "./types";

/**
 * Deletes a board from the database based on the provided board ID
 * This action is secured by verifying the user's authentication status before proceeding with the deletion.
 * Upon successful deletion, it triggers a cache revalidation for the organization to ensure data consistency.
 * Additionally, it redirects the user to the organization's page.
 *
 * @param {InputType} data - The input data for the deletion operation, including the board's `id`.
 * @returns {Promise<ReturnType>} - A promise that resolves to the operation's result, either confirming the deletion or an error message.
 */
export const deleteBoard = createSafeAction(DeleteBoard, async (data: InputType): Promise<ReturnType> => {
  // Check if the user is authenticated
  const { userId, orgId } = auth();
  if (!userId || !orgId) {
    // Return an error if the user is not authenticated
    return {
      error: "Unauthorized",
    };
  }

  const { id } = data;
  let board;

  try {
    board = await prisma.board.delete({
      where: { id, orgId },
    });

    await decrementUsedBoardCount();

    await createAuditLog({
      entityTitle: board.title,
      entityId: board.id,
      entityType: ENTITY_TYPE.BOARD,
      action: ACTION.DELETE,
    });
  } catch (error) {
    return {
      error: "Failed to delete",
    };
  }

  revalidatePath(`/organization/${orgId}`);
  redirect(`/organization/${orgId}`);
});
