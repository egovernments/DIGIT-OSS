import { combineReducers, createStore, applyMiddleware, compose } from "redux";
import storeConfigs from "egov-ui-kit/redux/store";
import employeeReducer from "./reducer";

let { rootReducer, middlewares } = storeConfigs;

const store = createStore(
  combineReducers({
    ...rootReducer,
    employee: employeeReducer
  }),
  compose(
    applyMiddleware(...middlewares),
    window.devToolsExtension ? window.devToolsExtension() : f => f
  )
);

export default store;
