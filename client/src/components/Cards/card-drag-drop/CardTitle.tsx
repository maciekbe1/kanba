import React, { useState, useRef, useEffect } from "react";
import { Input } from "@material-ui/core";
import { useDispatch } from "react-redux";
import * as CardsService from "services/CardsService";
import { updateCardProperties } from "store/actions/cardsActions";

export default function CardTitle({ title, cardID }: any) {
  const [value, setValue] = useState("");
  const ref = useRef<any>(null);
  const dispatch = useDispatch();
  useEffect(() => {
    setValue(title);
  }, [title]);
  const onTitleChange = (title: string, name: string) => {
    CardsService.updateCardProperties(cardID, title, name);
    dispatch(
      updateCardProperties({
        cardID,
        title
      })
    );
  };
  const onBlur = () => {
    if (value !== title && value.length !== 0) {
      onTitleChange(value, "title");
    } else {
      setValue(title);
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
    <div className="title-component">
      <Input
        value={value}
        fullWidth
        disableUnderline
        onChange={(e) => setValue(e.target.value)}
        inputRef={ref}
        onKeyPress={onKeyPress}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
      />
    </div>
  );
}
