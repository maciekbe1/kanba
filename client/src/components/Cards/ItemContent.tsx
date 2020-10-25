import React, { useState } from "react";
import { Resizable } from "re-resizable";
import Card from "@material-ui/core/Card";
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";
import { List, ListItemText } from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import {
  updateItemProperties,
  closeItemContent,
  setPreviousItem,
  setNextItem
} from "store/actions/cardsActions";

import * as CardsService from "services/CardsService";

import ItemTitle from "components/Cards/content-item/ItemTitle";
import Description from "components/Cards/content-item/ItemDescription";
// import Attachments from "components/Cards/content-item/ItemAttachments";
import ItemSiteBar from "components/Cards/content-item/ItemSideBar";
import NewContent from "components/Cards/content-item/new-item/NewContent";

import { useHotkeys } from "react-hotkeys-hook";

export default function ItemContent() {
  const isContentOpen = useSelector(
    (state: any) => state.cardsReducer.isContentOpen
  );
  const isNewContentOpen = useSelector(
    (state: any) => state.cardsReducer.isNewContentOpen
  );
  return isContentOpen ? (
    <ContentView />
  ) : isNewContentOpen ? (
    <NewContent />
  ) : null;
}

function ContentView() {
  const [width, setWidth] = useState(0);
  const dispatch = useDispatch();
  const item = useSelector((state: any) => state.cardsReducer.itemContentData);

  const onItemChange = (element: any, type: string) => {
    CardsService.updateItemProperties(item._id, type, element);
    dispatch(
      updateItemProperties({
        itemID: item._id,
        [type]: element
      })
    );
  };

  const onClose = () => {
    dispatch(closeItemContent());
  };

  const onSaveDescription = (editorValue: string) => {
    CardsService.updateItemProperties(item._id, "description", editorValue);
    dispatch(
      updateItemProperties({
        itemID: item._id,
        description: editorValue
      })
    );
  };

  // const onPostAttachments = async (
  //   acceptedFiles: Array<any>,
  //   error: Array<any>
  // ) => {
  //   if (!isEmpty(error)) {
  //     enqueueSnackbar(error[0].errors[0].message, {
  //       variant: "error",
  //       preventDuplicate: true
  //     });
  //   }
  //   let arrayOfFiles: any[] = [];
  //   acceptedFiles.forEach((file: any) => {
  //     const formData = new FormData();
  //     formData.append("file", file);
  //     formData.append("itemID", item._id);
  //     formData.append("cardID", item.cardID);
  //     formData.append("userID", item.userID);
  //     arrayOfFiles.push(formData);
  //   });
  //   try {
  //     if (!isEmpty(arrayOfFiles)) {
  //       const filesMap = arrayOfFiles.map(
  //         async file => await CardsService.addFileToItem(file)
  //       );
  //       const responseFiles = await Promise.all(filesMap);
  //       dispatch(
  //         addAttachment({
  //           itemID: item._id,
  //           files: responseFiles.map((file: any) => file.data)
  //         })
  //       );
  //       enqueueSnackbar("File successfully added", {
  //         variant: "success",
  //         preventDuplicate: true
  //       });
  //     }
  //   } catch (error) {
  //     enqueueSnackbar(error.response.data.message, {
  //       variant: "error",
  //       preventDuplicate: true
  //     });
  //   }
  // };
  // const onRemoveAttachment = (index: number) => {
  //   const file = item.attachments[index];
  //   CardsService.removeFileFromItem(file.storageName, item._id, file._id)
  //     .then(() => {
  //       dispatch(removeAttachment({ itemID: item._id, index }));
  //     })
  //     .catch(error => {
  //       enqueueSnackbar(error.response.data.message, {
  //         variant: "error",
  //         preventDuplicate: true
  //       });
  //     });
  // };

  const getUp = () => {
    dispatch(setPreviousItem());
  };
  const getDown = () => {
    dispatch(setNextItem());
  };
  useHotkeys("shift+up", getUp);
  useHotkeys("shift+down", getDown);

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
        <div className="item-content-header flex w-100 space-between">
          <List className="w-100">
            <ListItemText
              primary={<ItemTitle itemID={item._id} title={item.title} />}
              secondary={item.cardTitle}
            />
          </List>
          <div>
            <IconButton
              color="default"
              onClick={onClose}
              className="item-content-action"
              size="medium"
            >
              <CloseIcon />
            </IconButton>
          </div>
        </div>
        <div className="flex justify-end">
          {/* <Attachments
            attachments={item.attachments}
            onPostAttachments={onPostAttachments}
            onRemoveAttachment={onRemoveAttachment}
            isNew={false}
          /> */}
          <ItemSiteBar
            date={item.date}
            status={item.status}
            priority={item.priority}
            onItemChange={onItemChange}
            tags={item.labels || null}
          />
        </div>
        <Description
          onSaveDescription={onSaveDescription}
          isNew={false}
          description={item.description}
        />
      </Card>
    </Resizable>
  );
}
