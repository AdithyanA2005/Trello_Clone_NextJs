"use client";

import { useRef } from "react";
import { List } from "@prisma/client";
import { MoreHorizontalIcon, XIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { FormSubmit } from "@/components/form/form-submit";
import useAction from "@/hooks/useAction";
import { copyList } from "@/actions/copy-list";
import { deleteList } from "@/actions/delete-list";

interface ListOptionsProps {
  list: List;
}

export function ListOptions({ list }: ListOptionsProps) {
  const closeRef = useRef<HTMLButtonElement>(null);

  const { execute: executeDelete } = useAction(deleteList, {
    onSuccess: (data) => {
      toast.success(`List "${data.title}" deleted`);
      closeRef.current?.click();
    },
    onError: (error) => {
      toast.error(error);
    },
  });
  const { execute: executeCopy } = useAction(copyList, {
    onSuccess: (data) => {
      toast.success(`List "${data.title}" copied`);
      closeRef.current?.click();
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const onDelete = async (formData: FormData) => {
    const id = formData.get("id") as string;
    const boardId = formData.get("boardId") as string;
    await executeDelete({ id, boardId });
  };
  const onCopy = async (formData: FormData) => {
    const id = formData.get("id") as string;
    const boardId = formData.get("boardId") as string;
    await executeCopy({ id, boardId });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="h-auto w-auto p-1.5" variant="ghost">
          <MoreHorizontalIcon className="size-4" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="px-0 py-3" side="bottom" align="start">
        <h3 className="pb-4 text-center text-sm font-medium text-neutral-600">List actions</h3>

        <PopoverClose ref={closeRef} asChild>
          <Button className="absolute right-2 top-2 h-auto w-auto p-2 text-neutral-600" variant="ghost">
            <XIcon className="size-4" />
          </Button>
        </PopoverClose>

        <form action={onCopy}>
          <input hidden readOnly id="id" name="id" value={list.id} />
          <input hidden readOnly id="boardId" name="boardId" value={list.boardId} />
          <FormSubmit variant="ghost" className="h-auto w-full justify-start rounded-none p-2 px-5 text-sm font-normal">
            Copy list
          </FormSubmit>
        </form>

        <Separator />

        <form action={onDelete}>
          <input hidden readOnly id="id" name="id" value={list.id} />
          <input hidden readOnly id="boardId" name="boardId" value={list.boardId} />
          <FormSubmit variant="ghost" className="h-auto w-full justify-start rounded-none p-2 px-5 text-sm font-normal">
            Delete list
          </FormSubmit>
        </form>
      </PopoverContent>
    </Popover>
  );
}
