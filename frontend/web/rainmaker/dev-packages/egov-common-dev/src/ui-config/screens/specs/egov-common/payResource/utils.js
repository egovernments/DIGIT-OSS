import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {
  paybuttonJsonpath,
  numberPattern,
  componentJsonpath
} from "./constants";
import get from "lodash/get";

const buttonJsonpath =
  paybuttonJsonpath +
  `${
    process.env.REACT_APP_NAME === "Citizen" ? "makePayment" : "generateReceipt"
  }`;
export const validateAmountInput = (pattern, action, dispatch, state) => {
  const totalAmount = get(
    state,
    "screenConfiguration.preparedFinalObject.ReceiptTemp[0].Bill[0].totalAmount"
  );
  if (totalAmount > 100) {
    const temp = getTemp(action, pattern);
    if (temp === 1) {
      handleValidation(
        action,
        numberPattern,
        dispatch,
        "Amount can't be less than 100",
        true
      );
    } else if (temp === 3) {
      handleValidation(
        action,
        numberPattern,
        dispatch,
        "Amount can't be empty",
        true
      );
    } else if (temp === 2) {
      handleValidation(
        action,
        pattern,
        dispatch,
        "Input field invalid",
        true
      );
    } else {
      handleValidation(action, pattern, dispatch, "", false);
    }
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
  } else if (!action.value) {
    return 3;
  }
};

const handleButton = (dispatch, disabled) => {
  dispatch(handleField("pay", buttonJsonpath, "props.disabled", disabled));
};

const handleValidation = (
  action,
  pattern,
  dispatch,
  message,
  disabled
) => {
  dispatch(handleField("pay", action.componentJsonpath, "pattern", pattern));
  dispatch(
    handleField("pay", action.componentJsonpath, "isFieldValid", !disabled)
  );
  dispatch(
    handleField("pay", action.componentJsonpath, "props.errorMessage", message)
  );
  dispatch(
    handleField("pay", action.componentJsonpath, "props.error", disabled)
  );
  handleButton(dispatch, disabled);
};

export const dispatchHandleField = (dispatch, property, value) => {
  dispatch(handleField("pay", componentJsonpath, property, value));
};
