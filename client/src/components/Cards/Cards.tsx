import React, { useEffect } from "react";
import { setCards, setCardsLoaded } from "store/actions/cardsActions";
import { setBar } from "store/actions/layoutActions";

import { useDispatch, useSelector } from "react-redux";
import * as CardsService from "services/CardsService";
import { CARDS_PROBLEM_MESSAGE } from "constants/cards";
import CardsView from "components/Cards/CardsView";
import { CardsTypes } from "store/types";
import Spinner from "components/Layouts/Spinner";

interface RootState {
  cardsReducer: CardsTypes;
}

export default function Cards(): JSX.Element {
  const isCardsLoaded = useSelector(
    ({ cardsReducer }: RootState) => cardsReducer.isCardsLoaded
  );
  const dispatch = useDispatch();

  useEffect(() => {
    fetchCards(dispatch, setCardsLoaded);
  }, [dispatch]);
  return isCardsLoaded ? <CardsView /> : <Spinner text="Cards loading..." />;
}

function fetchCards(dispatch: any, setCardsLoaded: any) {
  CardsService.getCards()
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
