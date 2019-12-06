import {
  getCommonCard,
  getSelectField,
  getCommonContainer,
  getLabel
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { searchApiCall } from "./functions";

const hasButton = getQueryArg(window.location.href, "hasButton");
let enableButton = hasButton && hasButton === "false" ? false : true;

export const billGenSearchCard = getCommonCard({
  searchContainer: getCommonContainer({
    year: getSelectField({
      label: {
        labelName: "Year",
        labelKey: "ABG_YEAR_LABEL"
      },
      placeholder: {
        labelName: "Select Year",
        labelKey: "ABG_YEAR_PLACEHOLDER"
      },
      required: true,
      visible: true,
      jsonPath: "searchScreen.year",
      gridDefination: {
        xs: 12,
        sm: 4
      },
      data: [
        {
          code: "2018-19"
        },
        {
          code: "2019-20"
        }
      ]
    }),
    service: getSelectField({
      label: {
        labelName: "Service",
        labelKey: "ABG_SERVICE_LABEL"
      },
      placeholder: {
        labelName: "Select Service",
        labelKey: "ABG_SERVICE_PLACEHOLDER"
      },
      required: true,
      jsonPath: "searchScreen.service",
      gridDefination: {
        xs: 12,
        sm: 4
      },
      data: [
        {
          code: "service-1"
        },
        {
          code: "service-2"
        }
      ]
    }),
    ulb: getSelectField({
      label: {
        labelName: "ULB",
        labelKey: "ABG_ULB_LABEL"
      },
      placeholder: {
        labelName: "Select ULB",
        labelKey: "ABG_ULB_PLACEHOLDER"
      },
      required: true,
      jsonPath: "searchScreen.ulb",
      gridDefination: {
        xs: 12,
        sm: 4
      },
      data: [
        {
          code: "ULB-1"
        },
        {
          code: "ULB-2"
        }
      ]
    }),
    locMohalla: getSelectField({
      label: {
        labelName: "Location/Mohalla",
        labelKey: "NOC_APPLICATION_NOC_LABEL"
      },
      placeholder: {
        labelName: "Select Location/Mohalla",
        labelKey: "NOC_APPLICATION_PLACEHOLDER"
      },
      required: false,
      jsonPath: "searchScreen.locMohalla",
      gridDefination: {
        xs: 12,
        sm: 4
      },
      data: [
        {
          code: "Ajit Nagar"
        },
        {
          code: "Cinema road-1"
        }
      ]
    })
  }),

  button: getCommonContainer({
    buttonContainer: getCommonContainer({
      firstCont: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        gridDefination: {
          xs: 12,
          sm: 4
        }
      },
      searchButton: {
        componentPath: "Button",
        gridDefination: {
          xs: 12,
          sm: 4
          // align: "center"
        },
        props: {
          variant: "contained",
          style: {
            color: "white",
            backgroundColor: "#FE7A51",
            borderRadius: "2px",
            width: window.innerWidth > 480 ? "80%" : "100%",
            height: "48px"
          }
        },
        children: {
          buttonLabel: getLabel({
            labelName: "GENERATE BILL",
            labelKey: "NOC_HOME_SEARCH_RESULTS_BUTTON_SEARCH"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: searchApiCall
        }
      },
      lastCont: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        gridDefination: {
          xs: 12,
          sm: 4
        }
      }
    })
  })
});
