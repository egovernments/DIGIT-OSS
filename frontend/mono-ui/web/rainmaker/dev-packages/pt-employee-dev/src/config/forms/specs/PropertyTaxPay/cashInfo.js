const formConfig = {
  name: "cashInfo",
  fields: {
    paidBy: {
      id: "paidBy",
      required: true,
      hintText: "PT_COMMONS_SELECT_PLACEHOLDER",
      type: "singleValueList",
      floatingLabelText: "TL_EMP_APPLICATION_PAID_BY",
      jsonPath: "Receipt[0].Bill[0].payer",
      dropDownData: [{ label: "Owner", value: "Owner" }, { label: "Other", value: "Other" }],
      value: "",
    },
    payerName: {
      id: "payerName",
      type: "textfield",
      floatingLabelText: "TL_PAYMENT_PAYER_NAME_LABEL",
      hintText: "TL_PAYMENT_PAYER_NAME_PLACEHOLDER",
      jsonPath: "Receipt[0].Bill[0].paidBy",
      required: true,
      value: "",
    },
    payerMobile: {
      id: "ownerMobile",
      type: "textfield",
      floatingLabelText: "TL_PAYMENT_PAYER_MOB_LABEL",
      hintText: "PT_FORM3_MOBILE_NO_PLACEHOLDER",
      jsonPath: "Receipt[0].Bill[0].mobileNumber",
      required: true,
      pattern: /^([0]|((\+\d{1,2}[-]{0,1})))?\(?[6-9]\d{2}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/i,
      errorMessage: "PT_MOBILE_NUMBER_ERROR_MESSAGE",
      value: "",
    },
  },
  action: "",
  redirectionRoute: "",
  saveUrl: "",
  isFormValid: false,
};

export default formConfig;
