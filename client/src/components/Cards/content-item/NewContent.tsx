import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  updateItemContent,
  cancelNewContent,
  createItem,
  addAttachment,
  openItemContent
} from "store/actions/cardsActions";

import axios from "axios";

import { Resizable } from "re-resizable";

import Card from "@material-ui/core/Card";
import { List, ListItemText, Button } from "@material-ui/core";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";

import * as CardsService from "services/CardsService";

import Title from "components/Common/Title";
import Description from "components/Cards/content-item/ItemDescription";
import Attachments from "components/Cards/content-item/ItemAttachments";
import ItemSiteBar from "components/Cards/content-item/ItemSideBar";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import { useSnackbar } from "notistack";
import { isEmpty } from "lodash";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: "#fff"
    }
  })
);
export default function NewContent() {
  const { itemContentData } = useSelector((state: any) => state.cardsReducer);
  const classes = useStyles();
  const [width, setWidth] = useState(0);
  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();

  const onClose = () => {
    dispatch(cancelNewContent());
  };

  const onItemChange = (element: any, type: any) => {
    dispatch(
      updateItemContent({
        [type]: element
      })
    );
  };

  const onSaveDescription = (editorValue: any) => {
    dispatch(
      updateItemContent({
        description: editorValue
      })
    );
  };

  const createCardItem = async () => {
    setOpen(true);
    let response: any;
    return await CardsService.createItem(
      itemContentData.cardID,
      itemContentData
    )
      .then((responseItem: any) => {
        dispatch(createItem(responseItem.data.item));
        response = responseItem.data.item;
      })
      .then(() => {
        let array: Array<any> = [];
        itemContentData.attachments.forEach((file: any) => {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("itemID", response._id);
          formData.append("cardID", response.cardID);
          formData.append("userID", response.userID);
          array.push(formData);
        });
        if (!isEmpty(itemContentData.attachments)) {
          axios
            .all(
              array.map(async (file) => {
                return await CardsService.addFileToItem(file).then((res) => {
                  dispatch(addAttachment(res.data));
                });
              })
            )
            .then(() => {
              setOpen(false);
              onClose();
              dispatch(openItemContent({ itemID: response._id }));
              enqueueSnackbar("Item successfully created", {
                variant: "success",
                preventDuplicate: true
              });
            })
            .catch((e) => {
              enqueueSnackbar(e.response.data.message, {
                variant: "error",
                preventDuplicate: true
              });
            });
        } else {
          setOpen(false);
          onClose();
          dispatch(openItemContent({ itemID: response._id }));
          enqueueSnackbar("Item successfully created", {
            variant: "success",
            preventDuplicate: true
          });
        }
      })
      .catch((e: any) => {
        setOpen(false);
        enqueueSnackbar(e.response.data.message, {
          variant: "error",
          preventDuplicate: true
        });
      });
  };

  const onPostAttachments = (acceptedFiles: Array<any>, error: Array<any>) => {
    if (!isEmpty(error)) {
      enqueueSnackbar(error[0].errors[0].message, {
        variant: "error",
        preventDuplicate: true
      });
    }
    dispatch(
      updateItemContent({
        attachments: acceptedFiles
      })
    );
  };

  const onRemoveAttachment = (index: number) => {
    const newAttachments = itemContentData.attachments.filter(
      (item: any, i: number) => index !== i
    );
    dispatch(
      updateItemContent({
        attachments: newAttachments
      })
    );
  };

  return (
    <Resizable
      defaultSize={{
        width: "60%",
        height: "auto"
      }}
      enable={{
        left: true
      }}
      minWidth="50%"
      maxWidth="70%"
      className="item-content-wraper"
      onResizeStop={(e, direction, ref, d) => {
        setWidth(width + d.width);
      }}
    >
      <Card className="item-content-card">
        <div className="item-content-title">
          <List>
            <ListItemText
              primary={
                <Title
                  title={itemContentData.title}
                  onTitleChange={onItemChange}
                  isDefaultEdit={true}
                />
              }
              secondary={itemContentData.cardTitle}
            />
          </List>
          <div className="item-content-action">
            <Button onClick={createCardItem}>save</Button>
            <Button onClick={onClose}>Cancel</Button>
          </div>
        </div>
        <div className="flex space-between">
          <Attachments
            attachments={itemContentData.attachments}
            onPostAttachments={onPostAttachments}
            onRemoveAttachment={onRemoveAttachment}
            isNew={true}
          />

          <ItemSiteBar
            date={itemContentData.date}
            status={itemContentData.status}
            priority={itemContentData.priority}
            onItemChange={onItemChange}
            tags={itemContentData.labels || null}
          />
        </div>
        <Description
          description={itemContentData.description}
          onSaveDescription={onSaveDescription}
        />
      </Card>
      <Backdrop open={open} className={classes.backdrop}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Resizable>
  );
}
