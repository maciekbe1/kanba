import React, { useState } from "react";
import SpeedDial from "@material-ui/lab/SpeedDial";
import SpeedDialIcon from "@material-ui/lab/SpeedDialIcon";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector, useDispatch } from "react-redux";
import * as CardsService from "services/CardsService";

import SimpleModal from "components/Utils/Modal";
import { createCard } from "store/actions/cardsActions";
import CreateCard from "components/Cards/card-dialogs/CreateCardDialog";
import { UserTypes, CardsTypes } from "store/types";

interface RootState {
  authReducer: UserTypes;
  cardsReducer: CardsTypes;
}

export default function SideDial() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const userID = useSelector((state: RootState) => state.authReducer.data._id);

  const [error, setError] = useState(false);
  const [message, setMessage] = useState("");
  const [data, setData] = useState();

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
  }
}));
