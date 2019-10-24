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
            labelKey: "ABG_G8_RECEIPT_DETAILS_HEADER"
          })
        },
        g8ReceiptNo: getTextField({
          label: {
            labelName: "G8 Receipt No",
            labelKey: "ABG_G8_RECEIPT_NO_LABEL"
          },
          placeholder: {
            labelName: "Enter G8 receipt No",
            labelKey: "ABG_G8_RECEIPT_NO_PLACEHOLDER"
          },
  
          required: false,
          visible: true,
          pattern: getPattern("g8ReceiptNo "),
          errorMessage: "Invalid g8ReceiptNo.",
          jsonPath: "searchScreen.g8ReceiptNo"
        }),
        g8ReceiptIssueDate: getDateField({
          label: {
            labelName: "G8 receipt issue Date",
            labelKey: "ABG_G8_RECEIPT_ISSUE_DATE_LABEL"
          },
          placeholder: {
            labelName: "Enter G8 receipt Issue Date",
            labelKey: "ABG_SELECT_G8_RECEIPT_ISSUE_DATE_PLACEHOLDER"
          },
          gridDefination: {
            xs: 12,
            sm: 6
          },
          required: false,
          pattern: getPattern("Date"),
          jsonPath: "Licenses[0].g8ReceiptIssueDate"
        })
      }
    }
  });