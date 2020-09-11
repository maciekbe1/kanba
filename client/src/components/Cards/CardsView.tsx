import React, { useState, useCallback } from "react";
import CardsDragDrop from "components/Cards/card-drag-drop/CardsDragDrop";
import RemoveDialog from "components/Cards/card-dialogs/RemoveDialog";
import SideDial from "components/Cards/card-dialogs/SideDial";
import ItemContent from "components/Cards/ItemContent";

import Container from "@material-ui/core/Container";

interface Props {
  onRemoveItems: Function;
}
export default function CardsView() {
  const [dialog, setDialog] = useState(false);
  const [data, setData] = useState();

  const onRemove = useCallback((cardData) => {
    setData(cardData);
    setDialog(!dialog);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onClose = () => {
    setDialog(!dialog);
  };

  return (
    <Container maxWidth="xl" style={{ display: "flex" }}>
      <CardsDragDrop onRemove={onRemove} />
      <ItemContent />
      <RemoveDialog open={dialog} onClose={onClose} data={data} />
      <InnerSideDial onRemoveItems={onRemove} />
    </Container>
  );
}

const InnerSideDial = React.memo(function InnerSideDial({
  onRemoveItems
}: Props) {
  return <SideDial onRemoveItems={onRemoveItems} />;
});
