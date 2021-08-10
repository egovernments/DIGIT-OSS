import { getLabel } from "egov-ui-framework/ui-config/screens/specs/utils";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import get from "lodash/get";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { createUpdateBpaApplication, submitBpaApplication } from "../../../../../ui-utils/commons";
import {
  handleScreenConfigurationFieldChange as handleField,
  prepareFinalObject,
  toggleSnackbar
} from "egov-ui-framework/ui-redux/screen-configuration/actions";

let applicationNumber = getQueryArg(window.location.href, "applicationNumber");
let tenant = getQueryArg(window.location.href, "tenantId");

const getCommonApplyFooter = children => {
  return {
    uiFramework: "custom-atoms",
    componentPath: "Div",
    props: {
      className: "apply-wizard-footer"
    },
    children
  };
};

export const bpaMakePayment = async (state, dispatch) => {
  let status = get(state.screenConfiguration.preparedFinalObject, "BPA.status");
  let riskType = get(state.screenConfiguration.preparedFinalObject, "BPA.riskType");
  let billbService
  if(riskType === "LOW") {
    billbService = "BPA.LOW_RISK_PERMIT_FEE"
  } else {
    billbService = (( status=="PENDING_APPL_FEE")?"BPA.NC_APP_FEE":"BPA.NC_SAN_FEE");
  }
  const makePaymentUrl = process.env.REACT_APP_SELF_RUNNING === "true"
    ? `/egov-ui-framework/egov-bpa/citizen-pay?applicationNumber=${applicationNumber}&tenantId=${tenant}&businessService=${billbService}`
    : `/egov-common/pay?consumerCode=${applicationNumber}&tenantId=${tenant}&businessService=${billbService}`;
  dispatch(setRoute(makePaymentUrl));
}

export const updateBpaApplication = async (state, dispatch, action) => {
  let bpaStatus = get(state, "screenConfiguration.preparedFinalObject.BPA.status");
  let isDeclared = get(state, "screenConfiguration.preparedFinalObject.BPA.isDeclared");  
  let bpaAction, isArchitect = false, isCitizen = false, isCitizenBack = false;
  if(action && action === "SEND_TO_ARCHITECT") {
    bpaAction = "SEND_TO_ARCHITECT",
    isArchitect = true;
  }
  if(action && action === "APPROVE") {
    bpaAction = "APPROVE",
    isCitizen = true;
  }
 let bpaStatusAction = bpaStatus && bpaStatus.includes("CITIZEN_ACTION_PENDING")
  if(bpaStatusAction) {
    bpaAction = "FORWARD",
    isCitizenBack = true;
  }

  let toggle = get(
    state.screenConfiguration.screenConfig["search-preview"],
    "components.div.children.sendToArchPickerDialog.props.open",
    false
  );
  if((isDeclared && isCitizen ) || (isArchitect) || (isCitizenBack)){
    dispatch(
      handleField("search-preview", "components.div.children.sendToArchPickerDialog", "props.open", !toggle)
    );
    dispatch(
      handleField("search-preview", "components.div.children.sendToArchPickerDialog.children.dialogContent.children.popup.children.cityPicker.children.cityDropdown", "props.applicationAction", bpaAction)
    );
  } else {
    let errorMessage = {
      labelName: "Please confirm the declaration!",
      labelKey: "BPA_DECLARATION_COMMON_LABEL"
    };
    dispatch(toggleSnackbar(true, errorMessage, "warning")); 
  }
};

export const sendToArchContainer = () => {
  return {
    uiFramework: "custom-atoms",
    componentPath: "Div",
    props: {
      style: { textAlign: "right", display: "flex" }
    },
    children: {
      downloadMenu: {
        uiFramework: "custom-atoms-local",
        moduleName: "egov-bpa",
        componentPath: "MenuButton",
        props: {
          data: {
            label: {labelName : "Take Action" , labelKey :"WF_TAKE_ACTION"},
            rightIcon: "arrow_drop_down",
            props: { variant: "contained", style: { height: "60px", color : "#fff", backgroundColor: "#FE7A51", } },
            menu: {}
          }
        }
      },
    },
  }
};
export const citizenFooter = getCommonApplyFooter({
  makePayment: {
    componentPath: "Button",
    props: {
      variant: "contained",
      color: "primary",
      style: {
        height: "48px",
          marginRight: "45px"
        }
    },
    children: {
      submitButtonLabel: getLabel({
        labelName: "MAKE PAYMENT",
        labelKey: "BPA_CITIZEN_MAKE_PAYMENT"
      })
    },
    onClickDefination: {
      action: "condition",
      callBack: bpaMakePayment
    },
    roleDefination: {
      rolePath: "user-info.roles",
      action: "PAY"
    }
  },
  sendToArch: {
    uiFramework: "custom-atoms",
              componentPath: "Container",
              props: {
                color: "primary",
                style: { justifyContent: "flex-end" }
              },
              children: {
                buttons : sendToArchContainer()
              },
              visible: false
  },
  submitButton: {
    componentPath: "Button",
    props: {
      variant: "contained",
      color: "primary",
      style: {
        minWidth: "200px",
        height: "48px",
        marginRight: "45px"
      }
    },
    children: {
      submitButtonLabel: getLabel({
        labelName: "Submit",
        labelKey: "BPA_COMMON_BUTTON_SUBMIT"
      })
    },
    onClickDefination: {
      action: "condition",
      callBack: submitBpaApplication
    },
    roleDefination: {
      rolePath: "user-info.roles",
      action : "APPLY"
    }
  },
  forwardButton: {
    componentPath: "Button",
    props: {
      variant: "contained",
      color: "primary",
      style: {
        minWidth: "200px",
        height: "48px",
        marginRight: "45px"
      }
    },
    children: {
      submitButtonLabel: getLabel({
        labelName: "Forward",
        labelKey: "BPA_FORWARD_BUTTON"
      })
    },
    onClickDefination: {
      action: "condition",
      callBack: updateBpaApplication
    },
    roleDefination: {
      rolePath: "user-info.roles",
      action : "FORWARD"
    }
  },
});
