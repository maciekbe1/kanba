import React from "react";
import MenuItem from "@material-ui/core/MenuItem";
import { GoogleLogout } from "react-google-login";
import { signOut } from "store/actions/UserActions";
import { useDispatch, useSelector } from "react-redux";
import { GOOGLE_CLIENT } from "constants/user";

export default function Signout({ setAnchorEl }) {
  const dispatch = useDispatch();
  const loginType = useSelector((state) => state.authReducer.byGoogle);
  const logoutHandler = () => {
    setAnchorEl(null);
    dispatch(signOut());
  };
  return loginType ? (
    <GoogleLogout
      clientId={GOOGLE_CLIENT}
      onLogoutSuccess={logoutHandler}
      render={({ onClick }) => <MenuItem onClick={onClick}>Sign Out</MenuItem>}
    ></GoogleLogout>
  ) : (
    <MenuItem onClick={logoutHandler}>Sign Out</MenuItem>
  );
}
