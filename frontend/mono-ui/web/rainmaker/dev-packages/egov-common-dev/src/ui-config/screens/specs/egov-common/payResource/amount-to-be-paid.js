import {
  getCommonGrayCard,
  getCommonSubHeader,
  getTextField,
  getCommonContainer,
  getPattern,
  getRadioButton,
  getBreak
} from "egov-ui-framework/ui-config/screens/specs/utils";
import get from "lodash/get";
import { validateAmountInput, dispatchHandleField } from "./utils";
import "./index.css";

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
            label: "Custom Amount",
            labelKey: "PAY_CUSTOM_AMOUNT",
            value: "partial_amount"
          }
        ],
        "AmountType",
        "full_amount"
      ),
      beforeFieldChange: (action, state, dispatch) => {
        try {
          dispatchHandleField(dispatch, "props.disabled", action.value === "full_amount" ? true : false);
          const payload = get(
            state,
            "screenConfiguration.preparedFinalObject.ReceiptTemp[0].Bill[0]"
          );
          if (payload && payload.totalAmount && action.value === "full_amount") {
            dispatchHandleField(dispatch, "props.value", payload.totalAmount);
          }
        } catch (e) {
          console.log(e);
        }
      }
    },
    lineBreak: getBreak(),
    displayAmount: {
      ...getTextField({
        label: {
          labelName: "Amount to pay (Rs)",
          labelKey: "AMOUNT_TO_PAY"
        },
        pattern: getPattern("Amount"),
        jsonPath: "AmountPaid",
        // required: true,
        props: {
          disabled: true,
          className: 'pay-amount-text-field'
        }
      }),
      beforeFieldChange: (action, state, dispatch) => {
        const pattern = getPattern("Amount");
        const minAmountPayable = get(state.screenConfiguration.preparedFinalObject , "businessServiceInfo.minAmountPayable");
        try {
          validateAmountInput(pattern, action, dispatch, state , minAmountPayable);
        } catch (e) {
          console.log(e);
        }
      }
    }
  })
});

export default AmountToBePaid;
