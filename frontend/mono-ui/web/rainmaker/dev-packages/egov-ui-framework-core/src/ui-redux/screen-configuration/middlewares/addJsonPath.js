import { addComponentJsonpath } from "../../../ui-utils/commons";
import * as screenActionTypes from "../actionTypes";
import set from "lodash/set";

const addJsonPath = store => next => action => {
  const { type } = action;
  if (type === screenActionTypes.INIT_SCREEN) {
    addComponentJsonpath({...action.screenConfig.components});
    next(action);
  } else {
    next(action);
  }
};

export default addJsonPath;
