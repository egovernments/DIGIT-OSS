import {
  getCommonCard,
  getTextField,
  getSelectField,
  getCommonContainer,
  getPattern,
  getLabel,
  getCommonHeader,
  getCommonSubHeader
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { searchApiCall } from "./function";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";

const hasButton = getQueryArg(window.location.href, "hasButton");
//const hasApproval = getQueryArg(window.location.href, "hasApproval");
let enableButton = true;
//enableInbox = hasApproval && hasApproval === "false" ? false : true;
enableButton = hasButton && hasButton === "false" ? false : true;

const resetFields = (state, dispatch) => {
  dispatch(
    handleField(
      "billSearch",
      "components.div.children.billSearchCard.children.cardContent.children.searchContainer.children.consumerCode",
      "props.value",
      ""
    )
  );
  dispatch(
    handleField(
      "billSearch",
      "components.div.children.billSearchCard.children.cardContent.children.searchContainer.children.billNumber",
      "props.value",
      ""
    )
  );
  dispatch(
    handleField(
      "billSearch",
      "components.div.children.billSearchCard.children.cardContent.children.searchContainer.children.serviceType",
      "props.value",
      ""
    )
  );
  dispatch(
    handleField(
      "billSearch",
      "components.div.children.billSearchCard.children.cardContent.children.searchContainer.children.mobileNo",
      "props.value",
      ""
    )
  );
};

export const billSearchCard = getCommonCard({
  header: getCommonHeader({
    labelName: "Search Bill",
    labelKey: "ABG_SEARCH_BILL_COMMON_HEADER"
  }),
  subheader: getCommonSubHeader({
    labelName: "Provide at least one parameter to search for an application",
    labelKey: "ABG_SEARCH_BILL_COMMON_SUB_HEADER"
  }),
  searchContainer: getCommonContainer({
    consumerCode: getTextField({
      label: {
        labelName: "Consumer Code",
        labelKey: "ABG_CONSUMER_CODE_LABEL"
      },
      placeholder: {
        labelName: "Enter Consumer Code",
        labelKey: "ABG_CONSUMER_CODE_PLACEHOLDER"
      },
      required: false,
      visible: true,
      jsonPath: "searchScreen.consumerCode",
      gridDefination: {
        xs: 12,
        sm: 4
      }
    }),
    billNumber: getTextField({
      label: {
        labelName: "Bill No.",
        labelKey: "ABG_BILL_NUMBER_LABEL"
      },
      placeholder: {
        labelName: "Enter Bill No.",
        labelKey: "ABG_BILL_NUMBER_PLACEHOLDER"
      },
      required: false,
      visible: true,
      jsonPath: "searchScreen.billNumber",
      gridDefination: {
        xs: 12,
        sm: 4
      }
    }),
    serviceType: getSelectField({
      label: {
        labelName: "Service Type",
        labelKey: "ABG_SERVICE_TYPE_LABEL"
      },
      placeholder: {
        labelName: "Select Service Type",
        labelKey: "ABG_SERVICE_TYPE_PLACEHOLDER"
      },
      required: true,
      jsonPath: "searchScreen.service",
      gridDefination: {
        xs: 12,
        sm: 4
      },
      sourceJsonPath: "searchScreenMdmsData.BillingService.BusinessService"
    }),
    mobileNo: getTextField({
      label: {
        labelName: "Mobile No.",
        labelKey: "ABG_MOBILE_NO_LABEL"
      },
      placeholder: {
        labelName: "Enter Mobile No.",
        labelKey: "ABG_MOBILE_NO_PLACEHOLDER"
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
      jsonPath: "searchScreen.mobileNo"
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
          labelKey: "ABG_RESET_BUTTON"
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
          labelKey: "ABG_SEARCH_BUTTON"
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
});
