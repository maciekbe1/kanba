import React, { memo } from "react";
import Item from "components/Cards/card-drag-drop/Item";
import { Droppable } from "react-beautiful-dnd";

export default function List({ card }) {
  return (
    <Droppable droppableId={card._id} type="LIST">
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          style={{ minHeight: "20px" }}
        >
          {card.list.map((item, index) => (
            <InnerItem
              cardID={card._id}
              key={item._id}
              item={JSON.stringify(item)}
              index={index}
            />
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
}

const InnerItem = memo(function InnerItem({ item, index, cardID }) {
  return <Item item={JSON.parse(item)} index={index} cardID={cardID} />;
});
