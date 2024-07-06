"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { XIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { FormInput } from "@/components/form/form-input";
import { FormSubmit } from "@/components/form/form-submit";
import { NewBoardImagePicker } from "@/components/new-board-form-popover/new-board-image-picker";
import useAction from "@/hooks/useAction";
import { createBoard } from "@/actions/create-board";

interface FormPopoverProps {
  children: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  sideOffset?: number;
}
export function NewBoardFormPopover({ children, sideOffset = 0, side = "bottom", align }: FormPopoverProps) {
  const router = useRouter();
  const closeRef = useRef<HTMLButtonElement>(null);

  const { execute, fieldErrors } = useAction(createBoard, {
    onSuccess: (data) => {
      toast.success("Board created!");
      closeRef.current?.click();
      router.push(`/board/${data.id}`);
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const onSubmit = async (formData: FormData) => {
    const title = formData.get("title") as string;
    const image = formData.get("image") as string;
    console.log({ image });

    await execute({ title, image });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent align={align} className="w-80 pt-3" side={side} sideOffset={sideOffset}>
        <div className="pb-4 text-center text-sm font-medium text-neutral-600"> Create Board</div>
        <PopoverClose ref={closeRef} asChild>
          <Button className="absolute right-2 top-2 h-auto w-auto p-2 text-neutral-600" variant="ghost">
            <XIcon className="size-4" />
          </Button>
        </PopoverClose>

        <form action={onSubmit} className="space-y-4">
          <div className="space-y-4">
            <NewBoardImagePicker id="image" errors={fieldErrors} />
            <FormInput
              id="title"
              label="Board Title"
              placeholder="Enter board title"
              type="text"
              errors={fieldErrors}
            />
          </div>

          <FormSubmit className="w-full">Create </FormSubmit>
        </form>
      </PopoverContent>
    </Popover>
  );
}
