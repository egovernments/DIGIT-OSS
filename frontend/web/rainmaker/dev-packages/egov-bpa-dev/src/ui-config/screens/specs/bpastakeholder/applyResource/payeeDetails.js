import {
  getTextField,
  getSelectField,
  getCommonContainer
} from "egov-ui-framework/ui-config/screens/specs/utils";

export const payeeDetails = getCommonContainer({
  paidBy: getSelectField({
    label: {
      labelName: "Paid By",
      labelKey: "TL_EMP_APPLICATION_PAID_BY"
    },
    required: false,
    jsonPath: ""
  }),

  //"Paid By", "Paid By", false, ""),
  payerName: getTextField(
    {
      labelName: "Payer Name",
      labelKey: "TL_PAYMENT_PAYER_NAME_LABEL"
    },
    {
      labelName: "Enter Payer Name",
      labelKey: "TL_PAYMENT_PAYER_NAME_PLACEHOLDER"
    },
    false,
    ""
  ),
  payerMobileNo: getTextField(
    {
      labelName: "Payer Mobile No.",
      labelKey: "TL_PAYMENT_PAYER_MOB_LABEL"
    },
    {
      labelName: "Enter Payer Mobile No.",
      labelKey: "TL_PAYMENT_PAYER_MOB_PLACEHOLDER"
    },
    false,
    ""
  )
});
