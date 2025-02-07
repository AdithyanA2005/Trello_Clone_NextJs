import { Board } from "@prisma/client";
import { z } from "zod";
import { ActionState } from "@/lib/helpers/create-safe-action";
import { CreateBoardSchema } from "./schema";

export type InputType = z.infer<typeof CreateBoardSchema>;
export type ReturnType = ActionState<InputType, Board>;
