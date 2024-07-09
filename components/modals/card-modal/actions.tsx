"use client";

import { useParams } from "next/navigation";
import { CopyIcon, TrashIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import useAction from "@/hooks/useAction";
import { useCardModal } from "@/hooks/useCardModal";
import { copyCard } from "@/actions/copy-card";
import { deleteCard } from "@/actions/delete-card";
import { CardWithList } from "@/types";

interface ActionsProps {
  data: CardWithList;
}

export function Actions({ data }: ActionsProps) {
  const params: { boardId: string } = useParams();
  const cardModal = useCardModal();

  const { execute: executeCopyCard, isLoading: isLoadingCopy } = useAction(copyCard, {
    onSuccess: () => {
      toast.success(`Card "${data.title}" copied`);
      cardModal.onClose();
    },
    onError: (error) => {
      toast.error(error);
    },
  });
  const { execute: executeDeleteCard, isLoading: isLoadingDelete } = useAction(deleteCard, {
    onSuccess: () => {
      toast.success(`Card "${data.title}" deleted`);
      cardModal.onClose();
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const onCopy = async () => {
    const bordId = params.boardId;
    await executeCopyCard({ id: data.id, boardId: bordId });
  };
  const onDelete = async () => {
    const bordId = params.boardId;
    await executeDeleteCard({ id: data.id, boardId: bordId });
  };

  return (
    <div className="mt-2 space-y-2">
      <p className="text-xs font-semibold">Actions</p>
      <Button onClick={onCopy} disabled={isLoadingCopy} variant="gray" className="w-full justify-start" size="inline">
        <CopyIcon className="mr-2 size-4" />
        Copy
      </Button>

      <Button
        onClick={onDelete}
        disabled={isLoadingDelete}
        variant="gray"
        className="w-full justify-start"
        size="inline"
      >
        <TrashIcon className="mr-2 size-4" />
        Delete
      </Button>
    </div>
  );
}

Actions.Skeleton = function ActionSkeleton() {
  return (
    <div className="mt-2 space-y-2">
      <Skeleton className="h-4 w-20 bg-neutral-200" />
      <Skeleton className="h-8 w-full bg-neutral-200" />
      <Skeleton className="h-8 w-full bg-neutral-200" />
    </div>
  );
};
