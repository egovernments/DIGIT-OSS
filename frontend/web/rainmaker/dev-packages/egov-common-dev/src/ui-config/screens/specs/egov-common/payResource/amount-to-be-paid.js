import {
  getCommonGrayCard,
  getCommonSubHeader,
  getTextField,
  getCommonContainer,
  getPattern,
  getRadioButton
} from "egov-ui-framework/ui-config/screens/specs/utils";

const AmountToBePaid = getCommonGrayCard({
  header: getCommonSubHeader({
    labelName: "Amount to be Paid",
    labelKey: "PAY_AMOUNT_TO_BE_PAID"
  }),
  amountDetailsCardContainer: getCommonContainer({
    AmountToPaidButton: getRadioButton(
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

    displayAmount: getTextField({
      label: {
        labelName: "Amount to pay (Rs)",
        labelKey: "AMOUNT_TO_PAY"
      },
      pattern: getPattern("Amount"),
      jsonPath: "AmountPaid",
    })
  })
});

export default AmountToBePaid;
