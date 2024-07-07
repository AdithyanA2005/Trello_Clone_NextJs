import React from "react";
import { notFound, redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { BoardNavbar } from "./_components/board-navbar";

interface IParams {
  boardId: string;
}

export async function generateMetadata({ params }: { params: IParams }) {
  const { orgId } = auth();
  if (!orgId) return { title: "Board" };

  const board = await prisma.board.findUnique({
    where: {
      id: params.boardId,
      orgId,
    },
  });
  return { title: board?.title || "Board" };
}

export default async function BoardIdLayout({ children, params }: { children: React.ReactNode; params: IParams }) {
  const { orgId } = auth();
  if (!orgId) redirect("/select-org");

  const board = await prisma.board.findUnique({
    where: {
      id: params.boardId,
      orgId,
    },
  });
  if (!board) notFound();

  const { boardId } = params;

  return (
    <div
      style={{ backgroundImage: `url(${board.imageFullUrl})` }}
      className="relative h-full bg-cover bg-center bg-no-repeat"
    >
      <BoardNavbar board={board} />
      <div className="absolute inset-0 bg-black/10" />
      <main className="relative h-full pt-28">{children}</main>
    </div>
  );
}
