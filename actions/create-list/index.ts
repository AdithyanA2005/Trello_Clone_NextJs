"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";
import { ACTION, ENTITY_TYPE } from "@prisma/client";
import { createSafeAction } from "@/lib/create-safe-action";
import { createAuditLog } from "@/lib/database/helpers/audit-log";
import { prisma } from "@/lib/database/prisma";
import { CreateList } from "./schema";
import { InputType, ReturnType } from "./types";

/**
 * Creates a new list within a board.
 *
 * This function checks if the user is authenticated and authorized to create a list within the specified board.
 * It then calculates the position for the new list based on the last list's position within the same board.
 * Finally, it creates the list and revalidates the cache for the board to reflect the new list.
 *
 * @param {InputType} data - The input data for creating a list, including the title and boardId.
 * @returns {Promise<ReturnType>} - The result of the list creation operation. Returns the created list data on success or an error message on failure.
 */
export const createList = createSafeAction(CreateList, async (data: InputType): Promise<ReturnType> => {
  // Check if the user is authenticated
  const { userId, orgId } = auth();
  if (!userId || !orgId) {
    // Return an error if the user is not authenticated
    return {
      error: "Unauthorized",
    };
  }

  const { title, boardId } = data;
  let list;

  try {
    // Check if the specified board exists and is accessible by the user
    const board = await prisma.board.findUnique({
      where: {
        id: boardId,
        orgId,
      },
    });
    if (!board) return { error: "Board not found" };

    // Determine the position for the new list
    const lastList = await prisma.list.findFirst({
      where: { boardId },
      orderBy: { position: "desc" },
      select: { position: true },
    });
    const newPosition = lastList ? lastList.position + 1 : 1;

    // Create the new list
    list = await prisma.list.create({
      data: {
        title,
        boardId,
        position: newPosition,
      },
    });

    // Create an audit log for the list creation
    await createAuditLog({
      entityTitle: list.title,
      entityId: list.id,
      entityType: ENTITY_TYPE.LIST,
      action: ACTION.CREATE,
    });
  } catch (error) {
    return {
      error: "Failed to create",
    };
  }

  // Revalidate the cache for the updated board
  revalidatePath(`/board/${boardId}`);
  return { data: list };
});
