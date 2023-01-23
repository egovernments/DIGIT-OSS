import { applyMiddleware, combineReducers, compose, createStore } from "redux";
import thunk from "redux-thunk";
import { commonReducer } from "./reducers";

const getRootReducer = (defaultStore, moduleReducers) =>
  combineReducers({
    common: commonReducer(defaultStore),
    ...moduleReducers,
  });

const middleware = [thunk];

const composeEnhancers =
  typeof window === "object" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({}) : compose;

const enhancer = composeEnhancers(
  applyMiddleware(...middleware)
  // other store enhancers if any
);

const getStore = (defaultStore, moduleReducers = {}) => {
  return createStore(getRootReducer(defaultStore, moduleReducers), enhancer);
};
export default getStore;
