import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeItems } from "store/actions/cardsActions";
// import { useSnackbar } from "notistack";
import Button from "@material-ui/core/Button";
import { isEmpty } from "lodash";
const outsiteSelector = (items: any) => {
  return isEmpty(items);
};
export default function DeleteItems() {
  const dispatch = useDispatch();
  const deleteItems = () => dispatch(removeItems());
  // const { enqueueSnackbar } = useSnackbar();
  const selectedItems = useSelector((state: any) =>
    outsiteSelector(state.cardsReducer.selectedItems)
  );
  return (
    <div>
      <Button disabled={selectedItems} onClick={deleteItems}>
        remove items
      </Button>
    </div>
  );
}
