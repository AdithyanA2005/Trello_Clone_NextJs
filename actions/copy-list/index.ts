"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";
import { ACTION, ENTITY_TYPE } from "@prisma/client";
import { createAuditLog } from "@/lib/database/helpers/audit-log";
import { prisma } from "@/lib/database/prisma";
import { createSafeAction } from "@/lib/helpers/create-safe-action";
import { CopyList } from "./schema";
import { InputType, ReturnType } from "./types";

/**
 * Copies a list within a board, including all its cards, and assigns it a new position.
 *
 * This function authenticates the user and checks their authorization before proceeding to copy a list.
 * It finds the list to be copied and creates a new list with "- Copy" appended to the original title and
 * positions it at the end of all lists within the board. All cards within the original list are also copied
 * to the new list. Upon successful copy, it revalidates the cache for the board to ensure the frontend reflects
 * the change. If the user is not authenticated, the list is not found, or the copy operation fails, an error is returned.
 *
 * @param {InputType} data - The input data for copying the list, including the list's id and the boardId it belongs to.
 * @returns {Promise<ReturnType>} - The result of the copy operation. Returns the copied list data on success or an error message on failure.
 */
export const copyList = createSafeAction(CopyList, async (data: InputType): Promise<ReturnType> => {
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
    // Find the list to copy
    const listToCopy = await prisma.list.findUnique({
      where: {
        id,
        boardId,
        board: { orgId },
      },
      include: {
        cards: true,
      },
    });
    if (!listToCopy) return { error: "List not found" };

    // Find the last list in the board and assign the new list the next available position
    const lastList = await prisma.list.findFirst({
      where: { boardId },
      orderBy: { position: "desc" },
      select: { position: true },
    });
    const newPosition = lastList ? lastList.position + 1 : 1;

    // Create a new list with the copied list's title and all its cards
    list = await prisma.list.create({
      data: {
        boardId: listToCopy.boardId,
        title: `${listToCopy.title} - Copy`,
        position: newPosition,
        cards: {
          // When data is empty create many will cause error
          // So only try to createMany if there are cards to copy
          ...(listToCopy.cards.length > 0
            ? {
                createMany: {
                  data: listToCopy.cards.map((card) => ({
                    title: card.title,
                    description: card.description,
                    position: card.position,
                  })),
                },
              }
            : {}),
        },
      },
      include: {
        cards: true,
      },
    });

    // Create an audit log for the new create(copy) operation
    await createAuditLog({
      entityTitle: list.title,
      entityId: list.id,
      entityType: ENTITY_TYPE.LIST,
      action: ACTION.CREATE,
    });
  } catch (error) {
    console.clear();
    console.log(error);
    return {
      error: "Failed to copy",
    };
  }

  // Revalidate the cache for the updated board
  revalidatePath(`/board/${boardId}`);
  return { data: list };
});
