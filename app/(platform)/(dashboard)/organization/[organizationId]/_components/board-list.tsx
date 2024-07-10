import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { HelpCircleIcon, User2Icon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { NewBoardFormPopover } from "@/components/new-board-form-popover";
import { MAX_FREE_BOARDS } from "@/constants/boards";
import { prisma } from "@/lib/db";
import { getUsedBoardCount } from "@/lib/org-limit";
import { checkSubscription } from "@/lib/subscription";
import { Hint } from "./hint";

export async function BoardList() {
  const { orgId } = auth();
  if (!orgId) redirect("/select-org");

  const boards = await prisma.board.findMany({
    where: { orgId },
    orderBy: { createdAt: "desc" },
  });

  const usedBoardCount = await getUsedBoardCount();
  const isPro = await checkSubscription();

  return (
    <div className="space-y-4">
      <div className="flex items-center font-semibold text-neutral-700">
        <User2Icon className="mr-2 size-6" />
        Your Boards
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {boards.map((board) => (
          <Link
            key={board.id}
            href={`/board/${board.id}`}
            style={{ backgroundImage: `url(${board.imageThumbUrl})` }}
            className="group relative aspect-video h-full w-full overflow-hidden rounded-sm bg-gradient-to-r from-pink-700 to-sky-700 bg-cover bg-center bg-no-repeat p-2"
          >
            <div className="absolute inset-0 bg-black/30 transition group-hover:bg-black/40" />
            <p className="relative font-semibold text-white">{board.title}</p>
          </Link>
        ))}

        <NewBoardFormPopover sideOffset={10} side="right">
          <div
            role="button"
            className="relative flex aspect-video h-full w-full flex-col items-center justify-center gap-y-1 rounded-sm bg-muted transition hover:opacity-75"
          >
            <p className="text-sm">Create new board</p>
            <span className="text-xs">{isPro ? "Unlimited" : `${MAX_FREE_BOARDS - usedBoardCount} remaining`}</span>
            <Hint
              description="Free Workspaces can have upto 5 open boards at a time. Upgrade to a paid plan to create more boards."
              sideOffset={40}
            >
              <HelpCircleIcon className="absolute bottom-2 right-2 size-[14px]" />
            </Hint>
          </div>
        </NewBoardFormPopover>
      </div>
    </div>
  );
}

BoardList.Skeleton = function BoardListSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center font-semibold text-neutral-700">
        <User2Icon className="mr-2 size-6" />
        Your Boards
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        <Skeleton className="aspect-video h-full w-full p-2" />
        <Skeleton className="aspect-video h-full w-full p-2" />
        <Skeleton className="aspect-video h-full w-full p-2" />
        <Skeleton className="aspect-video h-full w-full p-2" />
        <Skeleton className="aspect-video h-full w-full p-2" />
        <Skeleton className="aspect-video h-full w-full p-2" />
        <Skeleton className="aspect-video h-full w-full p-2" />
        <Skeleton className="aspect-video h-full w-full p-2" />
      </div>
    </div>
  );
};
