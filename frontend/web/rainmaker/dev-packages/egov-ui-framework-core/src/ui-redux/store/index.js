import rootReducer from "./reducer";
import { createStore, applyMiddleware,combineReducers } from "redux";
import thunk from "redux-thunk";
import screenConfigurationMiddleware from "../screen-configuration/middlewares";
import authMiddleware from "../auth/middlewares";
// import appMiddleware from "../app/middleware";

let middlewares = [];

middlewares = middlewares.concat(authMiddleware);
middlewares = middlewares.concat(screenConfigurationMiddleware);
// middlewares = middlewares.concat(appMiddleware);
middlewares = middlewares.concat(thunk);

if (process.env.NODE_ENV === "development") {
  const { logger } = require("redux-logger");
  middlewares = middlewares.concat(logger);
}

const store = createStore(combineReducers({
  ...rootReducer
}), applyMiddleware(...middlewares))

export default store
