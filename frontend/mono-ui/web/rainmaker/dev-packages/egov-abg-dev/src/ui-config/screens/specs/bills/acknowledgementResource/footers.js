import { getLabel } from "egov-ui-framework/ui-config/screens/specs/utils";
import { ifUserRoleExists } from "../../utils";
import "./index.css";

export const getRedirectionURL = () => {
  const redirectionURL = "/inbox"
  return redirectionURL;
};

const getCommonApplyFooter = children => {
  return {
    uiFramework: "custom-atoms",
    componentPath: "Div",
    props: {
      className: "pt-apply-wizard-footer"
    },
    children
  };
};
//Function for go to home button
export const gotoHomeFooter = getCommonApplyFooter({
  gotoHome: {
    componentPath: "Button",
    props: {
      variant: "outlined",
      color: "primary",
      style: {
        minWidth: "200px",
        height: "48px",
        marginRight: "16px"
      }
    },
    children: {
      goToHomeButtonLabel: getLabel({
        labelName: "GO TO HOME",
        labelKey: "COMMON_BUTTON_HOME"
      })
    },
    // Check this onClickDefinition later again
    onClickDefination: {
      action: "page_change",
      path: `${getRedirectionURL()}`
    }
  }
});



