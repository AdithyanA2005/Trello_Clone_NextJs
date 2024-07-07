import { BoardTitleForm } from "@/app/(platform)/(dashboard)/board/[boardId]/_components/board-title-form";
import { Board } from "@prisma/client";

interface BoardNavbarProps {
  board: Board;
}

export async function BoardNavbar({ board }: BoardNavbarProps) {
  return (
    <div className="fixed top-14 z-[40] flex h-14 w-full items-center gap-x-4 bg-black/50 px-6 text-white">
      <BoardTitleForm board={board} />
    </div>
  );
}
