"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { ACTION, ENTITY_TYPE } from "@prisma/client";
import { createSafeAction } from "@/lib/create-safe-action";
import { createAuditLog } from "@/lib/database/helpers/audit-log";
import { decrementUsedBoardCount, hasUnusedBoard } from "@/lib/database/helpers/org-limit";
import { checkSubscription } from "@/lib/database/helpers/org-subscription";
import { prisma } from "@/lib/database/prisma";
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

  // Check if the user has any unused boards left (pro has unlimited)
  let isPro;
  try {
    isPro = await checkSubscription();
  } catch {
    return {
      error: "Failed to check subscription status",
    };
  }

  // Extract the board ID from the input data
  const { id } = data;

  let board;
  try {
    // Attempt to delete the board from the database
    board = await prisma.board.delete({
      where: { id, orgId },
    });

    // Decrement the used board count if the user is not on a pro plan
    if (!isPro) await decrementUsedBoardCount();

    // Create an audit log for the board deletion
    await createAuditLog({
      entityTitle: board.title,
      entityId: board.id,
      entityType: ENTITY_TYPE.BOARD,
      action: ACTION.DELETE,
    });
  } catch (error) {
    // Return an error if the deletion fails
    return {
      error: "Failed to delete",
    };
  }

  // Revalidate the organization's path to update the cache
  revalidatePath(`/organization/${orgId}`);
  redirect(`/organization/${orgId}`);
});
