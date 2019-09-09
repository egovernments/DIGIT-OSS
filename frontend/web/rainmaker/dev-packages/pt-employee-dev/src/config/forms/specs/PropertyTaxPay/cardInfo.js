const formConfig = {
  name: "cardInfo",
  fields: {
    cardDigits: {
      id: "demandNo",
      type: "textfield",
      floatingLabelText: "TL_CARD_LAST_DIGITS_LABEL",
      hintText: "TL_PAYMENT_LABEL_LAST_DIGITS",
      required: true,
      pattern: /^([0-9]){4}$/i,
      jsonPath: "Receipt[0].instrument.instrumentNumber",
      errorStyle: { position: "absolute", bottom: -8, zIndex: 5 },
      errorMessage: "PT_FOUR_DIGIT_ERROR_MESSAGE",
      value: "",
    },
    receiptNo: {
      id: "receiptNo",
      required: true,
      type: "textfield",
      floatingLabelText: "TL_PAYMENT_TRANS_NO_LABEL",
      hintText: "TL_PAYMENT_TRANS_NO_PLACEHOLDER",
      errorStyle: { position: "absolute", bottom: -8, zIndex: 5 },
      jsonPath: "Receipt[0].instrument.transactionNumber",
      value: "",
    },
    confirmReceiptNo: {
      id: "receiptNo",
      required: true,
      type: "textfield",
      floatingLabelText: "TL_PAYMENT_RENTR_TRANS_LABEL",
      errorStyle: { position: "absolute", bottom: -8, zIndex: 5 },
      hintText: "TL_PAYMENT_TRANS_NO_PLACEHOLDER",
      jsonPath: "Receipt[0].instrument.transactionNumberConfirm",
      value: "",
    },
  },
  action: "",
  redirectionRoute: "",
  saveUrl: "",
  isFormValid: false,
};

export default formConfig;
