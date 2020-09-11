import React, { useState, useMemo } from "react";

import ClearIcon from "@material-ui/icons/Clear";
import IconButton from "@material-ui/core/IconButton";
import filesize from "filesize";
import InsertDriveFileIcon from "@material-ui/icons/InsertDriveFile";

interface Props {
  file: any;
  onRemoveFromView: Function;
  index: number;
}

export default function ItemFile({ file, onRemoveFromView, index }: Props) {
  const [hovered, eventHandlers] = useHover();

  return (
    <div className="attachment-file" {...eventHandlers}>
      {file.type.includes("image") ? (
        <img src={file.content} alt="" />
      ) : (
        <InsertDriveFileIcon fontSize="large" />
      )}
      {hovered ? (
        <FileInfo
          file={file}
          onRemoveFromView={onRemoveFromView}
          index={index}
        />
      ) : null}
    </div>
  );
}

const FileInfo = ({ file, onRemoveFromView, index }: any) => {
  const remove = (e: any) => {
    e.stopPropagation();
    onRemoveFromView(index);
  };
  return (
    <div className="attachment-hover-container">
      <div className="attachment-name">{file.name}</div>
      <div className="attachment-size">
        <span>{filesize(file.size)}</span>
        <IconButton size="small" color="secondary" onClick={(e) => remove(e)}>
          <ClearIcon fontSize="small" />
        </IconButton>
      </div>
    </div>
  );
};

const useHover = () => {
  const [hovered, setHovered] = useState(false);

  const eventHandlers = useMemo(
    () => ({
      onMouseEnter: () => setHovered(true),
      onMouseLeave: () => setHovered(false)
    }),
    [setHovered]
  );

  return [hovered, eventHandlers];
};
