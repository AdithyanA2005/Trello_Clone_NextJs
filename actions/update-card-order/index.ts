"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";
import { createSafeAction } from "@/lib/create-safe-action";
import { prisma } from "@/lib/database/prisma";
import { UpdateCardOrder } from "./schema";
import { InputType, ReturnType } from "./types";

/**
 * Updates the order of cards within a list on a board.
 *
 * This server-side function authenticates the user and checks their authorization before proceeding to update the order of cards.
 * It performs the update operation within a transaction to ensure atomicity, meaning either all updates succeed or none, maintaining
 * data integrity. Upon successful update, the cache for the board is revalidated to ensure the frontend reflects the new order of cards.
 * If the user is not authenticated or if any part of the update process fails, an error is returned.
 *
 * @param {InputType} data - The input data for updating the card order, including the new positions of the cards, their listId, and the boardId.
 * @returns {Promise<ReturnType>} - The result of the update operation. Returns the updated card data on success or an error message on failure.
 */
export const updateCardOrder = createSafeAction(UpdateCardOrder, async (data: InputType): Promise<ReturnType> => {
  // Check if the user is authenticated
  const { userId, orgId } = auth();
  if (!userId || !orgId) {
    // Return an error if the user is not authenticated
    return {
      error: "Unauthorized",
    };
  }

  const { items, boardId } = data;
  let cards;

  try {
    // Create a transaction to update the order of cards atomically
    const transaction = items.map((card) =>
      prisma.card.update({
        where: {
          id: card.id,
          list: { board: { orgId } },
        },
        data: {
          listId: card.listId,
          position: card.position,
        },
      }),
    );
    cards = await prisma.$transaction(transaction);
  } catch (error) {
    return {
      error: "Failed to create",
    };
  }

  // Revalidate the cache for the updated board
  revalidatePath(`/board/${boardId}`);
  return { data: cards };
});
