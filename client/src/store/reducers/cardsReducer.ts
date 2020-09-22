import { remove, set, findIndex } from "lodash";
import Card from "model/Card";
import ItemHelper from "helper/ItemHelper";
import * as CardsHelper from "helper/CardsHelper";
import Content from "model/Content";

const INITIAL_DATA = {
  isCardsLoaded: false,
  selectedItems: [],
  cardsState: [],
  isContentOpen: false,
  isNewContentOpen: false,
  itemContentData: {},
  openItemCardName: null
};

export default (state = INITIAL_DATA, action: any) => {
  switch (action.type) {
    case "SET_CARDS_STATE": {
      return {
        ...state,
        cardsState: new Card(action.cardsState).cards
      };
    }

    case "REMOVE_CARD": {
      remove(state.cardsState, (item: any) => item._id === action.cardID);

      return {
        ...state,
        cardsState: new Card(state.cardsState).cards
      };
    }

    case "CREATE_CARD": {
      const cards = [action.payload, ...state.cardsState];
      return {
        ...state,
        cardsState: cards
      };
    }

    case "CREATE_ITEM": {
      const obj = CardsHelper.findCard(action.payload.cardID, state.cardsState);

      obj?.list.push({
        ...action.payload
      });
      return {
        ...state,
        cardsState: new Card(state.cardsState).cards
      };
    }

    case "REMOVE_ITEM": {
      const obj = CardsHelper.findCard(action.payload.cardID, state.cardsState);
      remove(obj?.list, (item: any) => item._id === action.payload.itemID);
      return {
        ...state,
        cardsState: new Card(state.cardsState).cards
      };
    }

    case "UPDATE_ITEM_PROPERTIES": {
      const name = Object.keys(action.payload)[1];
      const value = Object.values(action.payload)[1];
      const obj = ItemHelper.findItem(action.payload.itemID, state.cardsState);
      set(obj, [name], value);
      return {
        ...state,
        cardsState: new Card(state.cardsState).cards
      };
    }

    case "UPDATE_CARD_PROPERTIES": {
      const name = Object.keys(action.payload)[1];
      const o: any = state.cardsState[action.payload.index];
      o[name] = action.payload[name];

      return {
        ...state,
        cardsState: new Card(state.cardsState).cards,
        openItemCardName: action.payload.title
      };
    }

    case "SELECTED_ITEMS": {
      return {
        ...state,
        selectedItems: action.payload
      };
    }

    case "SET_CARDS_LOADED": {
      return {
        ...state,
        isCardsLoaded: action.payload
      };
    }

    case "OPEN_ITEM_CONTENT": {
      const item = ItemHelper.findItem(action.payload.itemID, state.cardsState);
      const card = CardsHelper.getCardByItemID(
        action.payload.itemID,
        state.cardsState
      );
      item.cardTitle = card.title;

      return {
        ...state,
        isContentOpen: true,
        isNewContentOpen: false,
        itemContentData: item
      };
    }

    case "CLOSE_ITEM_CONTENT": {
      return {
        ...state,
        isContentOpen: false,
        itemContentData: {}
      };
    }

    case "OPEN_NEW_CONTENT": {
      const card = CardsHelper.findCard(action.cardID, state.cardsState);
      return {
        ...state,
        isNewContentOpen: true,
        isContentOpen: false,
        itemContentData: new Content(
          card.userID,
          [], //attachments
          action.cardID,
          card.title,
          "", //content
          Date.now(),
          [], //labels
          null, //priority
          null, //status
          `new-item-${card.list.length}` //title
        )
      };
    }

    case "UPDATE_ITEM_CONTENT": {
      const objKey = Object.keys(action.payload)[0];
      const objValue = Object.values(action.payload)[0];
      const obj = state.itemContentData;
      set(obj, [objKey], objValue);
      return {
        ...state,
        itemContentData: Object.assign({}, state.itemContentData, obj)
      };
    }

    case "CANCEL_NEW_CONTENT": {
      return {
        ...state,
        isNewContentOpen: false,
        itemContentData: {}
      };
    }

    case "ADD_ATTACHMENT": {
      const item = ItemHelper.findItem(action.payload.itemID, state.cardsState);
      Object.assign(item, {
        attachments: [...item.attachments, ...action.payload.files]
      });

      return {
        ...state,
        cardsState: new Card(state.cardsState).cards,
        itemContentData: Object.assign({}, state.itemContentData, item)
      };
    }

    case "REMOVE_ATTACHMENT": {
      const item = ItemHelper.findItem(action.payload.itemID, state.cardsState);
      item.attachments.splice(action.payload.index, 1);

      return {
        ...state,
        cardsState: new Card(state.cardsState).cards,
        itemContentData: Object.assign({}, state.itemContentData, item)
      };
    }

    case "SET_NEXT_ITEM": {
      const itemContentData: any = state.itemContentData;
      const card = CardsHelper.findCard(
        itemContentData.cardID,
        state.cardsState
      );

      const index = findIndex(card.list, function (o: any) {
        return o._id === itemContentData._id;
      });
      let nextItem;
      if (index >= 0 && index < card.list.length - 1)
        nextItem = card.list[index + 1];
      return {
        ...state,
        itemContentData: Object.assign({}, state.itemContentData, nextItem)
      };
    }

    case "SET_PREVIOUS_ITEM": {
      const itemContentData: any = state.itemContentData;
      const card = CardsHelper.findCard(
        itemContentData.cardID,
        state.cardsState
      );

      const index = findIndex(card.list, function (o: any) {
        return o._id === itemContentData._id;
      });
      let prevItem;
      if (index > 0 && index < card.list.length)
        prevItem = card.list[index - 1];
      return {
        ...state,
        itemContentData: Object.assign({}, state.itemContentData, prevItem)
      };
    }
    default:
      return state;
  }
};
