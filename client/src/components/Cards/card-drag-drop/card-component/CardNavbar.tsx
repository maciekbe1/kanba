import React from "react";
import CardMenu from "components/Cards/card-drag-drop/card-component/CardMenu";

interface Props {
  cardID: string;
  listLength: number;
  cardExpand: boolean;
  index: number;
}

export default function CardNavbar({
  cardID,
  listLength,
  cardExpand,
  index
}: Props) {
  // const { enqueueSnackbar } = useSnackbar();

  // const item = useSelector((state: any) => state.cardsReducer.itemContentData);
  // const isNewContentOpen = useSelector(
  //   (state: any) => state.cardsReducer.isNewContentOpen
  // );
  // const onRemoveCard = () => {
  //   onRemove({
  //     dialogTitle: "Are you sure you want to delete this card?",
  //     dialogText: cardTitle,
  //     remove: () => {
  //       CardsService.removeCard(cardID, userID)
  //         .then(() => {
  //           if (item?.cardID === cardID) {
  //             dispatch(closeItemContent());
  //           }
  //           if (isNewContentOpen) {
  //             dispatch(cancelNewContent());
  //           }
  //           dispatch(removeCard({ cardID }));
  //         })
  //         .catch(error => {
  //           enqueueSnackbar(error.response.data.message, {
  //             variant: "error",
  //             preventDuplicate: true
  //           });
  //         });
  //     }
  //   });
  // };

  return (
    <div className="card-navbar-component">
      <CardMenu
        expand={cardExpand}
        listLength={listLength}
        cardID={cardID}
        index={index}
      />
    </div>
  );
}
