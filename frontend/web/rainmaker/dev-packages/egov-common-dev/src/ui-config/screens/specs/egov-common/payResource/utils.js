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
export const validateAmountInput = (pattern, action, dispatch, state, minAmountPayable) => {
  const totalAmount = get(
    state,
    "screenConfiguration.preparedFinalObject.ReceiptTemp[0].Bill[0].totalAmount"
  );
  if (totalAmount > minAmountPayable) {
    const temp = getTemp(action, pattern , minAmountPayable);
    if (temp === 1) {
      handleValidation(
        action,
        numberPattern,
        dispatch,
        `AMOUNT_LESS_THAN_${minAmountPayable}`,
        true
      );
    } else if (temp === 3) {
      handleValidation(
        action,
        numberPattern,
        dispatch,
        "AMOUNT_EMPTY",
        true
      );
    } else if (temp === 2) {
      handleValidation(
        action,
        pattern,
        dispatch,
        "AMOUNT_INVALID",
        true
      );
    } else {
      handleValidation(action, pattern, dispatch, "", false);
    }
  } else if (totalAmount === undefined) {
    handleValidation(action, pattern, dispatch, "", true);
  }
};

export const getTemp = (action, pattern,minAmountPayable) => {
  if (action.value) {
    if (pattern.test(action.value) && parseInt(action.value) < minAmountPayable) {
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
