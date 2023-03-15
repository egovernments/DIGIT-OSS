import {
  getCommonGrayCard,
  getCommonSubHeader,
  getTextField,
  getPattern,
  getDateField
} from "egov-ui-framework/ui-config/screens/specs/utils";

export const G8ReceiptDetails = getCommonGrayCard({
  header: {
    uiFramework: "custom-atoms",
    componentPath: "Container",
    props: {
      style: { marginBottom: "10px" }
    },
    children: {
      header: {
        gridDefination: {
          xs: 8
        },
        ...getCommonSubHeader({
          labelName: "G8 Receipt Details(optional)",
          labelKey: "UC_G8_RECEIPT_DETAILS_HEADER"
        })
      },
      g8ReceiptNo: getTextField({
        label: {
          labelName: "G8 Receipt No",
          labelKey: "UC_G8_RECEIPT_NO_LABEL"
        },
        placeholder: {
          labelName: "Enter G8 receipt No",
          labelKey: "UC_G8_RECEIPT_NO_PLACEHOLDER"
        },

        required: false,
        visible: true,
        pattern: getPattern("g8ReceiptNo "),
        errorMessage: "Invalid g8ReceiptNo.",
        jsonPath: "ReceiptTemp[0].Bill[0].billDetails[0].manualReceiptNumber"
      }),
      g8ReceiptIssueDate: getDateField({
        label: {
          labelName: "G8 receipt issue Date",
          labelKey: "UC_G8_RECEIPT_ISSUE_DATE"
        },
        placeholder: {
          labelName: "Enter G8 receipt Issue Date",
          labelKey: "UC_SELECT_G8_RECEIPT_ISSUE_DATE_PLACEHOLDER"
        },
        gridDefination: {
          xs: 12,
          sm: 6
        },
        required: false,
        pattern: getPattern("Date"),
        jsonPath: "ReceiptTemp[0].Bill[0].billDetails[0].manualReceiptDate"
      })
    }
  }
});
