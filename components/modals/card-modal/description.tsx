"use client";

import { useRef, useState } from "react";
import { useParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { AlignLeftIcon } from "lucide-react";
import { toast } from "sonner";
import { useOnClickOutside } from "usehooks-ts";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { FormSubmit } from "@/components/form/form-submit";
import { FormTextarea } from "@/components/form/form-textarea";
import useAction from "@/hooks/useAction";
import { updateCard } from "@/actions/update-card";
import { CardWithList } from "@/types";

interface DescriptionProps {
  data: CardWithList;
}

export function Description({ data }: DescriptionProps) {
  const queryClient = useQueryClient();
  const params: { boardId: string } = useParams();

  const [description, setDescription] = useState<string | null>(data.description);
  const [isEditing, setIsEditing] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const disableEditing = () => setIsEditing(false);
  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => textAreaRef.current?.focus(), 0);
  };

  const { execute, fieldErrors } = useAction(updateCard, {
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({
        queryKey: ["card", data.id],
      });
      toast.success(`Card "${data.title}" updated`);
      setDescription(data.description);
      disableEditing();
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  useOnClickOutside(formRef, disableEditing);

  const onSubmit = async (formData: FormData) => {
    const description = formData.get("description") as string;
    const boardId = params.boardId;
    if (description === data.description) return disableEditing();

    await execute({
      id: data.id,
      boardId,
      description,
    });
  };

  return (
    <div className="flex w-full items-start gap-x-3">
      <AlignLeftIcon className="mt-0.5 size-5 text-neutral-700" />

      <div className="w-full">
        <h3 className="mb-2 font-semibold text-neutral-800">Description</h3>

        {isEditing ? (
          <form ref={formRef} action={onSubmit} className="space-y-2">
            <FormTextarea
              id="description"
              ref={textAreaRef}
              errors={fieldErrors}
              className="mt-2 w-full"
              placeholder="Add a detailed description..."
              defaultValue={description || undefined}
            />
            <div className="flex items-center gap-x-2">
              <FormSubmit>Save</FormSubmit>
              <Button type="button" onClick={disableEditing} size="sm" variant="ghost">
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <div
            role="button"
            onClick={enableEditing}
            className="min-h-[78px] rounded-md bg-neutral-100 px-3.5 py-3 text-sm font-medium"
          >
            {description || "Add a detailed description..."}
          </div>
        )}
      </div>
    </div>
  );
}

Description.Skeleton = function DescriptionSkeleton() {
  return (
    <div className="flex w-full items-start gap-x-3">
      <Skeleton className="h-6 w-6 bg-neutral-200" />
      <div className="w-full">
        <Skeleton className="mb-2 h-6 w-24 bg-neutral-200" />
        <Skeleton className="h-[78px] w-full bg-neutral-200" />
      </div>
    </div>
  );
};
