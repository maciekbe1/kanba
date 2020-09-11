import React, { useState } from "react";

import { useDropzone } from "react-dropzone";

import Button from "@material-ui/core/Button";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import AttachmentDialog from "components/Cards/content-item/AttachmentDialog";

import ItemFile from "components/Cards/content-item/ItemFile";

import AttachmentHelper from "helper/AttachmentHelper";
import { useSnackbar } from "notistack";

interface Props {
  onRemoveAttachment: Function;
  attachments: Array<any>;
  onPostAttachments: Function;
  isNew: boolean;
}

export default function Attachments({
  attachments,
  onPostAttachments,
  onRemoveAttachment,
  isNew
}: Props) {
  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const { enqueueSnackbar } = useSnackbar();

  const openAttachmentDialog = (number: number) => {
    setIndex(number);
    setDialogIsOpen(true);
  };

  const { getRootProps, getInputProps, open } = useDropzone({
    noClick: true,
    noKeyboard: true,
    multiple: true,
    maxSize: 15728640,
    onDrop: (acceptedFiles, error) => {
      const attachment = AttachmentHelper.attachmentURLCreator(acceptedFiles);
      if (isNew) {
        onPostAttachments([...attachments, ...attachment], error);
      } else {
        onPostAttachments(attachment, error);
      }
    }
  });

  const onRemoveFromView = (index: number) => {
    try {
      onRemoveAttachment(index);
    } catch (error) {
      enqueueSnackbar(error, {
        variant: "error",
        preventDuplicate: true
      });
    }
  };

  return (
    <div className="content-attachments-container">
      <div {...getRootProps({ className: "dropzone" })}>
        <input {...getInputProps()} />
        <Button onClick={open} variant="contained">
          <AttachFileIcon />
        </Button>
      </div>
      <div className="content-attachment-files">
        {attachments?.map((file: any, k: number) => (
          <div key={k} onClick={() => openAttachmentDialog(k)}>
            <ItemFile
              file={file}
              onRemoveFromView={onRemoveFromView}
              index={k}
            />
          </div>
        ))}
      </div>
      {attachments?.length && dialogIsOpen ? (
        <AttachmentDialog
          isOpen={dialogIsOpen}
          setDialogIsOpen={setDialogIsOpen}
          attachments={attachments}
          index={index}
        />
      ) : null}
    </div>
  );
}
