import React, { useState, useRef, useEffect } from "react";
import { Input } from "@material-ui/core";
import { useDispatch } from "react-redux";
import { updateItemContent } from "store/actions/cardsActions";
import { useSnackbar } from "notistack";

export default function CardTitle() {
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);
  const ref = useRef<any>(null);
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    ref.current.focus();
  }, []);
  const onTitleChange = (title: string) => {
    dispatch(
      updateItemContent({
        title: title
      })
    );
  };
  const onBlur = () => {
    if (value.length === 0) {
      setError(true);
      enqueueSnackbar("Title can not be empty.", {
        variant: "error",
        preventDuplicate: true
      });
      ref.current.focus();
    }
    onTitleChange(value);
  };
  const onKeyPress = (e: any) => {
    if (e.key === "Enter") {
      ref.current.blur();
    }
  };
  const onKeyDown = (e: any) => {
    if (e.keyCode === 27) {
      e.preventDefault();
      ref.current.blur();
    }
  };
  return (
    <div className={`title-component${error ? " --error" : ""}`}>
      <Input
        value={value}
        fullWidth
        disableUnderline
        onChange={(e) => {
          setValue(e.target.value);
          setError(false);
          if (e.target.value.length === 128) {
            enqueueSnackbar(
              "Title of Item cannot be more than 128 characters long",
              {
                variant: "info",
                preventDuplicate: true
              }
            );
          }
        }}
        inputRef={ref}
        onKeyPress={onKeyPress}
        onKeyDown={onKeyDown}
        onBlur={onBlur}
        inputProps={{
          maxLength: 128
        }}
        multiline
      />
    </div>
  );
}
