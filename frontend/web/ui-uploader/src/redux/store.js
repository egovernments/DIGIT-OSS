import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import rootReducer from "./combineReducers";

const middlewares = [];

middlewares.push(thunk);

if (process.env.NODE_ENV === "development") {
  const { logger } = require("redux-logger");
  middlewares.push(logger);
}

const store = createStore(rootReducer, applyMiddleware(...middlewares));

export default store;
