"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";
import { ACTION, ENTITY_TYPE } from "@prisma/client";
import { createAuditLog } from "@/lib/create-audit-log";
import { createSafeAction } from "@/lib/create-safe-action";
import { prisma } from "@/lib/database/prisma";
import { UpdateBoard } from "./schema";
import { InputType, ReturnType } from "./types";

/**
 * Updates the title of a board in the database for the given board
 * This function is secured by checking the user's authentication status before proceeding with the update operation.
 * Upon successful update, it triggers a cache revalidation for the updated board to ensure data consistency across the application.
 *
 * @param {InputType} data - The input data for the update operation, including the board's `title` and `id`.
 * @returns {Promise<ReturnType>} - A promise that resolves to the operation's result, either containing the updated board data or an error message.
 */
export const updateBoard = createSafeAction(UpdateBoard, async (data: InputType): Promise<ReturnType> => {
  // Check if the user is authenticated
  const { userId, orgId } = auth();
  if (!userId || !orgId) {
    // Return an error if the user is not authenticated
    return {
      error: "Unauthorized",
    };
  }

  const { title, id } = data;
  let board;

  try {
    // Attempt to update the board's title in the database
    board = await prisma.board.update({
      where: { id, orgId },
      data: { title },
    });

    // Create an audit log for the board update
    await createAuditLog({
      entityTitle: board.title,
      entityId: board.id,
      entityType: ENTITY_TYPE.BOARD,
      action: ACTION.UPDATE,
    });
  } catch (error) {
    // Return an error if the update operation fails
    return {
      error: "Failed to update",
    };
  }

  // Revalidate the cache for the updated board
  revalidatePath(`/board/${board.id}`);
  return { data: board };
});
