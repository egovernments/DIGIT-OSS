import { getLabel } from "egov-ui-framework/ui-config/screens/specs/utils";
import { ifUserRoleExists } from "../../utils";

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
export const getRedirectionURL = () => {
  const redirectionURL = ifUserRoleExists("EMPLOYEE")
	? "/abg-citizen/acknowledgement?purpose=pay&status=success"
	: "/inbox";

  return redirectionURL;
};
export const footer = getCommonApplyFooter({
  generateReceiptButton: {
	componentPath: "Button",
	props: {
	  variant: "contained",
	  color: "primary",
	  style: {
		minWidth: "200px",
		height: "48px",
		marginRight: "16px"
	  }
	},
	children: {
	  downloadReceiptButtonLabel: getLabel({
		labelName: "GENERATE RECEIPT",
		labelKey: "ABG_BUTTON_GENERATE_RECEIPT"
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
	  action: "page_change",
	  path: `${getRedirectionURL()}`
	}
  }
});