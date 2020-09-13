import React, { useEffect } from "react";
import { setCards, setCardsLoaded } from "store/actions/cardsActions";
import { setBar } from "store/actions/layoutActions";

import { useDispatch, useSelector } from "react-redux";
import * as CardsService from "services/CardsService";
import { CARDS_PROBLEM_MESSAGE } from "constants/cards";
import CardsView from "components/Cards/CardsView";
import { UserTypes, CardsTypes } from "store/types";
import Spinner from "components/Layouts/Spinner";

interface RootState {
  authReducer: UserTypes;
  cardsReducer: CardsTypes;
}

export default function Cards(): JSX.Element {
  const userID = useSelector(
    ({ authReducer }: RootState) => authReducer.data._id
  );
  const isCardsLoaded = useSelector(
    ({ cardsReducer }: RootState) => cardsReducer.isCardsLoaded
  );
  const dispatch = useDispatch();

  useEffect(() => {
    fetchCards(dispatch, userID, setCardsLoaded);
  }, [dispatch, userID]);
  return isCardsLoaded ? <CardsView /> : <Spinner text="Cards loading..." />;
}

function fetchCards(dispatch: any, userID: string, setCardsLoaded: any) {
  CardsService.getCards(userID)
    .then((res: any) => {
      dispatch(setCards({ cards: res.data }));
      dispatch(setCardsLoaded(true));
    })
    .catch((error: any) => {
      dispatch(
        setBar({ type: "error", message: CARDS_PROBLEM_MESSAGE, active: true })
      );
    });
}
