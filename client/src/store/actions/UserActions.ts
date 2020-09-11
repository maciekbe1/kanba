import { SIGNIN_USER, SIGNOUT_USER, UserTypes } from "store/types";
export const signOut = () => {
  return {
    type: SIGNOUT_USER
  };
};
export const signIn = (payload: any): UserTypes => {
  return {
    type: SIGNIN_USER,
    isAuth: payload.isAuth,
    data: payload.data,
    byGoogle: payload.byGoogle
  };
};
