import React, { useCallback } from "react";
import { setSelectedItems } from "store/actions/cardsActions";
import Checkbox from "@material-ui/core/Checkbox";
import { useDispatch, useSelector } from "react-redux";

export default React.memo(function ItemCheckbox({ item }) {
  const selectedItems = useSelector(
    (state) => state.cardsReducer.selectedItems
  );
  const dispatch = useDispatch();

  const selectedHandler = useCallback(
    (e) => {
      e.target.checked
        ? dispatch(setSelectedItems([...selectedItems, item]))
        : dispatch(
            setSelectedItems(selectedItems.filter((i) => i._id !== item._id))
          );
    },
    [dispatch, item, selectedItems]
  );
  return (
    <Checkbox
      onChange={selectedHandler}
      checked={selectedItems.some((i) => i._id === item._id)}
    />
  );
});
