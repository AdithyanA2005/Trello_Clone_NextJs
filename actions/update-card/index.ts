"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";
import { ACTION, ENTITY_TYPE } from "@prisma/client";
import { createSafeAction } from "@/lib/create-safe-action";
import { createAuditLog } from "@/lib/database/helpers/audit-log";
import { prisma } from "@/lib/database/prisma";
import { UpdateCard } from "./schema";
import { InputType, ReturnType } from "./types";

/**
 * Updates a card's details within a list on a board.
 *
 * This server-side function first authenticates the user and checks their authorization. It then updates the specified card's details,
 * such as title, description, or position, based on the provided input. After successfully updating the card, it revalidates the cache
 * for the board to ensure the frontend reflects the updated card details. If the user is not authenticated or if the update process fails,
 * an error is returned.
 *
 * @param {InputType} data - The input data for updating the card, including the card's id, boardId, and other fields to be updated.
 * @returns {Promise<ReturnType>} - The result of the update operation. Returns the updated card data on success or an error message on failure.
 */
export const updateCard = createSafeAction(UpdateCard, async (data: InputType): Promise<ReturnType> => {
  // Check if the user is authenticated
  const { userId, orgId } = auth();
  if (!userId || !orgId) {
    // Return an error if the user is not authenticated
    return {
      error: "Unauthorized",
    };
  }

  const { boardId, id, ...values } = data;
  let card;

  try {
    // Attempt to update the board's title in the database
    card = await prisma.card.update({
      where: { id, list: { board: { orgId } } },
      data: { ...values },
    });

    // Create an audit log for the card update
    await createAuditLog({
      entityTitle: card.title,
      entityId: card.id,
      entityType: ENTITY_TYPE.CARD,
      action: ACTION.UPDATE,
    });
  } catch (error) {
    // Return an error if the update operation fails
    return {
      error: "Failed to update",
    };
  }

  // Revalidate the cache for the updated board
  revalidatePath(`/board/${boardId}`);
  return { data: card };
});
