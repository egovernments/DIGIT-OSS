import { createStore, applyMiddleware } from "redux"
import { combineReducers } from "redux";
import storeConfigs from "egov-ui-kit/redux/store"
import citizenReducer from "./reducer"

const { rootReducer, middlewares } = storeConfigs

const store = createStore(combineReducers({
  ...rootReducer,
}), applyMiddleware(...middlewares))

export default store
