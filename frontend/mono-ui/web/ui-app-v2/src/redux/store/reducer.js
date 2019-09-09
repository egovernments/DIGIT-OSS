import { combineReducers } from "redux";

import app from "../app/reducer";
import auth from "../auth/reducer";
import form from "../form/reducer";
import complaints from "../complaints/reducer";
import common from "../common/reducer";
import mdms from "../mdms/reducer";

const rootReducer = combineReducers({
  app,
  auth,
  form,
  complaints,
  common,
  mdms,
});

export default rootReducer;
