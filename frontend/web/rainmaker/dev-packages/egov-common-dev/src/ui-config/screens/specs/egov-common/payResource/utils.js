import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { buttonJsonpath, numberPattern, componentJsonpath } from "./constants";
import get from "lodash/get";

export const validateAmountInput = (temp, pattern, action, dispatch, state) => {
  const totalAmount = get(state, "screenConfiguration.preparedFinalObject.ReceiptTemp[0].Bill[0].totalAmount");
    if (temp === 1 && totalAmount > 100) {
      handleValidation(
        action,
        numberPattern,
        dispatch,
        "Amount can't be less than 100",
        true,
        temp
      );
    } else if (temp === 3) {
      handleValidation(
        action,
        numberPattern,
        dispatch,
        "Amount can't be empty",
        true,
        temp
      );
    } else if (temp === 2) {
      handleValidation(action, pattern, dispatch, "Input field invalid", true, temp);
    } else {
      // handleButton(dispatch, false);
      handleValidation(action, pattern, dispatch, "", true, temp);
    }
  };
  
  export const getTemp = (action, state, pattern) => {
    const totalAmount = get(state, "screenConfiguration.preparedFinalObject.ReceiptTemp[0].Bill[0].totalAmount");
    if (action.value) {
      if (pattern.test(action.value) && parseInt(action.value) < 100 && totalAmount > 100) {
        return 1;
      }
      if (!pattern.test(action.value)) {
        return 2;
      }
    } else if(!action.value) {
      return 3;
    }
  };
  
  const handleButton = (dispatch, disabled) => {
    dispatch(handleField("pay", buttonJsonpath, "props.disabled", disabled));
  };
  
  const handleValidation = (action, pattern, dispatch, message, disabled, temp) => {
    dispatch(handleField("pay", action.componentJsonpath, "pattern", pattern));
    dispatch(handleField("pay", action.componentJsonpath, "isFieldValid", !disabled));
    dispatch(handleField("pay", action.componentJsonpath, "props.errorMessage", message));
    temp ? handleButton(dispatch, disabled) : handleButton(dispatch, false);
  };

  export const dispatchHandleField = (dispatch, property, value) => {
    dispatch(handleField("pay", componentJsonpath, property, value));
  }