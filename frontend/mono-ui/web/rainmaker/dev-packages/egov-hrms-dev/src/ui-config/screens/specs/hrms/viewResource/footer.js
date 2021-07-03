import { getLabel } from "egov-ui-framework/ui-config/screens/specs/utils";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { showHideAdhocPopup } from "../../utils";
import { handleCreateUpdateEmployee } from "./functions";
const routeTo =(link)=>{
    let moduleName = process.env.REACT_APP_NAME === "Citizen" ? '/citizen' : '/employee';
    window.location.href = process.env.NODE_ENV === "production" ? moduleName + link : link;
}
const gotoCreateFlow = (state, dispatch) => {
  const employeeCode = getQueryArg(window.location.href, "employeeID");
  const tenantId = getQueryArg(window.location.href, "tenantId");
  const createUrl =
    process.env.REACT_APP_SELF_RUNNING === "true"
      ? `/egov-ui-framework/hrms/create?employeeCode=${employeeCode}&tenantId=${tenantId}`
      : `/hrms/create?employeeCode=${employeeCode}&tenantId=${tenantId}`;
    routeTo(createUrl);
};

const getCommonCreateFooter = children => {
  return {
    uiFramework: "custom-atoms",
    componentPath: "Div",
    props: {
      className: "apply-wizard-footer"
    },
    children
  };
};

export const hrCommonFooter = () => {
  return getCommonCreateFooter({
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
          labelName: "SUBMIT",
          labelKey: "HR_SUBMIT_LABEL"
        })
      },
      onClickDefination: {
        action: "condition",
        callBack: handleCreateUpdateEmployee
      }
    }
  });
};

export const hrViewFooter = () => {
  return getCommonCreateFooter({
    deactivateEmployee: {
      componentPath: "Button",
      props: {
        variant: "outlined",
        color: "primary",
        style: {
          minWidth: "200px",
          height: "48px",
          marginRight: "45px"
        }
      },
      children: {
        deactivateEmployeeButtonLabel: getLabel({
          labelName: "DEACTIVATE EMPLOYEE",
          labelKey: "HR_DEACTIVATE_EMPLOYEE_LABEL"
        })
      },
      onClickDefination: {
        action: "condition",
        callBack: showHideAdhocPopup
      }
    },
    activateEmployee: {
      componentPath: "Button",
      props: {
        variant: "outlined",
        color: "primary",
        style: {
          minWidth: "200px",
          height: "48px",
          marginRight: "45px"
        }
      },
      children: {
        activateEmployeeButtonLabel: getLabel({
          labelName: "ACTIVATE EMPLOYEE",
          labelKey: "HR_ACTIVATE_EMPLOYEE_LABEL"
        })
      },
      onClickDefination: {
        action: "condition",
        callBack: showHideAdhocPopup
      },

      visible: false
    },
    editDetails: {
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
        editDetailsButtonLabel: getLabel({
          labelName: "EDIT DETAILS",
          labelKey: "HR_EDIT_DETAILS_LABEL"
        }),
        editDetailsButtonIcon: {
          uiFramework: "custom-atoms",
          componentPath: "Icon",
          props: {
            iconName: "keyboard_arrow_right"
          }
        }
      },
      onClickDefination: {
        action: "condition",
        callBack: gotoCreateFlow
      }
    }
  });
};
