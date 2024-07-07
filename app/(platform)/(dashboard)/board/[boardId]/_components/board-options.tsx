"use client";

import { MoreHorizontalIcon, XIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import useAction from "@/hooks/useAction";
import { deleteBoard } from "@/actions/delete-board";

interface BoardOptionsProps {
  id: string;
}

export function BoardOptions({ id }: BoardOptionsProps) {
  const { execute, isLoading } = useAction(deleteBoard, {
    onError: (error) => {
      toast.error(error);
    },
  });

  const onDelete = async () => {
    await execute({ id });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="h-auto w-auto p-2" variant="transparent">
          <MoreHorizontalIcon className="size-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="px-0 pb-3 pt-3" side="bottom" align="start">
        <div className="pb-4 text-center text-sm font-medium text-neutral-600">Board Actions</div>
        <PopoverClose asChild>
          <Button className="absolute right-2 top-2 h-auto w-auto p-2 text-neutral-600" variant="ghost">
            <XIcon className="size-4" />
          </Button>
        </PopoverClose>
        <Button
          variant="ghost"
          disabled={isLoading}
          onClick={onDelete}
          className="h-auto w-full justify-start rounded-none p-2 px-5 text-sm font-normal"
        >
          Delete this board
        </Button>
      </PopoverContent>
    </Popover>
  );
}
