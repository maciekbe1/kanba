import React from "react";
import CardsDragDrop from "components/Cards/card-drag-drop/CardsDragDrop";
// import RemoveDialog from "components/Cards/card-dialogs/RemoveDialog";
import SideDial from "components/Cards/card-dialogs/SideDial";
import ItemContent from "components/Cards/ItemContent";
import CardsNav from "components/Cards/cards-nav/CardsNav";

import Container from "@material-ui/core/Container";

export default function CardsView() {
  return (
    <Container maxWidth="xl">
      <CardsNav />
      <div style={{ display: "flex" }}>
        <CardsDragDrop />
        <ItemContent />
      </div>
      <SideDial />
    </Container>
  );
}
