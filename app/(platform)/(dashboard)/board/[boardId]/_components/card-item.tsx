"use client";

import { Card } from "@prisma/client";

interface CardItemProps {
  index: number;
  card: Card;
}

export function CardItem({ index, card }: CardItemProps) {
  return (
    <div
      role="button"
      className="truncate rounded-md border-2 border-transparent bg-white px-3 py-2.5 shadow-sm hover:border-black"
    >
      {card.title}
    </div>
  );
}
