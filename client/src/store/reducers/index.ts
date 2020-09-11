import { combineReducers } from "redux";
import authReducer from "store/reducers/authReducer";
import layoutReducer from "store/reducers/layoutReducer";
import cardsReducer from "store/reducers/cardsReducer";
const appReducer = combineReducers({
  authReducer,
  layoutReducer,
  cardsReducer
});

const rootReducer = (state: any, action: any) => {
  if (action.type === "SIGNOUT_USER") {
    state.cardsReducer = undefined;
  }
  return appReducer(state, action);
};
export default rootReducer;
