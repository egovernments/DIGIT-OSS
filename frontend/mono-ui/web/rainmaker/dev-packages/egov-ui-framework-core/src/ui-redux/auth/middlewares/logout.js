import * as authActionTypes from "../actionTypes";
import {setRoute} from "../../app/actions";
import {logoutRequest} from "../../../ui-utils";

const logout = (store) => (next) => async (action) => {
  const { type} = action;
  if (type === authActionTypes.LOGOUT) {
      const dispatch = store.dispatch;
      try {
        await logoutRequest();
      } catch (e) {
        console.log(e);
      }
      next(action);
      dispatch(setRoute("/egov-ui-framework/core/login"));
  } else {
    next(action);
  }
};

export default logout;
