import {
  getTextField,
  getCommonContainer,
  getDateField,
  getCommonSubHeader
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { payeeDetails } from "./payeeDetails";

export const demandDraftDetails = getCommonContainer({
  ddNo: getTextField({
    label: {
      labelName: "DD No",
      labelKey: "TL_PAYMENT_DD_NO_LABEL"
    },
    placeholder: {
      labelName: "Enter DD  no.",
      labelKey: "TL_PAYMENT_DD_NO_PLACEHOLDER"
    },
    required: true
  }),
  ddDate: getDateField({
    label: { labelName: "DD Date", labelKey: "TL_PAYMENT_DD_DATE_LABEL" },
    placeholder: { labelName: "dd/mm/yy" },
    required: true
  }),
  ddIFSC: getTextField({
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

export const demandDraft = getCommonContainer({
  payeeDetails,
  header: getCommonSubHeader({
    labelName: "Demand Draft Details: ",
    labelKey: "TL_EMP_APPLICATION_DD_DETAILS"
  }),
  demandDraftDetails
});
