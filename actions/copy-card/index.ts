"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";
import { createSafeAction } from "@/lib/create-safe-action";
import { prisma } from "@/lib/db";
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
    const cardToCopy = await prisma.card.findUnique({
      where: {
        id,
        list: { board: { orgId } },
      },
    });
    if (!cardToCopy) return { error: "Card not found" };

    const lastCard = await prisma.card.findFirst({
      where: { listId: cardToCopy.listId },
      orderBy: { position: "desc" },
      select: { position: true },
    });
    const newPosition = lastCard ? lastCard.position + 1 : 1;

    card = await prisma.card.create({
      data: {
        title: `${cardToCopy.title} - Copy`,
        description: cardToCopy.description,
        position: newPosition,
        listId: cardToCopy.listId,
      },
    });
  } catch (error) {
    return {
      error: "Failed to copy",
    };
  }

  revalidatePath(`/board/${boardId}`);
  return { data: card };
});
