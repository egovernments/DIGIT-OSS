import {
  getCommonGrayCard,
  getCommonSubHeader,
  getTextField,
  getCommonContainer,
  getPattern,
  getRadioButton
} from "egov-ui-framework/ui-config/screens/specs/utils";
import get from "lodash/get";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";

const AmountToBePaid = getCommonGrayCard({
  header: getCommonSubHeader({
    labelName: "Amount to be Paid",
    labelKey: "PAY_AMOUNT_TO_BE_PAID"
  }),
  amountDetailsCardContainer: getCommonContainer({
    AmountToPaidButton: {
      ...getRadioButton(
        [
          {
            labelName: "Full Amount",
            labelKey: "PAY_FULL_AMOUNT",
            value: "full_amount"
          },
          {
            label: "Partial Amount",
            labelKey: "PAY_PARTIAL_AMOUNT",
            value: "partial_amount"
          }
        ],
        "AmountType",
        "full_amount"
      ),
      beforeFieldChange: (action, state, dispatch) => {
        const componentJsonpath =
          "components.div.children.formwizardFirstStep.children.paymentDetails.children.cardContent.children.AmountToBePaid.children.cardContent.children.amountDetailsCardContainer.children.displayAmount";
        try {
          dispatch(
            handleField(
              "pay",
              componentJsonpath,
              "props.disabled",
              action.value === "full_amount" ? true : false
            )
          );
          const payload = get(
            state,
            "screenConfiguration.preparedFinalObject.ReceiptTemp[0].Bill[0]"
          );
          if (payload.totalAmount) {
            action.value === "full_amount"
              ? dispatch(
                  handleField(
                    "pay",
                    componentJsonpath,
                    "props.value",
                    payload.totalAmount
                  )
                )
              : "";
          }
        } catch (e) {
          console.log(e);
        }
      }
    },

    displayAmount: {
      ...getTextField({
        label: {
          labelName: "Amount to pay (Rs)",
          labelKey: "AMOUNT_TO_PAY"
        },
        pattern: getPattern("Amount"),
        jsonPath: "AmountPaid",
        props: {
          disabled: true
        }
      }),
      beforeFieldChange: (action, state, dispatch) => {
        let pattern = getPattern("Amount");
        let temp = getTemp(action, pattern);
        try {
          validateAmountInput(temp, pattern, action, dispatch);
        } catch (e) {
          console.log(e);
        }
      }
    }
  })
});

const validateAmountInput = (temp, pattern, action, dispatch) => {
  if (temp === 1 || temp === 3) {
    handleValidation(
      action,
      /^[0-9]{3,9}$/i,
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

const getTemp = (action, pattern) => {
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
  const buttonJsonpath = "components.div.children.footer.children.generateReceipt";
  dispatch(handleField("pay", buttonJsonpath, "props.disabled", disabled));
};

const handleValidation = (action, pattern, dispatch, message, disabled) => {
  dispatch(handleField("pay", action.componentJsonpath, "pattern", pattern));
  dispatch(handleField("pay", action.componentJsonpath, "isFieldValid", !disabled));
  dispatch(handleField("pay", action.componentJsonpath, "props.errorMessage", message));
  handleButton(dispatch, disabled);
};

export default AmountToBePaid;
