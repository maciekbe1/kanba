import { request, sendFile } from "api/API";

export const getCards = (userID: string) => {
  return request(`/api/cards/get-user-cards`, {
    userID
  });
};

export const createCard = (data: any) => {
  return request(`/api/cards/create-card`, data);
};

export const createItem = (cardID: string, item: any) => {
  return request(`/api/cards/create-card-item`, {
    cardID,
    item
  });
};

export const updateCard = (
  card: any,
  cardID: string,
  type: string,
  name: string
) => {
  return request(`/api/cards/update-card`, {
    card: { [name]: card[name] },
    cardID,
    type
  });
};

export const cardItemChange = (result: any) => {
  return request(`/api/cards/update-card`, {
    card: {
      destination: result.destination.index,
      itemID: result.draggableId,
      cardID: result.destination.droppableId
    },
    type: "inside_list"
  });
};
export const updateItem = (itemID: string, key: string, value: any) => {
  return request(`/api/cards/update-item`, {
    itemID,
    item: { [key]: value }
  });
};
export const cardItemShared = (start: any, end: any, result: any) => {
  return request(`/api/cards/update-card`, {
    card: {
      start: start._id,
      end: end._id,
      destination: result.destination.index,
      draggableId: result.draggableId
    },
    type: "all_lists"
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
