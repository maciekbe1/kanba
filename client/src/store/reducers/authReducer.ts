const INITIAL_DATA = {
  isAuth: false,
  data: null,
  byGoogle: false
};
export default (state: any = INITIAL_DATA, action: any) => {
  switch (action.type) {
    case "SIGNIN_USER":
      return {
        ...state,
        isAuth: action.isAuth,
        data: action.data,
        byGoogle: action.byGoogle
      };
    case "SIGNOUT_USER":
      return {
        ...state,
        isAuth: false,
        data: null,
        byGoogle: false
      };
    default:
      return state;
  }
};
