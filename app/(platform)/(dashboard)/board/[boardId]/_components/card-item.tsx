"use client";

import { Draggable } from "@hello-pangea/dnd";
import { Card } from "@prisma/client";
import { useCardModal } from "@/hooks/useCardModal";

interface CardItemProps {
  index: number;
  card: Card;
}

export function CardItem({ index, card }: CardItemProps) {
  const { onOpen } = useCardModal();

  return (
    <Draggable draggableId={card.id} index={index}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          role="button"
          onClick={() => onOpen(card.id)}
          className="truncate rounded-md border-2 border-transparent bg-white px-3 py-2.5 shadow-sm hover:border-black"
        >
          {card.title}
        </div>
      )}
    </Draggable>
  );
}
