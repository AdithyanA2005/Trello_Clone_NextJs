import React from "react";
import { notFound, redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/database/prisma";
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

  return (
    <div
      className="relative h-full bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(${board.imageFullUrl}), linear-gradient(to bottom right, #38bdf8, #3b82f6, #ec4899)`,
      }}
    >
      <BoardNavbar board={board} />
      <div className="absolute inset-0 bg-black/10" />
      <main className="relative h-full pt-[100px]">{children}</main>
    </div>
  );
}
