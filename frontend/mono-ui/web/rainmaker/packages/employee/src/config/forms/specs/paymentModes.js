import { removeForm } from "egov-ui-kit/redux/form/actions";
import { toggleSnackbarAndSetText } from "egov-ui-kit/redux/app/actions";

const formConfig = {
  name: "paymentModes",
  fields: {
    mode: {
      id: "mode",
      jsonPath: "Receipt[0].instrument.instrumentType.name",
      required: true,
      type: "singleValueList",
      floatingLabelText: "PT_MODE_OF_PAYMENT",
      hintText: "PT_SELECT_PAYMENT_MODE",
      localePrefix: {
        moduleName: "PT",
        masterName: "PAYMENT_METHOD",
      },
      dropDownData: [
        { label: "PT_PAYMENT_METHOD_CASH", value: "Cash" },
        { label: "PT_PAYMENT_METHOD_DD", value: "DD" },
        { label: "PT_PAYMENT_METHOD_CHEQUE", value: "Cheque" },
        { label: "PT_PAYMENT_METHOD_CARD", value: "Card" },
      ],
      value: "Cash",
      beforeFieldChange: ({ dispatch, state, action }) => {
        const formKeysInRedux = state && state.form && Object.keys(state.form);
        let formsToRemove = [];
        switch (action.value) {
          case "Cash":
            formsToRemove.push("demandInfo", "chequeInfo", "cardInfo");
            break;
          case "DD":
            formsToRemove.push("chequeInfo", "cardInfo");
            break;
          case "Cheque":
            formsToRemove.push("demandInfo", "cardInfo");
            break;
          case "Card":
            formsToRemove.push("demandInfo", "chequeInfo");
            break;
          default:
            formsToRemove.push("demandInfo", "chequeInfo", "cardInfo");
            break;
        }
        formsToRemove.forEach((item) => {
          if (formKeysInRedux.indexOf(item) > -1) {
            dispatch(removeForm(item));
          }
        });
        dispatch(toggleSnackbarAndSetText(false, "", "success"));
        return action;
      },
    },
  },
  action: "",
  redirectionRoute: "",
  saveUrl: "",
  isFormValid: false,
};

export default formConfig;
