"use client";

import { useEffect, useState } from "react";
import { ListWithCards } from "@/types";
import { ListItem } from "@/app/(platform)/(dashboard)/board/[boardId]/_components/list-item";
import { ListForm } from "./list-form";

interface ListContainerProps {
  lists: ListWithCards[];
  boardId: string;
}

export function ListContainer({ lists, boardId }: ListContainerProps) {
  const [orderedList, setOrderedList] = useState<ListWithCards[]>(lists);

  useEffect(() => {
    setOrderedList(lists);
  }, [lists]);

  return (
    <ol className="flex h-full gap-x-3">
      {orderedList.map((list, index) => (
        <ListItem key={list.id} index={index} list={list} />
      ))}
      <ListForm />
      <div className="flex w-1 shrink-0" />
    </ol>
  );
}
