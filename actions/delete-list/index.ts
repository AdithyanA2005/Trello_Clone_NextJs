"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";
import { createSafeAction } from "@/lib/create-safe-action";
import { prisma } from "@/lib/db";
import { DeleteList } from "./schema";
import { InputType, ReturnType } from "./types";

/**
 * Deletes a list from a board.
 *
 * This server-side function authenticates the user and checks their authorization before proceeding to delete a list.
 * It uses the `DeleteList` schema for validation of the input data. Upon successful deletion, it revalidates the cache
 * for the board to ensure the frontend reflects the change. If the user is not authenticated or the deletion fails,
 * an error is returned.
 *
 * @param {InputType} data - The input data for deleting a list, including the list's id and the boardId it belongs to.
 * @returns {Promise<ReturnType>} - The result of the delete operation. Returns the deleted list data on success or an error message on failure.
 */
export const deleteList = createSafeAction(DeleteList, async (data: InputType): Promise<ReturnType> => {
  // Check if the user is authenticated
  const { userId, orgId } = auth();
  if (!userId || !orgId) {
    // Return an error if the user is not authenticated
    return {
      error: "Unauthorized",
    };
  }

  const { id, boardId } = data;
  let list;

  try {
    list = await prisma.list.delete({
      where: {
        id,
        boardId,
        board: { orgId },
      },
    });
  } catch (error) {
    return {
      error: "Failed to delete",
    };
  }

  revalidatePath(`/board/${boardId}`);
  return { data: list };
});
