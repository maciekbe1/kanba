import { applyMiddleware, createStore } from "redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import rootReducer from "store/reducers";
// import logger from "redux-logger";
import thunk from "redux-thunk";

const persistConfig = {
  key: "root",
  storage,
  blacklist: ["cardsReducer"]
};

let middleware = [];
if (window.location.hostname === "localhost") {
  // middleware = [...middleware, thunk, logger];
  middleware = [...middleware, thunk];
} else {
  middleware = [...middleware, thunk];
}
const persistedReducer = persistReducer(persistConfig, rootReducer);
const store = createStore(persistedReducer, applyMiddleware(...middleware));

export default store;
