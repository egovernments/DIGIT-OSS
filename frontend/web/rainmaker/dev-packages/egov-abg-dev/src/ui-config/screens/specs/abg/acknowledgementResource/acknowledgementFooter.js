import { getLabel } from "egov-ui-framework/ui-config/screens/specs/utils";
import { ifUserRoleExists } from "../../utils";
import { generateBill } from "../../utils/receiptPdf";
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
  const redirectionURL = ifUserRoleExists("EMPLOYEE") ? "/abg/groupBills" : "/inbox";

  return redirectionURL;
};
export const acknowledgementSuccesFooter = getCommonApplyFooter({
  goToHomeButton: {
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
      downloadReceiptButtonLabel: getLabel({
        labelName: "Go To Home",
        labelKey: "ABG_GO_TO_HOME_BUTTON"
      })
    },
    onClickDefination: {
      action: "page_change",
      path: `${getRedirectionURL()}`
    }
  },

  viewReceiptButton: {
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
        labelName: "VIEW RECEIPT",
        labelKey: "ABG_VIEW_RECEIPT_BUTTON"
      })
    },
    onClickDefination: {
      action: "condition",
      callBack: (state, dispatch) => {
        viewReceipt(state, dispatch);
      }
    }
  }
});
export const acknowledgementFailureFooter = getCommonApplyFooter({
  nextButton: {
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
        labelName: "Go To Home",
        labelKey: "ABG_GO_TO_HOME_BUTTON"
      })
    },
    onClickDefination: {
      action: "page_change",
      path: `${getRedirectionURL()}`
    }
  }
});

const viewReceipt = (state, dispatch) => {
    generateBill(state, dispatch);
};
