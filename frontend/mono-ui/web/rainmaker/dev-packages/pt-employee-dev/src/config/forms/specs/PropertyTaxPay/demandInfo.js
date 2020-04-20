// import { setDependentFields } from "egov-ui-kit/config/forms/specs/PropertyTaxPay/utils/enableDependentFields";
const formConfig = {
  name: "demandInfo ",
  fields: {
    demandNo: {
      id: "demandNo",
      type: "textfield",
      floatingLabelText: "TL_PAYMENT_DD_NO_LABEL",
      hintText: "TL_PAYMENT_DD_NO_PLACEHOLDER",
      jsonPath: "Receipt[0].instrument.transactionNumber",
      pattern: /^([0-9]){6}$/i,
      errorMessage: "PT_DD_NUMBER_ERROR_MESSAGE",
      errorStyle: { position: "absolute", bottom: -8, zIndex: 5 },
      required: true,
      value: ""
    },
    demandDate: {
      id: "demandDate",
      type: "textfield",
      floatingLabelText: "TL_PAYMENT_DD_DATE_LABEL",
      hintText: "PT_DATE_HINT_TEXT",
      required: true,
      errorStyle: { position: "absolute", bottom: -8, zIndex: 5 },
      errorMessage: "",
      jsonPath: "Receipt[0].instrument.transactionDateInput",
      value: ""
    },
    ifscCode: {
      id: "ifscCode",
      type: "textFieldIcon",
      text: "CS_COMMON_SUBMIT",
      className: "pt-old-pid-text-field",
      floatingLabelText: "PT_IFSC_FLOATING_LABEL",
      hintText: "PT_IFSC_HINT_TEXT",
      required: true,
      numcols: 12,
      errorStyle: { position: "absolute", bottom: -8, zIndex: 5 },
      errorMessage: "PT_IFSC_ERROR_MESSAGE",
      jsonPath: "Receipt[0].instrument.ifscCode",
      pattern: /^[a-zA-Z0-9]{1,11}$/i,
      value: ""
    },
    BankName: {
      id: "BankName",
      required: true,
      hideField: true,
      type: "textfield",
      disabled: true,
      floatingLabelText: "TL_PAYMENT_BANK_LABEL",
      dropDownData: [{ label: "RBI", value: "10101" }],
      jsonPath: "Receipt[0].instrument.bank.name",
      value: ""
    },
    BankBranch: {
      id: "BankBranch",
      required: true,
      disabled: true,
      hideField: true,
      type: "textfield",
      floatingLabelText: "PT_BANK_BRANCH",
      jsonPath: "Receipt[0].instrument.branchName",
      value: ""
    }
  },
  action: "",
  redirectionRoute: "",
  saveUrl: "",
  isFormValid: false
};

export default formConfig;
