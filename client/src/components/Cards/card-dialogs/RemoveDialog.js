import React from "react";
import Dialog from "components/Utils/Dialog";

export default function RemoveDialog({ data, onClose, open }) {
  const onRemoveHandler = () => {
    onClose();
    data.remove();
  };
  return open ? (
    <Dialog
      open={open}
      onDialogClose={onClose}
      onDialogAccept={onRemoveHandler}
      dialogTitle={data.dialogTitle}
      dialogText={data.dialogText}
    />
  ) : null;
}
