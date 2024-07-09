import { z } from "zod";

export const CreateBoardSchema = z.object({
  title: z
    .string({
      required_error: "Title is required",
      invalid_type_error: "Title is required",
    })
    .min(1, {
      message: "Title must be at least 1 characters long",
    }),
  image: z.string({
    required_error: "Image is required",
    invalid_type_error: "Image is required",
  }),
});
