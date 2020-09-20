export const setCards = ({ cards }: { cards: Array<any> }) => ({
  type: "SET_CARDS_STATE",
  cardsState: cards
});

export const updateCardProperties = (payload: any) => {
  return {
    type: "UPDATE_CARD_PROPERTIES",
    payload
  };
};

export const removeCard = ({ cardID }: { cardID: string }) => ({
  type: "REMOVE_CARD",
  cardID
});

export const createCard = (payload: any) => ({
  type: "CREATE_CARD",
  payload
});

export const createItem = (payload: any) => ({
  type: "CREATE_ITEM",
  payload
});

export const removeItem = (payload: any) => ({
  type: "REMOVE_ITEM",
  payload
});

export const updateItemProperties = (payload: any) => ({
  type: "UPDATE_ITEM_PROPERTIES",
  payload
});

export const setSelectedItems = (payload: any) => ({
  type: "SELECTED_ITEMS",
  payload
});

export const setCardsLoaded = (payload: boolean) => ({
  type: "SET_CARDS_LOADED",
  payload
});

export const openItemContent = (payload: any) => ({
  type: "OPEN_ITEM_CONTENT",
  payload
});

export const closeItemContent = () => ({
  type: "CLOSE_ITEM_CONTENT"
});

export const addAttachment = (payload: any) => ({
  type: "ADD_ATTACHMENT",
  payload
});

export const removeAttachment = (payload: any) => ({
  type: "REMOVE_ATTACHMENT",
  payload
});

export const openNewContent = (cardID: string) => ({
  type: "OPEN_NEW_CONTENT",
  cardID
});

export const cancelNewContent = () => ({
  type: "CANCEL_NEW_CONTENT"
});

export const updateItemContent = (payload: any) => ({
  type: "UPDATE_ITEM_CONTENT",
  payload
});

export const setPreviousItem = () => ({
  type: "SET_PREVIOUS_ITEM"
});

export const setNextItem = () => ({
  type: "SET_NEXT_ITEM"
});
