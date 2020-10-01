import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  updateItemContent,
  cancelNewContent,
  createItem,
  addAttachment,
  openItemContent
} from "store/actions/cardsActions";

import { Resizable } from "re-resizable";

import Card from "@material-ui/core/Card";
import { List, ListItemText } from "@material-ui/core";
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

  const createCardItem = async (description: string) => {
    setOpen(true);
    updateItemContent({
      description: description
    });
    try {
      const { priority, status, title, userID } = itemContentData;
      const responseItem = await CardsService.createItem({
        cardID: itemContentData.cardID,
        description,
        priority,
        status,
        title,
        userID
      });
      dispatch(createItem(responseItem.data.item));
      try {
        if (!isEmpty(itemContentData.attachments)) {
          let arrayOfFiles: Array<any> = [];
          itemContentData.attachments.forEach((file: any) => {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("itemID", responseItem.data.item._id);
            formData.append("cardID", responseItem.data.item.cardID);
            formData.append("userID", responseItem.data.item.userID);
            arrayOfFiles.push(formData);
          });
          const filesMap = arrayOfFiles.map(async (file) => {
            return await CardsService.addFileToItem(file);
          });
          let responseFiles: Array<any> = await Promise.all(filesMap);
          dispatch(
            addAttachment({
              itemID: responseItem.data.item._id,
              files: responseFiles.map((file) => file.data)
            })
          );
        }
      } catch (error) {
        setOpen(false);
        enqueueSnackbar(error.response.data.message, {
          variant: "error",
          preventDuplicate: true
        });
      }
      setOpen(false);
      onClose();
      dispatch(openItemContent({ itemID: responseItem.data.item._id }));
    } catch (error) {
      setOpen(false);
      enqueueSnackbar(error.response.data.message, {
        variant: "error",
        preventDuplicate: true
      });
    }
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
          {/* <div className="item-content-action">
            <Button onClick={createCardItem}>save</Button>
            <Button onClick={onClose}>Cancel</Button>
          </div> */}
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
          isNew={true}
          createCardItem={createCardItem}
          onClose={onClose}
        />
      </Card>
      <Backdrop open={open} className={classes.backdrop}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Resizable>
  );
}
