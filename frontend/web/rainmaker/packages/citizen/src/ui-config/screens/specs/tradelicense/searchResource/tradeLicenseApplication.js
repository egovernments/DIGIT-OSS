import {
  getCommonCard,
  getCommonTitle,
  getTextField,
  getCommonContainer,
  getCommonParagraph,
  getLabel,
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { searchApiCall } from "./functions";

export const tradeLicenseApplication = getCommonCard({
  subHeader: getCommonTitle({
    labelName: "Search Trade License Application",
    labelKey: "TL_HOME_SEARCH_RESULTS_HEADING",
  }),
  subParagraph: getCommonParagraph({
    labelName: "Provide at least one parameter to search for an application",
    labelKey: "TL_HOME_SEARCH_RESULTS_DESC",
  }),
  appTradeAndMobNumContainer: getCommonContainer({
    applicationNo: getTextField({
      label: {
        labelName: "Application No.",
        labelKey: "TL_HOME_SEARCH_RESULTS_APP_NO_LABEL",
      },
      placeholder: {
        labelName: "Enter Application No.",
        labelKey: "TL_HOME_SEARCH_RESULTS_APP_NO_PLACEHOLDER",
      },
      gridDefination: {
        xs: 12,
        sm: 4,
      },
      required: false,
      pattern: /^[a-zA-Z0-9-]*$/i,
      errorMessage: "ERR_INVALID_APPLICATION_NO",
      jsonPath: "searchScreen.applicationNumber",
    }),

    tradeLicenseNo: getTextField({
      label: {
        labelName: "Trade License No.",
        labelKey: "TL_HOME_SEARCH_RESULTS_TL_NO_LABEL",
      },
      placeholder: {
        labelName: "Enter Trade License No.",
        labelKey: "TL_HOME_SEARCH_RESULTS_TL_NO_PLACEHOLDER",
      },
      gridDefination: {
        xs: 12,
        sm: 4,
      },
      required: false,
      pattern: /^[a-zA-Z0-9-]*$/i,
      errorMessage: "ERR_INVALID_TRADE_LICENSE_NO",
      jsonPath: "searchScreen.licenseNumber",
    }),
  }),

  button: getCommonContainer({
    // firstCont: {

    buttonContainer: getCommonContainer({
      firstCont: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        gridDefination: {
          xs: 12,
          sm: 4,
        },
      },
      searchButton: {
        componentPath: "Button",
        gridDefination: {
          xs: 12,
          sm: 4,
        },
        props: {
          variant: "contained",
          style: {
            color: "white",

            backgroundColor: "rgba(0, 0, 0, 0.6000000238418579)",
            borderRadius: "2px",
            width: "80%",
            height: "48px",
          },
        },
        children: {
          buttonLabel: getLabel({
            labelName: "Search",
            labelKey: "TL_HOME_SEARCH_RESULTS_BUTTON_SEARCH",
          }),
        },
        onClickDefination: {
          action: "condition",
          callBack: searchApiCall,
        },
      },
      lastCont: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        gridDefination: {
          xs: 12,
          sm: 4,
        },
      },
    }),
  }),
});
