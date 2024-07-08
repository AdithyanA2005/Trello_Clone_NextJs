"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";
import { createSafeAction } from "@/lib/create-safe-action";
import { prisma } from "@/lib/db";
import { UpdateListOrder } from "./schema";
import { InputType, ReturnType } from "./types";

/**
 * Updates the order of lists within a board.
 *
 * This server-side function first authenticates the user and checks their authorization. It then updates the position
 * of each list within a board based on the provided order. After successfully updating the list positions, it revalidates
 * the cache for the board to ensure the frontend reflects the updated order. If the user is not authenticated or if any
 * part of the update process fails, an error is returned.
 *
 * @param {InputType} data - The input data for updating the list order, including the new positions of the lists and the boardId.
 * @returns {Promise<ReturnType>} - The result of the update operation. Returns the updated list data on success or an error message on failure.
 */
export const updateListOrder = createSafeAction(UpdateListOrder, async (data: InputType): Promise<ReturnType> => {
  // Check if the user is authenticated
  const { userId, orgId } = auth();
  if (!userId || !orgId) {
    // Return an error if the user is not authenticated
    return {
      error: "Unauthorized",
    };
  }

  const { items, boardId } = data;
  let lists;

  try {
    // Perform the update operation within a transaction to ensure atomicity
    const transaction = items.map((list) =>
      prisma.list.update({
        where: {
          id: list.id,
          boardId,
          board: { orgId },
        },
        data: {
          position: list.position,
        },
      }),
    );
    lists = await prisma.$transaction(transaction);
  } catch (error) {
    return {
      error: "Failed to create",
    };
  }

  // Revalidate the cache for the updated board
  revalidatePath(`/board/${boardId}`);
  return { data: lists };
});
