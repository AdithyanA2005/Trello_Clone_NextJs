"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";
import { ACTION, ENTITY_TYPE } from "@prisma/client";
import { createAuditLog } from "@/lib/database/helpers/audit-log";
import { prisma } from "@/lib/database/prisma";
import { createSafeAction } from "@/lib/helpers/create-safe-action";
import { CopyCard } from "./schema";
import { InputType, ReturnType } from "./types";

/**
 * Copies a card within a list on a board, including its title and description, and assigns it a new position.
 *
 * This server-side function first authenticates the user and checks their authorization. It then proceeds to copy a card
 * within a specified list on a board, assigning it the next available position. Upon successful copy, the cache for the board
 * is revalidated to ensure the frontend reflects the new card. If the user is not authenticated, the specified card is not found,
 * or the copy operation fails, an error is returned.
 *
 * @param {InputType} data - The input data for copying the card, including the card's id and the boardId it belongs to.
 * @returns {Promise<ReturnType>} - The result of the copy operation. Returns the copied card data on success or an error message on failure.
 */
export const copyCard = createSafeAction(CopyCard, async (data: InputType): Promise<ReturnType> => {
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
    // Find the card to copy
    const cardToCopy = await prisma.card.findUnique({
      where: {
        id,
        list: { board: { orgId } },
      },
    });
    if (!cardToCopy) return { error: "Card not found" };

    // Find the last card in the list and assign the new card the next available position
    const lastCard = await prisma.card.findFirst({
      where: { listId: cardToCopy.listId },
      orderBy: { position: "desc" },
      select: { position: true },
    });
    const newPosition = lastCard ? lastCard.position + 1 : 1;

    // Create a new card with the copied card's title and description
    card = await prisma.card.create({
      data: {
        title: `${cardToCopy.title} - Copy`,
        description: cardToCopy.description,
        position: newPosition,
        listId: cardToCopy.listId,
      },
    });

    // Create an audit log for the create(copy) operation
    await createAuditLog({
      entityTitle: card.title,
      entityId: card.id,
      entityType: ENTITY_TYPE.CARD,
      action: ACTION.CREATE,
    });
  } catch (error) {
    return {
      error: "Failed to copy",
    };
  }

  // Revalidate the cache for the updated board
  revalidatePath(`/board/${boardId}`);
  return { data: card };
});
