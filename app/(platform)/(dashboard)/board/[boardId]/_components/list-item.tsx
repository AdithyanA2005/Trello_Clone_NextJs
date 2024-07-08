"use client";

import { useRef, useState } from "react";
import { Draggable, Droppable } from "@hello-pangea/dnd";
import { cn } from "@/lib/utils";
import { ListWithCards } from "@/types";
import { CardForm } from "./card-form";
import { CardItem } from "./card-item";
import { ListHeader } from "./list-header";

interface ListItemProps {
  list: ListWithCards;
  index: number;
}

export function ListItem({ list, index }: ListItemProps) {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const disableEditing = () => setIsEditing(false);
  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => textAreaRef.current?.focus());
  };

  return (
    <Draggable draggableId={list.id} index={index}>
      {(provided) => (
        <li {...provided.draggableProps} ref={provided.innerRef} className="h-full w-[272px] shrink-0 select-none">
          <div {...provided.dragHandleProps} className="w-full rounded-md bg-[#f1f2f4] pb-2 shadow-md">
            <ListHeader onAddCard={enableEditing} list={list} />

            <Droppable droppableId={list.id} type="card">
              {(provided) => (
                <ol
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className={cn("mx-1 flex flex-col gap-y-2 px-1 py-0.5", list.cards.length > 0 ? "mt-2" : "mt-0")}
                >
                  {list.cards.map((card, index) => (
                    <CardItem index={index} key={card.id} card={card} />
                  ))}
                  {provided.placeholder}
                </ol>
              )}
            </Droppable>

            <CardForm
              listId={list.id}
              ref={textAreaRef}
              isEditing={isEditing}
              enableEditing={enableEditing}
              disableEditing={disableEditing}
            />
          </div>
        </li>
      )}
    </Draggable>
  );
}
