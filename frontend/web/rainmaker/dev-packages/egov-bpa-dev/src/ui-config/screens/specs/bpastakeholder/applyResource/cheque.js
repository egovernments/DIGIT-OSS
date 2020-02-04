import {
  getTextField,
  getCommonContainer,
  getCommonSubHeader,
  getDateField
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { payeeDetails } from "./payeeDetails";

export const chequeDetails = getCommonContainer({
  chequeNo: getTextField({
    label: {
      labelName: "Cheque No",
      labelKey: "TL_PAYMENT_CHQ_NO_LABEL"
    },
    placeholder: {
      labelName: "Enter Cheque  no.",
      labelKey: "TL_PAYMENT_CHQ_NO_PLACEHOLDER"
    },
    required: true
  }),
  chequeDate: getDateField({
    label: { labelName: "Cheque Date", labelKey: "TL_PAYMENT_CHQ_DATE_LABEL" },
    placeholder: { labelName: "dd/mm/yy" },
    required: true
  }),
  chequeIFSC: getTextField({
    label: {
      labelName: "IFSC",
      labelKey: "TL_PAYMENT_IFSC_CODE_LABEL"
    },
    placeholder: {
      labelName: "Enter bank IFSC",
      labelKey: "TL_PAYMENT_IFSC_CODE_PLACEHOLDER"
    },
    required: true
  })
});

export const cheque = getCommonContainer({
  payeeDetails,
  header: getCommonSubHeader({
    labelName: "Cheque Details:",
    labelKey: "TL_EMP_APPLICATION_CHECK_DETAILS"
  }),
  chequeDetails
});
