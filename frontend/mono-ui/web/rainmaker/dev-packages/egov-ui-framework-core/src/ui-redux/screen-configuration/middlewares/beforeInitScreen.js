import * as screenActionTypes from "../actionTypes";
import get from "lodash/get";

const beforeInitScreen = store => next =>async action => {
  const { type } = action;
  if (type === screenActionTypes.INIT_SCREEN) {
    const dispatch = store.dispatch;
    const state = store.getState();
    if (typeof get(action, "screenConfig.beforeInitScreen") === "function") {
      if (action.screenConfig.hasBeforeInitAsync) {
        action =await action.screenConfig.beforeInitScreen(action, state, dispatch);
      } else {
        action =action.screenConfig.beforeInitScreen(action, state, dispatch);
      }
    }
    next(action);
  } else {
    next(action);
  }
};

export default beforeInitScreen;
