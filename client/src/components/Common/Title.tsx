import React, { useState, useRef, useEffect } from "react";

import Button from "@material-ui/core/Button";
import { Done, Clear } from "@material-ui/icons";
import { cloneDeep } from "lodash";

interface Props {
  title: string;
  onTitleChange: Function;
  isDefaultEdit?: boolean;
}
export default function Title({ title, onTitleChange, isDefaultEdit }: Props) {
  const [value, setValue] = useState("");
  const [editable, setEditable] = useState(false);

  const ref = useRef<any>(null);

  useEffect(() => {
    setValue(title);
  }, [title]);

  useEffect(() => {
    if (isDefaultEdit) {
      defaultEdit();
    }
    // eslint-disable-next-line
  }, []);

  useOutsideEvent(ref);

  const defaultEdit = () => {
    ref.current.contentEditable = true;
    ref.current.focus();
    setEditable(true);
    document.execCommand("selectAll", false, undefined);
  };

  const onMouseDown = (e: any) => {
    e.stopPropagation();
    ref.current.contentEditable = true;
    ref.current.focus();
    setValue(ref.current.textContent);
    setEditable(true);
  };

  const onKeyPress = (e: any) => {
    if (e.key === "Enter") {
      ref.current.blur();
    }
  };

  const onBlur = () => {
    setEditable(false);
    if (ref.current.textContent.length === 0) {
      ref.current.textContent = cloneDeep(value);
    }
    if (ref.current.textContent !== value) {
      onTitleChange(ref.current.textContent, "title");
      setValue(ref.current.textContent);
    }
  };

  const onPaste = (e: any) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text");
    document.execCommand("insertText", false, text);
  };

  const onClikcAccept = () => {
    ref.current.blur();
  };

  const onClikcDiscard = () => {
    ref.current.textContent = cloneDeep(value);
    ref.current.contentEditable = false;
    setEditable(false);
    ref.current.blur();
  };

  return (
    <div className="title-component">
      <span
        ref={ref}
        onMouseDown={onMouseDown}
        onKeyPress={onKeyPress}
        onBlur={onBlur}
        onPaste={onPaste}
        className="title"
      >
        {title}
      </span>
      {editable ? (
        <div className="icons-wrapper">
          <Button
            size="small"
            onMouseDown={onClikcAccept}
            variant="contained"
            style={{
              marginRight: "2px",
              padding: "2px",
              minWidth: "10px"
            }}
          >
            <Done className="icon" />
          </Button>
          <Button
            variant="contained"
            size="small"
            onMouseDown={onClikcDiscard}
            style={{
              marginLeft: "2px",
              padding: "2px",
              minWidth: "10px"
            }}
          >
            <Clear className="icon" />
          </Button>
        </div>
      ) : null}
    </div>
  );
}

function useOutsideEvent(ref: any) {
  function handleClickOutside(event: any) {
    if (ref.current && !ref.current.contains(event.target)) {
      ref.current.setEditable = false;
      ref.current.blur();
    }
  }
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });
}
