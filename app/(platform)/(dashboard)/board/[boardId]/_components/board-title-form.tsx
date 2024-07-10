"use client";

import { useRef, useState } from "react";
import { Board } from "@prisma/client";
import { toast } from "sonner";
import { useEventListener } from "usehooks-ts";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/form/form-input";
import useAction from "@/hooks/useAction";
import { updateBoard } from "@/actions/update-board";

interface BoardTitleFormProps {
  board: Board;
}

/**
 * `BoardTitleForm` allows editing the title of a board. It provides an input for the title and handles the update operation.
 *
 * Props:
 * - `board`: The board object to edit.
 *
 * The component toggles between display and edit mode. In edit mode, it focuses and selects the input's content for easy editing.
 * Submitting the form or blurring the input triggers the update operation. Success or error feedback is provided via toast notifications.
 */
export function BoardTitleForm({ board }: BoardTitleFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState(board.title);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const disableEditing = () => setIsEditing(false);
  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    });
  };

  const { execute } = useAction(updateBoard, {
    onSuccess: (data) => {
      toast.success(`Board "${data.title}" updated`);
      setTitle(data.title);
      disableEditing();
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const onSubmit = async (formData: FormData) => {
    const title = formData.get("title") as string;
    if (board.title == title) return disableEditing();

    await execute({
      title,
      id: board.id,
    });
  };

  const onBlur = () => {
    formRef.current?.requestSubmit();
  };

  // Disable editing by pressing `esc`
  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") disableEditing();
  };
  useEventListener("keydown", onKeyDown);

  if (isEditing) {
    return (
      <form action={onSubmit} ref={formRef} className="flex items-center gap-x-2">
        <FormInput
          ref={inputRef}
          id="title"
          onBlur={onBlur}
          defaultValue={title}
          className="h-7 border-none bg-transparent px-[8px] py-1 text-lg font-bold focus-visible:outline-none focus-visible:ring-transparent"
        />
      </form>
    );
  }

  return (
    <Button
      variant="transparent"
      className="h-auto w-auto cursor-pointer p-1 px-2 text-lg font-bold"
      onClick={enableEditing}
      asChild
    >
      <h2>{title}</h2>
    </Button>
  );
}
