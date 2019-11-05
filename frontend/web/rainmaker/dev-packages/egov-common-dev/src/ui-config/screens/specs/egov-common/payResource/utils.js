import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { buttonJsonpath, numberPattern } from "./constants";

export const validateAmountInput = (temp, pattern, action, dispatch) => {
    if (temp === 1 || temp === 3) {
      handleValidation(
        action,
        numberPattern,
        dispatch,
        temp === 1 ? "Amount can't be less than 100" : "Amount can't be empty",
        true
      );
    } else if (temp === 2) {
      handleValidation(action, pattern, dispatch, "Input field invalid", true);
    } else {
      handleButton(dispatch, false);
    }
  };
  
  export const getTemp = (action, pattern) => {
    if (action.value) {
      if (pattern.test(action.value) && parseInt(action.value) < 100) {
        return 1;
      }
      if (!pattern.test(action.value)) {
        return 2;
      }
    } else {
      return 3;
    }
  };
  
  const handleButton = (dispatch, disabled) => {
    dispatch(handleField("pay", buttonJsonpath, "props.disabled", disabled));
  };
  
  const handleValidation = (action, pattern, dispatch, message, disabled) => {
    dispatch(handleField("pay", action.componentJsonpath, "pattern", pattern));
    dispatch(handleField("pay", action.componentJsonpath, "isFieldValid", !disabled));
    dispatch(handleField("pay", action.componentJsonpath, "props.errorMessage", message));
    handleButton(dispatch, disabled);
  };