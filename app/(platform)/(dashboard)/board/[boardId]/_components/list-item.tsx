"use client";

import { ListWithCards } from "@/types";
import { ListHeader } from "@/app/(platform)/(dashboard)/board/[boardId]/_components/list-header";

interface ListItemProps {
  list: ListWithCards;
  index: number;
}

export function ListItem({ list, index }: ListItemProps) {
  return (
    <li className="h-full w-[272px] shrink-0 select-none">
      <div className="w-full rounded-md bg-[#f1f2f4] pb-2 shadow-md">
        <ListHeader list={list} />
      </div>
    </li>
  );
}
