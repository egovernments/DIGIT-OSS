import {
  getCommonGrayCard,
  getCommonSubHeader,
  getTextField,
  getDateField,
  getCommonContainer,
  getPattern
} from "egov-ui-framework/ui-config/screens/specs/utils";

const g8Details = getCommonGrayCard({
  header: getCommonSubHeader({
    labelName: "GEN/G8 Receipt Details (Optional)",
    labelKey: "NOC_PAYMENT_RCPT_DETAILS"
  }),
  receiptDetailsCardContainer: getCommonContainer({
    receiptNo: getTextField({
      label: {
        labelName: "GEN/G8 Receipt No.",
        labelKey: "NOC_PAYMENT_RCPT_NO_LABEL"
      },
      placeholder: {
        labelName: "Enter GEN/G8 Receipt No.",
        labelKey: "NOC_PAYMENT_RCPT_NO_PLACEHOLDER"
      },
      // Pattern validation for the reciept
      jsonPath: "ReceiptTemp[0].Bill[0].billDetails[0].manualReceiptNumber"
    }),
    receiptIssueDate: getDateField({
      label: {
        labelName: "GEN/G8 Receipt Issue Date",
        labelKey: "NOC_PAYMENT_RECEIPT_ISSUE_DATE_LABEL"
      },
      placeholder: {
        labelName: "dd/mm/yy",
        labelKey: "NOC_PAYMENT_RECEIPT_ISSUE_DATE_PLACEHOLDER"
      },
      pattern: getPattern("Date"),
      errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
      jsonPath: "ReceiptTemp[0].Bill[0].billDetails[0].manualReceiptDate"
    })
  })
});

export default g8Details;
