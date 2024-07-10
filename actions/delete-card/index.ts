"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";
import { ACTION, ENTITY_TYPE } from "@prisma/client";
import { createAuditLog } from "@/lib/database/helpers/audit-log";
import { prisma } from "@/lib/database/prisma";
import { createSafeAction } from "@/lib/helpers/create-safe-action";
import { DeleteCard } from "./schema";
import { InputType, ReturnType } from "./types";

/**
 * Deletes a card from a list on a board.
 *
 * This server-side function authenticates the user and checks their authorization before attempting to delete a card.
 * It uses the provided card ID and board ID to locate and delete the specified card. Upon successful deletion, the cache
 * for the board is revalidated to ensure the frontend reflects the change. If the user is not authenticated, the specified
 * card is not found, or the deletion fails, an error is returned.
 *
 * @param {InputType} data - The input data for deleting the card, including the card's id and the boardId it belongs to.
 * @returns {Promise<ReturnType>} - The result of the deletion operation. Returns the deleted card data on success or an error message on failure.
 */
export const deleteCard = createSafeAction(DeleteCard, async (data: InputType): Promise<ReturnType> => {
  // Check if the user is authenticated
  const { userId, orgId } = auth();
  if (!userId || !orgId) {
    // Return an error if the user is not authenticated
    return {
      error: "Unauthorized",
    };
  }

  const { id, boardId } = data;
  let card;

  try {
    // Attempt to delete the card from the database
    card = await prisma.card.delete({
      where: {
        id,
        list: { board: { orgId } },
      },
    });

    // Create an audit log for the card deletion
    await createAuditLog({
      entityTitle: card.title,
      entityId: card.id,
      entityType: ENTITY_TYPE.CARD,
      action: ACTION.DELETE,
    });
  } catch (error) {
    return {
      error: "Failed to delete",
    };
  }

  // Revalidate the board's path to update the cache
  revalidatePath(`/board/${boardId}`);
  return { data: card };
});
