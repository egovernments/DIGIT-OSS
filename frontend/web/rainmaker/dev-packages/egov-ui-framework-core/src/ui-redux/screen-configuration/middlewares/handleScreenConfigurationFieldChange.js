import * as screenActionTypes from "../actionTypes";
import { addComponentJsonpath } from "../../../ui-utils/commons";
import get from "lodash/get";
import set from "lodash/set";
import {validate} from "../utils";

const handleScreenConfigurationFieldChange = (store) => (next) => (action) => {
  const { type} = action;
  if (type === screenActionTypes.HANDLE_SCREEN_CONFIGURATION_FIELD_CHANGE && action.property==="props.value") {
      const { screenKey,componentJsonpath,value } = action;
      const dispatch = store.dispatch;
      const state = store.getState();
      const componentObject=get(state,`screenConfiguration.screenConfig.${screenKey}.${componentJsonpath}`);
      validate(screenKey,{...componentObject,value},dispatch);
      next(action);
  }
  else if (type === screenActionTypes.HANDLE_SCREEN_CONFIGURATION_FIELD_CHANGE && action.value && action.value.children) {
    set(action,"value.componentJsonpath",`${action.componentJsonpath}.${action.property}`);
    addComponentJsonpath(action.value.children,`${action.componentJsonpath}.${action.property}.children`)
    next(action);
  }
  else {
    next(action);
  }
};

export default handleScreenConfigurationFieldChange;
