const formConfig = {
  name: "receiptInfo",
  fields: {
    receiptNo: {
      id: "receiptNo",
      type: "textfield",
      floatingLabelText: "TL_PAYMENT_RCPT_NO_LABEL",
      hintText: "TL_PAYMENT_RCPT_NO_PLACEHOLDER",
      jsonPath: "Receipt[0].Bill[0].billDetails[0].manualReceiptNumber",
    },
    receiptDate: {
      id: "receiptDate",
      type: "textfield",
      floatingLabelText: "TL_PAYMENT_RCPT_DATE_LABEL",
      hintText: "PT_DATE_HINT_TEXT",
      // pattern: /^(\+\d{1,2}\s)?\(?[6-9]\d{2}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/i,
      errorMessage: "",
      jsonPath: "Receipt[0].Bill[0].billDetails[0].manualReceiptDate",
    },
  },
  action: "",
  redirectionRoute: "",
  saveUrl: "",
  isFormValid: false,
};

export default formConfig;
