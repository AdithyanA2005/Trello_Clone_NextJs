"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";
import { ACTION, ENTITY_TYPE } from "@prisma/client";
import { CreateBoardSchema } from "@/actions/create-board/schema";
import { createAuditLog } from "@/lib/create-audit-log";
import { createSafeAction } from "@/lib/create-safe-action";
import { prisma } from "@/lib/db";
import { InputType, ReturnType } from "./types";

/**
 * Handles the creation of a new board. It validates the input data against the `CreateBoardSchema`,
 * checks for user authentication, and attempts to create a new board in the database.
 * If successful, it triggers a revalidation of the board's path to update the cache.
 *
 * @param {InputType} data - The input data for creating a board, validated against `CreateBoardSchema`.
 * @returns {Promise<ReturnType>} - The result of the board creation process, including any errors or the created board data.
 */
export const createBoard = createSafeAction(CreateBoardSchema, async (data: InputType): Promise<ReturnType> => {
  // Check if the user is authenticated
  const { userId, orgId } = auth();
  if (!userId || !orgId) {
    // Return an error if the user is not authenticated
    return {
      error: "Unauthorized",
    };
  }

  const { title, image } = data;

  // Data's for image is given as a string, each data seperated by "|"
  const [imageId, imageThumbUrl, imageFullUrl, imageLinkHTML, imageUserName] = image.split("|");
  if (!imageId || !imageThumbUrl || !imageFullUrl || !imageLinkHTML || !imageUserName) {
    return {
      error: "Missing fields. Failed to create board",
    };
  }

  let board;

  try {
    // Attempt to create a new board in the database
    board = await prisma.board.create({
      data: { title, orgId, imageId, imageThumbUrl, imageFullUrl, imageLinkHTML, imageUserName },
    });

    await createAuditLog({
      entityTitle: board.title,
      entityId: board.id,
      entityType: ENTITY_TYPE.BOARD,
      action: ACTION.CREATE,
    });
  } catch (error) {
    // Return an error if the board creation fails
    return {
      error: "Failed to create board. Internal server error",
    };
  }

  revalidatePath(`/board/${board.id}`); // Trigger a revalidation of the board's path to update the cache
  return { data: board };
});
