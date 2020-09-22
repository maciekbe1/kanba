import { request, sendFile } from "api/API";

export const getCards = (userID: string) => {
  return request(`/api/cards/get-user-cards`, {
    userID
  });
};

export const createCard = (data: any) => {
  return request(`/api/cards/create-card`, data);
};

export const createItem = (itemProperties: any) => {
  return request(`/api/cards/create-card-item`, {
    ...itemProperties
  });
};

export const updateCardPosition = (userID: string, result: any) => {
  return request(`/api/cards/update-card-position`, {
    card: {
      userID,
      destination: result.destination.index,
      cardID: result.draggableId
    },
    type: "card_change_position"
  });
};

export const updateCardProperties = (
  cardID: string,
  property: any,
  name: string
) => {
  return request(`/api/cards/update-card-properties`, {
    name,
    property,
    cardID
  });
};

export const changeItemPositionInsideCard = (result: any) => {
  return request(`/api/cards/update-card-position`, {
    card: {
      destination: result.destination.index,
      itemID: result.draggableId,
      cardID: result.destination.droppableId
    },
    type: "inside_list"
  });
};
export const updateItemProperties = (
  itemID: string,
  name: string,
  property: any
) => {
  return request(`/api/cards/update-item-properties`, {
    itemID,
    property,
    name
  });
};
export const moveItemToOtherCard = (start: any, end: any, result: any) => {
  return request(`/api/cards/update-card-position`, {
    card: {
      oldCardID: start._id,
      newCardID: end._id,
      position: result.destination.index,
      itemID: result.draggableId
    },
    type: "item_change_card"
  });
};

export const removeCardItem = (cardID: string, itemID: string) => {
  return request(`/api/cards/remove-card-item`, {
    cardID,
    itemID
  });
};

export const updateManyItems = (
  destination: string,
  selectedItems: Array<any>,
  position: number
) => {
  return request(`/api/cards/update-many-items`, {
    destination,
    selectedItems,
    position
  });
};

export const removeSelectedItems = (selected: Array<any>) => {
  return request(`/api/cards/remove-many-items`, { selected });
};

export const removeCard = (cardID: string, userID: string) => {
  return request(`/api/cards/remove-card`, {
    cardID,
    userID
  });
};

export const addFileToItem = (files: any) => {
  return sendFile(`/api/cards/upload-file`, files);
};

export const removeFileFromItem = (
  name: string,
  itemID: string,
  fileID: string
) => {
  return request(`/api/cards/remove-file`, {
    name,
    itemID,
    fileID
  });
};
