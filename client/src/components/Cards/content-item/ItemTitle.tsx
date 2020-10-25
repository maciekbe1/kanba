import React, { useState, useRef, useEffect } from "react";
import { Input } from "@material-ui/core";
import { useDispatch } from "react-redux";
import * as CardsService from "services/CardsService";
import { updateItemProperties } from "store/actions/cardsActions";
import { useSnackbar } from "notistack";

interface Props {
  title: string;
  itemID: string;
}

export default function CardTitle({ title, itemID }: Props) {
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);

  const ref = useRef<any>(null);
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    setValue(title);
  }, [title]);
  const onTitleChange = (title: string, name: string) => {
    CardsService.updateItemProperties(itemID, title, name);
    dispatch(
      updateItemProperties({
        itemID,
        title
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
    } else {
      onTitleChange(value, "title");
    }
  };
  const onKeyPress = (e: any) => {
    if (e.key === "Enter") {
      ref.current.blur();
    }
  };
  const onKeyDown = (e: any) => {
    if (e.keyCode === 27) {
      setValue(title);
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
        onBlur={onBlur}
        onKeyPress={onKeyPress}
        onKeyDown={onKeyDown}
        inputProps={{
          maxLength: 128
        }}
      />
    </div>
  );
}
