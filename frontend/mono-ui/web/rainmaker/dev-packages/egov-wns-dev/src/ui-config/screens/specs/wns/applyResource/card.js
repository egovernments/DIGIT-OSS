import {
  getTextField,
  getSelectField,
  getCommonContainer,
  getCommonSubHeader
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { payeeDetails } from "./payeeDetails";

export const cardDetails = getCommonContainer({
  last4Digits: getSelectField({
    label: {
      labelName: "Last 4 digits",
      labelKey: "TL_CARD_LAST_DIGITS_LABEL"
    },
    placeholder: {
      labelName: "Enter Last 4 digits of the card",
      labelKey: "TL_PAYMENT_LABEL_LAST_DIGITS"
    },
    required: true
  }),
  TrxNo: getTextField({
    label: {
      labelName: "Transaction No.",
      labelKey: "TL_PAYMENT_TRANS_NO_LABEL"
    },
    placeholder: {
      labelName: "Enter transaction no.",
      labelKey: "TL_PAYMENT_TRANS_NO_PLACEHOLDER"
    },
    required: true
  }),
  repeatTrxNo: getTextField({
    label: {
      labelName: "Re-Enter Transaction No.",
      labelKey: "TL_PAYMENT_RENTR_TRANS_LABEL"
    },
    placeholder: {
      labelName: "Enter transaction no.",
      labelKey: "TL_PAYMENT_TRANS_NO_PLACEHOLDER"
    },
    required: true
  })
});

export const card = getCommonContainer({
  payeeDetails,
  header: getCommonSubHeader({
    labelName: "Card Details:",
    labelKey: "TL_EMP_APPLICATION_CARD_DETAILS"
  }),
  cardDetails
});
