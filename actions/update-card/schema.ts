import { z } from "zod";

export const UpdateCard = z.object({
  title: z.optional(
    z
      .string({
        required_error: "Title is required",
        invalid_type_error: "Title is required",
      })
      .min(1, {
        message: "Title must be at least 1 characters long",
      }),
  ),
  description: z.optional(
    z.string({
      required_error: "Description is required",
      invalid_type_error: "Description is required",
    }),
  ),
  boardId: z.string(),
  id: z.string(),
});
