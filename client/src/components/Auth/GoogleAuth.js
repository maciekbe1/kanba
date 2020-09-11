import React from "react";
import { GoogleLogin } from "react-google-login";
import * as UserService from "services/UserService";
import { useDispatch, useSelector } from "react-redux";
import { signIn } from "store/actions/UserActions";
import { GOOGLE_CLIENT } from "constants/user";
export default function GoogleAuth() {
  const dispatch = useDispatch();
  const isAuth = useSelector((state) => state.authReducer.isAuth);

  const responseGoogle = (response) => {
    const id_token = response.getAuthResponse().id_token;
    UserService.signInGoogleService(id_token).then(() => {
      UserService.getMeService().then((res) => {
        dispatch(
          signIn({
            isAuth: true,
            data: res.data,
            byGoogle: true
          })
        );
      });
    });
  };
  return (
    <GoogleLogin
      clientId={GOOGLE_CLIENT}
      buttonText="Login by Google"
      onSuccess={responseGoogle}
      onFailure={responseGoogle}
      cookiePolicy={"single_host_origin"}
      isSignedIn={isAuth}
    />
  );
}
