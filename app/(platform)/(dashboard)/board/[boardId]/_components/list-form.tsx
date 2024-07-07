"use client";

import { useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { PlusIcon, XIcon } from "lucide-react";
import { toast } from "sonner";
import { useEventListener, useOnClickOutside } from "usehooks-ts";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/form/form-input";
import { FormSubmit } from "@/components/form/form-submit";
import useAction from "@/hooks/useAction";
import { createList } from "@/actions/create-list";
import { ListWrapper } from "./list-wrapper";

export function ListForm() {
  const router = useRouter();
  const params: { boardId: string } = useParams();

  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [isEditing, seIsEditing] = useState<boolean>(false);
  const disableEditing = () => seIsEditing(false);
  const enableEditing = () => {
    seIsEditing(true);
    setTimeout(() => inputRef.current?.focus());
  };

  const { execute, fieldErrors } = useAction(createList, {
    onSuccess: (data) => {
      toast.success(`List "${data.title}" created`);
      disableEditing();
      router.refresh();
    },
    onError: (error) => {
      toast.error;
    },
  });

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") disableEditing();
  };
  useEventListener("keydown", onKeyDown);
  useOnClickOutside(formRef, disableEditing);

  const onSubmit = async (formData: FormData) => {
    const title = formData.get("title") as string;
    const boardId = formData.get("boardId") as string;
    await execute({ title, boardId });
  };

  if (isEditing) {
    return (
      <ListWrapper>
        <form ref={formRef} action={onSubmit} className="w-full space-y-2 rounded-md bg-white p-2 shadow-md">
          <FormInput
            ref={inputRef}
            errors={fieldErrors}
            id="title"
            placeholder="Enter list title..."
            className="h-9 border-transparent text-sm font-medium transition hover:border-input focus:border-input"
          />

          <input hidden readOnly value={params.boardId} name="boardId" />

          <div className="flex items-center gap-x-1">
            <FormSubmit>Add List</FormSubmit>
            <Button onClick={disableEditing} size="sm" variant="ghost">
              <XIcon className="size-5" />
            </Button>
          </div>
        </form>
      </ListWrapper>
    );
  }

  return (
    <ListWrapper>
      <button
        onClick={enableEditing}
        className="flex w-full items-center rounded-md bg-white/80 p-3 text-sm font-medium transition hover:bg-white/50"
      >
        <PlusIcon className="mr-2 size-4" />
        Add a list
      </button>
    </ListWrapper>
  );
}
