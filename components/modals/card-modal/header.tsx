"use client";

import { useRef, useState } from "react";
import { useParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { LayoutIcon } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { FormInput } from "@/components/form/form-input";
import useAction from "@/hooks/useAction";
import { updateCard } from "@/actions/update-card";
import { CardWithList } from "@/types";

interface HeaderProps {
  data: CardWithList;
}

export function Header({ data }: HeaderProps) {
  const queryClient = useQueryClient();
  const params: { boardId: string } = useParams();

  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState<string>(data.title);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const disableEditing = () => setIsEditing(false);
  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    });
  };

  const { execute } = useAction(updateCard, {
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({
        queryKey: ["card", data.id],
      });
      await queryClient.invalidateQueries({
        queryKey: ["card-logs", data.id],
      });
      toast.success(`Renamed to "${data.title}"`);
      setTitle(data.title);
      disableEditing();
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const onBlur = () => {
    formRef.current?.requestSubmit();
  };
  const onSubmit = async (formData: FormData) => {
    const title = formData.get("title") as string;
    const boardId = params.boardId;
    if (title === data.title) return disableEditing();

    await execute({
      id: data.id,
      boardId,
      title,
    });
  };

  return (
    <div className="mb-6 flex w-full items-start gap-x-2">
      <LayoutIcon className="mt-1.5 size-5 text-neutral-700" />

      <div className="relative w-full">
        {isEditing ? (
          <form action={onSubmit} ref={formRef}>
            <FormInput
              ref={inputRef}
              onBlur={onBlur}
              id="title"
              defaultValue={title}
              className="mb-0.5 flex h-8 w-[95%] items-center truncate border-transparent bg-transparent px-1 text-xl font-semibold leading-8 text-neutral-900 focus-visible:border-input focus-visible:bg-white"
            />
          </form>
        ) : (
          <h2
            className="mb-0.5 flex h-8 w-[95%] cursor-pointer items-center truncate px-[5px] text-xl font-semibold leading-8 text-neutral-900"
            onClick={enableEditing}
          >
            {title}
          </h2>
        )}
        <p className="px-1 text-sm text-muted-foreground">
          in list&nbsp;
          <span className="underline">{data.list.title}</span>
        </p>
      </div>
    </div>
  );
}

Header.Skeleton = function HeaderSkeleton() {
  return (
    <div className="mb-6 flex items-start gap-x-3">
      <Skeleton className="mt-1 h-6 w-6 bg-neutral-200" />
      <div>
        <Skeleton className="mb-1 h-6 w-24 bg-neutral-200" />
        <Skeleton className="mb-1 h-4 w-12 bg-neutral-200" />
      </div>
    </div>
  );
};
