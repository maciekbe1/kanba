import { find, remove } from "lodash";

export const cardItemChange = (cards: Array<any>, result: any) => {
  const reorder = (list: Array<any>, startIndex: number, endIndex: number) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };
  cards.map((card: any) => {
    const data = reorder(
      card.list,
      result.source.index,
      result.destination.index
    );
    if (card._id === result.source.droppableId) {
      card.list = data;
    }
    return data;
  });
  return cards;
};

export const cardItemShared = (cards: Array<any>, result: any) => {
  let start = find(cards, (o) => {
    return o._id === result.source.droppableId;
  });
  let end = find(cards, (o) => {
    return o._id === result.destination.droppableId;
  });
  const [removed] = start.list.splice(result.source.index, 1);
  removed.cardID = result.destination.droppableId;
  end.list.splice(result.destination.index, 0, removed);
  return { start, end, newCards: cards };
};

export const cardChange = (cards: Array<any>, result: any) => {
  const [removed] = cards.splice(result.source.index, 1);
  cards.splice(result.destination.index, 0, removed);
  return cards;
};

export const cardItemsSelectedChange = (
  cards: Array<any>,
  result: any,
  selected: Array<any>
) => {
  const destinationCard = cards.find(
    (card: any) => card._id === result.destination.droppableId
  );

  cards.forEach((card: any) => {
    selected.forEach((s: any) => {
      remove(card.list, ["_id", s._id]);
      s.cardID = result.destination.droppableId;
    });
  });

  destinationCard.list.splice(result.destination.index, 0, ...selected);

  return cards;
};

export const removeSelectedItems = (
  cards: Array<any>,
  selectedItems: Array<any>
) => {
  cards.forEach((card: any) => {
    selectedItems.forEach((s: any) => {
      remove(card.list, ["_id", s._id]);
    });
  });
  return cards;
};

export const findCard = (cardID: string, cards: Array<any>) => {
  return find(cards, (o) => {
    return o._id === cardID;
  });
};

export const getCardByItemID = (itemID: string, cards: Array<any>): any => {
  return find(cards, ({ list }) => find(list, ["_id", itemID]));
};
