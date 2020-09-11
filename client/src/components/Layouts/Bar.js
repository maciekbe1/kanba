import React from "react";
import { setBar } from "store/actions/layoutActions";
import { useSelector, useDispatch } from "react-redux";
import Alert from "@material-ui/lab/Alert";

export default function Bar() {
  const dispatch = useDispatch();
  const bar = useSelector((state) => state.layoutReducer.bar);

  const handleCloseBar = () => {
    dispatch(setBar({ type: null, message: null, active: false }));
  };
  return bar?.active ? (
    <Alert onClose={handleCloseBar} severity={bar.type}>
      {bar.message}
    </Alert>
  ) : null;
}
