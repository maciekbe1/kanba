import React, { useState } from "react";
import SpeedDial from "@material-ui/lab/SpeedDial";
import SpeedDialIcon from "@material-ui/lab/SpeedDialIcon";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector, useDispatch } from "react-redux";
import * as CardsService from "services/CardsService";
import * as CardsHelper from "helper/CardsHelper";
import { Typography } from "@material-ui/core";
import SimpleModal from "components/Utils/Modal";
import {
  setCards,
  setSelectedItems,
  createCard,
  closeItemContent
} from "store/actions/cardsActions";
import CreateCard from "components/Cards/card-dialogs/CreateCardDialog";
import { UserTypes, CardsTypes } from "store/types";

interface RootState {
  authReducer: UserTypes;
  cardsReducer: CardsTypes;
}
interface Props {
  onRemoveItems: any;
}

export default function SideDial({ onRemoveItems }: Props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const cards = useSelector(
    (state: RootState) => state.cardsReducer.cardsState
  );
  const userID = useSelector((state: RootState) => state.authReducer.data._id);
  const content = useSelector(
    (state: RootState) => state.cardsReducer.itemContentData
  );

  const [error, setError] = useState(false);
  const [message, setMessage] = useState("");
  const [data, setData] = useState();

  const selectedItems = useSelector(
    (state: RootState) => state.cardsReducer.selectedItems
  );

  const icon: JSX.Element = <DeleteForeverIcon />;
  const removeAction = () => {
    onRemoveItems({
      remove: () => {
        const newCards = CardsHelper.removeSelectedItems(cards, selectedItems);
        const selected = selectedItems.map((item) => {
          if (item._id === content?._id) {
            dispatch(closeItemContent());
          }
          return {
            itemID: item._id,
            cardID: item.cardID
          };
        });
        CardsService.removeSelectedItems(selected);
        dispatch(setCards({ cards: newCards }));
        dispatch(setSelectedItems([]));
      },
      dialogTitle: "do you want to delete the items below?",
      dialogText: selectedItems.map((item, index) => (
        <Typography key={index}>{item.title}</Typography>
      ))
    });
  };

  const createCardHandle = async () => {
    return await CardsService.createCard(data)
      .then((res: any) => {
        dispatch(createCard(res.data));
        return true;
      })
      .catch((error: any) => {
        setError(true);
        setMessage(error.response.data);
        return false;
      });
  };
  return (
    <div className={classes.dialWrapper}>
      {!selectedItems.length ? (
        <SimpleModal
          onDialogAccept={createCardHandle}
          setError={setError}
          activator={({ setOpen }: any) => (
            <SpeedDial
              ariaLabel="create-card"
              onClick={() => setOpen(true)}
              className={`${classes.speedDial} ${classes.speedDialAdd}`}
              open={false}
              icon={<SpeedDialIcon />}
            />
          )}
        >
          <CreateCard
            error={error}
            setData={setData}
            message={message}
            user={userID}
          />
        </SimpleModal>
      ) : (
        <SpeedDial
          ariaLabel="remove"
          onClick={removeAction}
          className={`${classes.speedDial} ${classes.speedDialRemove}`}
          open={false}
          data-name="selected"
          icon={icon}
        />
      )}
    </div>
  );
}
const useStyles = makeStyles((theme) => ({
  dialWrapper: {
    position: "fixed",
    marginTop: theme.spacing(3),
    right: 0,
    bottom: 0,
    zIndex: 2
  },
  speedDial: {
    position: "absolute",
    opacity: "0.4",
    "&.MuiSpeedDial-directionUp, &.MuiSpeedDial-directionLeft": {
      bottom: theme.spacing(2),
      right: theme.spacing(2)
    },
    "&.MuiSpeedDial-directionDown, &.MuiSpeedDial-directionRight": {
      top: theme.spacing(2),
      left: theme.spacing(2)
    },
    "&:hover": {
      opacity: 1
    }
  },
  speedDialAdd: {
    "&.MuiFab-label": {
      width: "auto"
    }
  },
  speedDialRemove: {
    "&.MuiSpeedDial-root .MuiFab-primary": {
      backgroundColor: theme.palette.error.main
    },
    "&.MuiSpeedDial-root .MuiSvgIcon-root": {
      width: "100%",
      height: "53px",
      padding: "14px"
    }
  }
}));
