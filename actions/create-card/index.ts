"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";
import { createSafeAction } from "@/lib/create-safe-action";
import { prisma } from "@/lib/db";
import { CreateCard } from "./schema";
import { InputType, ReturnType } from "./types";

/**
 * Creates a new card in a specified list and board.
 *
 * This server-side function first authenticates the user and checks their authorization. It then proceeds to create a new card
 * within a specified list and board, assigning it the next available position. Upon successful creation, the cache for the board
 * is revalidated to ensure the frontend reflects the new card. If the user is not authenticated, the specified list is not found,
 * or the creation fails, an error is returned.
 *
 * @param {InputType} data - The input data for creating a card, including the card's title, listId, and boardId.
 * @returns {Promise<ReturnType>} - The result of the create operation. Returns the created card data on success or an error message on failure.
 */
export const createCard = createSafeAction(CreateCard, async (data: InputType): Promise<ReturnType> => {
  // Check if the user is authenticated
  const { userId, orgId } = auth();
  if (!userId || !orgId) {
    // Return an error if the user is not authenticated
    return {
      error: "Unauthorized",
    };
  }

  const { title, listId, boardId } = data;
  let card;

  try {
    // Verify the specified list exists within the given board and organization
    const list = await prisma.list.findUnique({
      where: {
        id: listId,
        boardId: boardId,
        board: { orgId },
      },
    });
    if (!list) return { error: "List not found" };

    // Determine the position for the new card
    const lastCard = await prisma.card.findFirst({
      where: { listId },
      orderBy: { position: "desc" },
      select: { position: true },
    });
    const newPosition = lastCard ? lastCard.position + 1 : 1;

    // Create the new card
    card = await prisma.card.create({
      data: {
        title,
        listId,
        position: newPosition,
      },
    });
  } catch (error) {
    return {
      error: "Failed to create",
    };
  }

  // Revalidate the cache for the updated board
  revalidatePath(`/board/${boardId}`);
  return { data: card };
});
