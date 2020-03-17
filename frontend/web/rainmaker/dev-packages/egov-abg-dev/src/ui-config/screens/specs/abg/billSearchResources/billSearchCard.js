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
import { searchApiCall } from "./function";
import { handleScreenConfigurationFieldChange as handleField,prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getTenantId,getUserInfo } from "egov-ui-kit/utils/localStorageUtils";

// const tenantId = process.env.REACT_APP_NAME === "Employee" ?  getTenantId() : JSON.parse(getUserInfo()).permanentCity;
// console.log("tenantId--- ", tenantId);
const resetFields = (state, dispatch) => {
  const tenantId = process.env.REACT_APP_NAME === "Employee" ?  getTenantId() : JSON.parse(getUserInfo()).permanentCity;
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
      "components.div.children.billSearchCard.children.cardContent.children.searchContainer.children.mobileNo",
      "props.value",
      ""
    )
  );
  dispatch(prepareFinalObject("searchScreen" , {tenantId: tenantId}))
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
    ulb: getSelectField({
      label: {
        labelName: "ULB",
        labelKey: "ABG_ULB_LABEL"
      },
      labelPrefix: {
        moduleName: "TENANT",
        masterName: "TENANTS"
      },
      optionLabel: "name",
      placeholder: {
        labelName: "Select ULB",
        labelKey: "ABG_ULB_PLACEHOLDER"
      },
      sourceJsonPath: "searchScreenMdmsData.tenant.tenants",
      jsonPath: "searchScreen.tenantId",
      required: true,
      disabled: process.env.REACT_APP_NAME === "Citizen" ? false : true,
      gridDefination: {
        xs: 12,
        sm: 4
      }
    }),
    serviceCategory: getSelectField({
      label: {
        labelName: "Service Category",
        labelKey: "ABG_SERVICE_CATEGORY_LABEL"
      },
      placeholder: {
        labelName: "Select Service Category",
        labelKey: "ABG_SERVICE_CATEGORY_PLACEHOLDER"
      },
      required: true,
      jsonPath: "searchScreen.businesService",
      gridDefination: {
        xs: 12,
        sm: 4
      },
      localePrefix : {
        moduleName : "BillingService",
        masterName : "BusinessService"
      },
      sourceJsonPath: "searchScreenMdmsData.BillingService.BusinessService",
      beforeFieldChange :(action, state, dispatch) => {
        const labelName = {
          labelKey : `ABG_${action.value}_CONSUMER_CODE_LABEL`,
          labelName : "Consumer Code"
        }
        const placeHolder = {
          labelKey : `ABG_${action.value}_CONSUMER_CODE_PLACEHOLDER`,
          labelName : "Enter Consumer Code"
        }
        dispatch(
          handleField(
            "billSearch",
            "components.div.children.billSearchCard.children.cardContent.children.searchContainer.children.consumerCode",
            "props.label",
            labelName
          )
        );
        dispatch(
          handleField(
            "billSearch",
            "components.div.children.billSearchCard.children.cardContent.children.searchContainer.children.consumerCode",
            "props.placeholders",
            placeHolder
          )
        );
      }
    }),
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
      jsonPath: "searchScreen.billNo",
      gridDefination: {
        xs: 12,
        sm: 4
      }
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
      jsonPath: "searchScreen.mobileNumber"
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
