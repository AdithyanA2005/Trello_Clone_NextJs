"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";
import { ACTION, ENTITY_TYPE } from "@prisma/client";
import { createAuditLog } from "@/lib/create-audit-log";
import { createSafeAction } from "@/lib/create-safe-action";
import { prisma } from "@/lib/database/prisma";
import { UpdateList } from "./schema";
import { InputType, ReturnType } from "./types";

/**
 * Updates an existing list's title within a board.
 *
 * This function first checks if the user is authenticated and authorized to update the list within the specified board.
 * If the user is authenticated, it proceeds to update the list's title based on the provided data.
 * After successfully updating the list, it revalidates the cache for the board to ensure the changes are reflected.
 *
 * @param {InputType} data - The input data for updating the list, including the list's title, id, and boardId.
 * @returns {Promise<ReturnType>} - The result of the list update operation. Returns the updated list data on success or an error message on failure.
 */
export const updateList = createSafeAction(UpdateList, async (data: InputType): Promise<ReturnType> => {
  // Check if the user is authenticated
  const { userId, orgId } = auth();
  if (!userId || !orgId) {
    // Return an error if the user is not authenticated
    return {
      error: "Unauthorized",
    };
  }

  const { title, id, boardId } = data;
  let list;

  try {
    // Attempt to update the list with the new title
    list = await prisma.list.update({
      where: {
        id,
        boardId,
        board: { orgId },
      },
      data: { title },
    });

    // Create an audit log for the list update
    await createAuditLog({
      entityTitle: list.title,
      entityId: list.id,
      entityType: ENTITY_TYPE.LIST,
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
  return { data: list };
});
