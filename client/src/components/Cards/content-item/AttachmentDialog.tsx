import React from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";

import Dialog from "@material-ui/core/Dialog";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";
import { TransitionProps } from "@material-ui/core/transitions";
import InsertDriveFileIcon from "@material-ui/icons/InsertDriveFile";
import filesize from "filesize";
import FileSaver from "file-saver";

const useStyles = makeStyles((theme: any) => ({
  appBar: {
    position: "relative"
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1
  }
}));

const Transition = React.forwardRef<unknown, TransitionProps>(
  function Transition(props: any, ref: any) {
    return <Slide direction="up" ref={ref} {...props} />;
  }
);

export default function FullScreenDialog({
  isOpen,
  setDialogIsOpen,
  attachments,
  index
}: any) {
  const classes = useStyles();
  const theme = useTheme();

  const save = () => {
    var file = new File([attachments[index].name], attachments[index].name, {
      type: attachments[index].type
    });
    FileSaver.saveAs(file);
    handleClose();
  };
  const handleClose = () => {
    setDialogIsOpen(false);
  };

  return (
    <Dialog
      fullScreen
      open={isOpen}
      onClose={handleClose}
      TransitionComponent={Transition}
    >
      <AppBar
        className={classes.appBar}
        color={theme.palette.type === "dark" ? "default" : "primary"}
      >
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            {attachments[index].name}
          </Typography>
          <span style={{ marginRight: "10px" }}>
            {filesize(attachments[index].size)}
          </span>
          <Button color="inherit" onClick={save} variant="outlined">
            Save
          </Button>
        </Toolbar>
      </AppBar>

      <div className="dialog-photo">
        {attachments[index].type.includes("image") ? (
          <img src={attachments[index].content} alt="" />
        ) : (
          <InsertDriveFileIcon fontSize="large" />
        )}
      </div>
    </Dialog>
  );
}
