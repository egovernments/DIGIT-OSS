import { getLabel } from "egov-ui-framework/ui-config/screens/specs/utils";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import get from "lodash/get";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { createUpdateBpaApplication, submitBpaApplication } from "../../../../../ui-utils/commons";
import {
  handleScreenConfigurationFieldChange as handleField,
  prepareFinalObject
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
  let billbService = ((status == "PENDING_APPL_FEE") ? "BPA.NC_APP_FEE" : "BPA.NC_SAN_FEE");
  const makePaymentUrl = process.env.REACT_APP_SELF_RUNNING === "true"
    ? `/egov-ui-framework/egov-bpa/citizen-pay?applicationNumber=${applicationNumber}&tenantId=${tenant}&businessService=${billbService}`
    : `/egov-common/pay?consumerCode=${applicationNumber}&tenantId=${tenant}&businessService=${billbService}`;
  dispatch(setRoute(makePaymentUrl));
}

export const updateBpaApplication = async (state, dispatch, action) => {
  let bpaStatus = get(state, "screenConfiguration.preparedFinalObject.BPA.status");
  let bpaAction;
  if(action && action.componentJsonpath === "components.div.children.citizenFooter.children.sendToArch") {
    bpaAction = "SEND_TO_ARCHITECT"
  }
  if(action && action.componentJsonpath === "components.div.children.citizenFooter.children.approve") {
    bpaAction = "APPROVE"
  }

  let toggle = get(
    state.screenConfiguration.screenConfig["search-preview"],
    "components.div.children.sendToArchPickerDialog.props.open",
    false
  );
  dispatch(
    handleField("search-preview", "components.div.children.sendToArchPickerDialog", "props.open", !toggle)
  );
  dispatch(
    handleField("search-preview", "components.div.children.sendToArchPickerDialog.children.dialogContent.children.popup.children.cityPicker.children.cityDropdown", "props.applicationAction", bpaAction)
  );
  
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
        labelKey: "TL_COMMON_BUTTON_CITIZEN_MAKE_PAYMENT"
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
    componentPath: "Button",
    props: {
      variant: "contained",
      color: "primary",
      style: {
        minWidth: "200px",
        height: "48px",
        marginRight: "40px"
      }
    },
    children: {
      submitButtonLabel: getLabel({
        labelName: "SEND TO ARCHITECT",
        labelKey: "BPA_SEND_TO_ARCHITECT_BUTTON"
      }),
      nextButtonIcon: {
        uiFramework: "custom-atoms",
        componentPath: "Icon",
        props: {
          iconName: "keyboard_arrow_right"
        }
      }
    },
    onClickDefination: {
      action: "condition",
      callBack: updateBpaApplication
    },
    roleDefination: {
      rolePath: "user-info.roles",
      action: "SEND_TO_ARCHITECT"
    }
  },
  approve: {
    componentPath: "Button",
    props: {
      variant: "contained",
      color: "primary",
      style: {
        minWidth: "200px",
        height: "48px",
        marginRight: "40px"
      }
    },
    children: {
      submitButtonLabel: getLabel({
        labelName: "Approve",
        labelKey: "BPA_CITIZEN_APPROVE_BUTTON"
      }),
      nextButtonIcon: {
        uiFramework: "custom-atoms",
        componentPath: "Icon",
        props: {
          iconName: "keyboard_arrow_right"
        }
      }
    },
    onClickDefination: {
      action: "condition",
      callBack: updateBpaApplication
    },
    roleDefination: {
      rolePath: "user-info.roles",
      action: "APPROVE"
    }
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
});
