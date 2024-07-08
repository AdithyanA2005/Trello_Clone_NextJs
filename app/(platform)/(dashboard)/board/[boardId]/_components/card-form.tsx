"use client";

import { forwardRef, KeyboardEventHandler, useRef } from "react";
import { useParams } from "next/navigation";
import { PlusIcon, XIcon } from "lucide-react";
import { toast } from "sonner";
import { useEventListener, useOnClickOutside } from "usehooks-ts";
import { Button } from "@/components/ui/button";
import { FormSubmit } from "@/components/form/form-submit";
import { FormTextarea } from "@/components/form/form-textarea";
import useAction from "@/hooks/useAction";
import { createCard } from "@/actions/create-card";

interface CardFormProps {
  listId: string;
  isEditing: boolean;
  enableEditing: () => void;
  disableEditing: () => void;
}

export const CardForm = forwardRef<HTMLTextAreaElement, CardFormProps>(
  ({ listId, isEditing, enableEditing, disableEditing }, ref) => {
    const params: { boardId: string } = useParams();
    const formRef = useRef<HTMLFormElement>(null);

    const { execute, fieldErrors } = useAction(createCard, {
      onSuccess: (data) => {
        toast.success(`Card "${data.title}" created`);
        formRef.current?.reset();
      },
      onError: (error) => {
        toast.error(error);
      },
    });

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") disableEditing();
    };
    useEventListener("keydown", onKeyDown);
    useOnClickOutside(formRef, disableEditing);

    const onTextAreaKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        formRef.current?.requestSubmit();
      }
    };
    const onSubmit = async (formData: FormData) => {
      const title = formData.get("title") as string;
      const listId = formData.get("listId") as string;
      const boardId = params.boardId;
      await execute({ title, listId, boardId });
    };

    if (isEditing) {
      return (
        <form ref={formRef} action={onSubmit} className="m-1 my-0.5 space-y-4 px-1">
          <FormTextarea
            id="title"
            ref={ref}
            onKeyDown={onTextAreaKeyDown}
            errors={fieldErrors}
            placeholder="Enter a title for this card..."
          />
          <input hidden readOnly id="listId" name="listId" value={listId} />
          <div className="flex items-center gap-x-1">
            <FormSubmit>Add Card</FormSubmit>
            <Button onClick={disableEditing} size="sm" variant="ghost">
              <XIcon className="size-5" />
            </Button>
          </div>
        </form>
      );
    }

    return (
      <div className="px-2 pt-2">
        <Button
          size="sm"
          variant="ghost"
          onClick={enableEditing}
          className="h-auto w-full justify-start px-2 py-1.5 text-sm text-muted-foreground"
        >
          <PlusIcon className="mr-2 size-4" />
          Add a card
        </Button>
      </div>
    );
  },
);

CardForm.displayName = "CardForm";
