import { createStore, compose, applyMiddleware } from "redux";
// import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import getRootReducer from "./reducers";

const middleware = [thunk];
const getStore = (defaultStore) => {
  return createStore(
    getRootReducer(defaultStore),
    // composeWithDevTools(applyMiddleware(...middleware)) // :
    compose(applyMiddleware(...middleware))
  );
};
export default getStore;
