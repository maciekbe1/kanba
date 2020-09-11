import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  Slide,
  DialogTitle
} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import ClearIcon from "@material-ui/icons/Clear";
import CheckIcon from "@material-ui/icons/Check";
export default function DialogWindow({
  open,
  onDialogClose,
  onDialogAccept,
  dialogTitle,
  dialogText
}) {
  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={onDialogClose}
      aria-labelledby="alert-dialog-slide-title"
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle id="alert-dialog-slide-title">{dialogTitle}</DialogTitle>
      <DialogContent>{dialogText}</DialogContent>
      <DialogActions>
        <IconButton
          onClick={onDialogClose}
          color="secondary"
          aria-label="reject"
        >
          <ClearIcon />
        </IconButton>
        <IconButton
          onClick={onDialogAccept}
          color="primary"
          aria-label="accept"
        >
          <CheckIcon />
        </IconButton>
      </DialogActions>
    </Dialog>
  );
}

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
