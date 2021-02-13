import React from "react";
import { Card, CardContent } from "@material-ui/core";
import { Draggable } from "react-beautiful-dnd";
import List from "components/Cards/card-drag-drop/List";
import CardNavbar from "components/Cards/card-drag-drop/card-component/CardNavbar";
import Collapse from "@material-ui/core/Collapse";
import DragIndicatorIcon from "@material-ui/icons/DragIndicator";
import CardTitle from "components/Cards/card-drag-drop/CardTitle";

interface Props {
  card: any;
  index: number;
}

const getCardStyle = (draggableStyle: any) => ({
  margin: `0 0 8px 0`,
  ...draggableStyle
});

export default function DndCard({ card, index }: Props) {
  return (
    <Draggable key={card._id} draggableId={card._id} index={index}>
      {(provided) => (
        <Card
          innerRef={provided.innerRef}
          {...provided.draggableProps}
          style={getCardStyle(provided.draggableProps.style)}
          className="card-component"
        >
          <CardContent>
            <div className="flex align-center space-between">
              <div
                {...provided.dragHandleProps}
                className="flex align-center w-100"
              >
                <DragIndicatorIcon />
                <InnerCardTitle title={card.title} cardID={card._id} />
              </div>
              <CardNavbar
                cardID={card._id}
                cardExpand={card.expand}
                listLength={card.list.length}
                index={index}
              />
            </div>
            <Collapse in={card.expand} timeout="auto" unmountOnExit>
              <InnerList card={JSON.stringify(card)} />
            </Collapse>
          </CardContent>
        </Card>
      )}
    </Draggable>
  );
}
const InnerList = React.memo(function InnerList({ card }: any) {
  return <List card={JSON.parse(card)} />;
});

const InnerCardTitle = React.memo(function InnerTitle({ title, cardID }: any) {
  return <CardTitle title={title} cardID={cardID} />;
});
