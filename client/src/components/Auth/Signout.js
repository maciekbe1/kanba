import React from "react";
import MenuItem from "@material-ui/core/MenuItem";
import { signOut } from "store/actions/UserActions";
import { useDispatch } from "react-redux";

export default function Signout({ setAnchorEl }) {
  const dispatch = useDispatch();
  const logoutHandler = () => {
    setAnchorEl(null);
    dispatch(signOut());
  };
  return <MenuItem onClick={logoutHandler}>Sign Out</MenuItem>;
}
