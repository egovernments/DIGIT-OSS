import {
  getCommonCard,

  getCommonContainer,



  getCommonHeader,
  getCommonSubHeader, getLabel, getPattern, getTextField
} from "egov-ui-framework/ui-config/screens/specs/utils";
import {
  handleScreenConfigurationFieldChange as handleField
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { searchApiCall } from "./function";

const hasButton = getQueryArg(window.location.href, "hasButton");
let enableButton = true;
enableButton = hasButton && hasButton === "false" ? false : true;

export const resetFields = (state, dispatch) => {
  const compJson="components.div.children.UCSearchCard.children.cardContent.children.searchContainer.children";
    
  dispatch(handleField("search",`${compJson}.receiptNumber`,"props.value",""));
  dispatch(handleField("search",`${compJson}.receiptNumber`,"props.error",false));
  
  dispatch(handleField("search",`${compJson}.consumerNumber`,"props.value",""));
  dispatch(handleField("search",`${compJson}.consumerNumber`,"props.error",false));
  
  dispatch(handleField("search",`${compJson}.serviceType`,"props.value",""));
  dispatch(handleField("search",`${compJson}.serviceType`,"props.error",false));
  dispatch(handleField("search",`${compJson}.serviceType`,"props.helperText",""));
  
  
  dispatch(handleField("search",`${compJson}.mobileNumber`,"props.value",""));
  dispatch(handleField("search",`${compJson}.mobileNumber`,"props.error",false));
  
};

export const UCSearchCard = getCommonCard({
  header: getCommonHeader({
    labelName: "Search Receipt",
    labelKey: "CR_SEARCH_COMMON_HEADER"
  }),
  subheader: getCommonSubHeader({
    labelName: "Provide at least one parameter to search for an application",
    labelKey: "CR_SEARCH_COMMON_SUB_HEADER"
  }),
  searchContainer: getCommonContainer({
    serviceType: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-uc",
      componentPath: "AutosuggestContainer",
      props: {
        className: "autocomplete-dropdown",
        label: {
          labelName: "Service Category",
          labelKey: "CR_SERVICE_CATEGORY_LABEL"
        },
        placeholder: {
          labelName: "Select Service Category",
          labelKey: "CR_SERVICE_CATEGORY_PLACEHOLDER"
        },
        localePrefix: {
          masterName: "BusinessService",
          moduleName: "BillingService"
        },
        required: true,
        isClearable: true,
        labelsFromLocalisation: true,
        sourceJsonPath: "applyScreenMdmsData.businessServices",
        jsonPath: "receiptCancelSearch.businessService",
      },
      required: true,
      jsonPath: "receiptCancelSearch.businessService",
      gridDefination: {
        xs: 12,
        sm: 4
      },
      // beforeFieldChange: async (action, state, dispatch) => {
      //   const serviceCategory = get(
      //     state.screenConfiguration,
      //     "preparedFinalObject.applyScreenMdmsData.serviceCategories"
      //   );
      //   const selectedCategory = serviceCategory.find(
      //     item => item.code === action.value
      //   );
      //   const serviceTypes =
      //     selectedCategory &&
      //     ((selectedCategory.child &&
      //     selectedCategory.child.length > 0) ?
      //     selectedCategory.child.map(item => item.code) : selectedCategory.code);
      //   dispatch(
      //     prepareFinalObject("receiptCancelSearch.businessServices", serviceTypes)
      //   );
      //   return action;
      // }
    },
    consumerNumber: getTextField({
      label: {
        labelName: "Receipt Number.",
        labelKey: "CR_CONSUMER_NO_LABEL"
      },
      placeholder: {
        labelName: "Enter Receipt No.",
        labelKey: "CR_ENTER_CONSUMER_NO_PLACEHOLDER"
      },
      required: false,
      visible: true,
      jsonPath: "receiptCancelSearch.consumerCodes",
      gridDefination: {
        xs: 12,
        sm: 4
      }
    }),
    receiptNumber: getTextField({
      label: {
        labelName: "Receipt Number.",
        labelKey: "CR_RECEPIT_NO_LABEL"
      },
      placeholder: {
        labelName: "Enter Receipt No.",
        labelKey: "CR_ENTER_RECEPIT_NO_PLACEHOLDER"
      },
      required: false,
      visible: true,
      jsonPath: "receiptCancelSearch.receiptNumbers",
      gridDefination: {
        xs: 12,
        sm: 4
      }
    }),

    mobileNumber: getTextField({
      label: {
        labelName: "Mobile No.",
        labelKey: "CR_MOBILE_NO_LABEL"
      },
      placeholder: {
        labelName: "Enter Mobile NO.",
        labelKey: "CR_MOBILE_NO_PLACEHOLDER"
      },
      gridDefination: {
        xs: 12,
        sm: 4
      },
      iconObj: {
        label: "+91 |",
        position: "start"
      },
      required: false,
      pattern: getPattern("MobileNo"),
      errorMessage: "Invalid Mobile No..",
      jsonPath: "receiptCancelSearch.mobileNumber"
    })
  }),

  buttonContainer: getCommonContainer({
    firstCont: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      gridDefination: {
        xs: 12,
        sm: 3
      }
    },
    resetButton: {
      componentPath: "Button",
      gridDefination: {
        xs: 12,
        sm: 3
        // align: "center"
      },
      props: {
        variant: "outlined",
        style: {
          color: "#FE7A51",
          // backgroundColor: "#FE7A51",
          border: "#FE7A51 solid 1px",
          borderRadius: "2px",
          width: window.innerWidth > 480 ? "80%" : "100%",
          height: "48px"
        }
      },
      children: {
        buttonLabel: getLabel({
          labelName: "RESET",
          labelKey: "CR_RESET_BUTTON"
        })
      },
      onClickDefination: {
        action: "condition",
        callBack: resetFields
      }
    },

    searchButton: {
      componentPath: "Button",
      gridDefination: {
        xs: 12,
        sm: 3
        // align: "center"
      },
      props: {
        variant: "contained",
        style: {
          color: "white",
          backgroundColor: "#696969",
          borderRadius: "2px",
          width: window.innerWidth > 480 ? "80%" : "100%",
          height: "48px"
        }
      },
      children: {
        buttonLabel: getLabel({
          labelName: "SEARCH",
          labelKey: "CR_SEARCH_BUTTON"
        })
      },
      onClickDefination: {
        action: "condition",
        callBack: (state, dispatch) => {
          searchApiCall(state, dispatch);
        }
      }
    },

    lastCont: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      gridDefination: {
        xs: 12,
        sm: 3
      }
    }
  })
}, {
  style: { overflow: "visible" }
});
