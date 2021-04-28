// import rootReducer from "./reducer";
// import { createStore, applyMiddleware,combineReducers,compose } from "redux";
// import thunk from "redux-thunk";

// let middlewares = [];

// middlewares = middlewares.concat(thunk);

// if (process.env.NODE_ENV === "development") {
//   const { logger } = require("redux-logger");
//   middlewares = middlewares.concat(logger);
// }

// const store = createStore(combineReducers({
//   ...rootReducer
// }),compose(
//    applyMiddleware(...middlewares),
//    window.devToolsExtension ? window.devToolsExtension() : f => f
//  ))
import store from "../../redux/store";

export default store;
