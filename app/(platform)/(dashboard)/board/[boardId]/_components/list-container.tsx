"use client";

import { useEffect, useState } from "react";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
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
    <DragDropContext onDragEnd={() => {}}>
      <Droppable droppableId="lists" type="list" direction="horizontal">
        {(provided) => (
          <ol {...provided.droppableProps} ref={provided.innerRef} className="flex h-full gap-x-3">
            {orderedList.map((list, index) => (
              <ListItem key={list.id} index={index} list={list} />
            ))}
            {provided.placeholder}
            <ListForm />
            <div className="flex w-1 shrink-0" />
          </ol>
        )}
      </Droppable>
    </DragDropContext>
  );
}
