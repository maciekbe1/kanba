import React, { useCallback } from "react";
import { Draggable } from "react-beautiful-dnd";

import { useDispatch, useSelector } from "react-redux";
import { openItemContent } from "store/actions/cardsActions";

import LaunchIcon from "@material-ui/icons/Launch";
import ItemCheckbox from "components/Cards/card-drag-drop/item-component/ItemCheckbox";
import ItemInfo from "components/Cards/card-drag-drop/item-component/ItemInfo";
import IconButton from "@material-ui/core/IconButton";

const selectedItemSelector = (contentID, itemID) => {
  return contentID?._id === itemID;
};
export default function DndItem({ item, index }) {
  const selected = useSelector((state) =>
    selectedItemSelector(state.cardsReducer.itemContentData, item._id)
  );
  const dispatch = useDispatch();
  const openItem = useCallback(
    (e) => {
      e.stopPropagation();
      dispatch(openItemContent({ itemID: item._id }));
    },
    [item._id, dispatch]
  );

  const getItemStyle = (provided, snapshot) => {
    return {
      background: snapshot.isDragging ? "#ccc" : "",
      ...provided.draggableProps.style
    };
  };

  return (
    <Draggable key={item._id} draggableId={item._id} index={index}>
      {(provided, snapshot) => (
        <div
          {...provided.draggableProps}
          ref={provided.innerRef}
          style={getItemStyle(provided, snapshot)}
          className={selected ? "card-item card-item-selected" : "card-item"}
        >
          <div
            className="flex align-center space-between card-item-container"
            {...provided.dragHandleProps}
          >
            <div className="flex align-center card-item-action">
              <ItemCheckbox item={item} />
              <span className="item-title-text">{item.title}</span>
            </div>
            <div className="flex">
              <div className="card-item-icons">
                <ItemInfo status={item.status} priority={item.priority} />
              </div>
              <IconButton
                className="launch-item-button"
                onClick={openItem}
                size="small"
              >
                <LaunchIcon />
              </IconButton>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
}
