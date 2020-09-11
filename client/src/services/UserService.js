import * as API from "api/API";

export const signInService = (email, password) => {
  return API.request(`/api/auth`, {
    email,
    password
  });
};

export const getMeService = () => {
  return API.request(`/api/users/me`, null, "get");
};

export const signInGoogleService = (token) => {
  return API.request(`/api/auth/googleSignIn`, {
    token
  });
};
