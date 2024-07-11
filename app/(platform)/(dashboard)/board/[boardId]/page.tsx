import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/database/prisma";
import { ListContainer } from "./_components/list-container";

interface BoardIdPageProps {
  params: {
    boardId: string;
  };
}

export default async function BoardIdPage({ params }: BoardIdPageProps) {
  const { orgId } = auth();
  if (!orgId) redirect("/select-org");

  const lists = await prisma.list.findMany({
    where: {
      boardId: params.boardId,
      board: { orgId },
    },
    include: { cards: { orderBy: { position: "asc" } } },
    orderBy: { position: "asc" },
  });

  return (
    <div className="scrollbar-thin scrollbar-track-primary/50 scrollbar-thumb-primary-foreground/50 h-full overflow-x-auto p-4">
      <ListContainer boardId={params.boardId} lists={lists} />
    </div>
  );
}
