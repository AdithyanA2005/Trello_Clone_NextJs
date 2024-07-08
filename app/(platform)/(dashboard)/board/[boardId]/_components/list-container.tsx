"use client";

import { useEffect, useState } from "react";
import { DragDropContext, Droppable, DropResult } from "@hello-pangea/dnd";
import { ListWithCards } from "@/types";
import { ListForm } from "./list-form";
import { ListItem } from "./list-item";

interface ListContainerProps {
  lists: ListWithCards[];
  boardId: string;
}

function reorder<T>(list: T[], srcIndex: number, destIndex: number) {
  const result = Array.from(list);
  const [removed] = result.splice(srcIndex, 1);
  result.splice(destIndex, 0, removed);
  return result;
}

export function ListContainer({ lists, boardId }: ListContainerProps) {
  const [orderedList, setOrderedList] = useState<ListWithCards[]>(lists);

  const onDragEnd = (result: DropResult) => {
    const { destination, source, type } = result;

    // Not dropped in a droppable
    if (!destination) return;

    // Dropped in the same position
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    // If a list is moved
    if (type === "list") {
      // Reorder lists and update position
      const reorderedList = reorder(orderedList, source.index, destination.index);
      reorderedList.forEach((list, index) => (list.position = index));

      // Update the state with the new ordered list
      setOrderedList(reorderedList);
      // TODO: Update in database
      return;
    }

    // If a card is moved
    if (type === "card") {
      let reorderedList = [...orderedList];

      // Find the source and destination of the reorderedList
      const srcList = reorderedList.find((list) => list.id === source.droppableId);
      const destList = reorderedList.find((list) => list.id === destination.droppableId);
      if (!srcList || !destList) return;

      // Ensure cards array exist
      if (!srcList.cards) srcList.cards = [];
      if (!destList.cards) destList.cards = [];

      // If the card is moved within the same list
      if (source.droppableId === destination.droppableId) {
        // Reorder cards and update position
        const reorderedCards = reorder(srcList.cards, source.index, destination.index);
        reorderedCards.forEach((card, index) => (card.position = index));

        // Update the source list cards with reordered cards
        srcList.cards = reorderedCards;
      } else {
        // Remove the moved card from the source list
        const [movedCard] = srcList.cards.splice(source.index, 1);

        // Update the listId of the moved card
        movedCard.listId = destination.droppableId;

        // Insert the moved card in the destination list
        destList.cards.splice(destination.index, 0, movedCard);

        // Update the position of the cards in the source and destination lists
        srcList.cards.forEach((card, index) => (card.position = index));
        destList.cards.forEach((card, index) => (card.position = index));
      }

      // Update the state with the new ordered list
      setOrderedList(reorderedList);
      // TODO: Update in database
      return;
    }
  };

  useEffect(() => {
    setOrderedList(lists);
  }, [lists]);

  return (
    <DragDropContext onDragEnd={onDragEnd}>
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
