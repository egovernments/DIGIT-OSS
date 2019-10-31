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
        const componentJsonpath = "components.div.children.formwizardFirstStep.children.paymentDetails.children.cardContent.children.AmountToBePaid.children.cardContent.children.amountDetailsCardContainer.children.displayAmount";
        try {
          dispatch(
            handleField("pay", componentJsonpath, "props.disabled", action.value === "full_amount" ? true:false)
          );
          const payload = get(state, "screenConfiguration.preparedFinalObject.ReceiptTemp[0].Bill[0]");
          if(payload.totalAmount){
            action.value === "full_amount" ? dispatch(handleField("pay", componentJsonpath, "props.value", payload.totalAmount)) : "";
          }
        } catch (e) {
          console.log(e);
        }
      }
    },

    displayAmount: getTextField({
      label: {
        labelName: "Amount to pay (Rs)",
        labelKey: "AMOUNT_TO_PAY"
      },
      pattern: getPattern("Amount"),
      jsonPath: "AmountPaid",
      props: {
        disabled: true
      }
    })
  })
});

export default AmountToBePaid;
