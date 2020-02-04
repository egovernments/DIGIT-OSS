import { getLabel } from "egov-ui-framework/ui-config/screens/specs/utils";
import { ifUserRoleExists } from "../../utils";
import generatePdf from "../../utils/receiptPdf";
import "./index.css";

export const getRedirectionURL = () => {
  const redirectionURL = ifUserRoleExists("CITIZEN")
    ? "/property-tax"
    : "/inbox";
  return redirectionURL;
};

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

//Function for go to home button
export const gotoHomeFooter = getCommonApplyFooter({
  gotoHome: {
    componentPath: "Button",
    props: {
      variant: "outlined",
      color: "primary",
      style: {
       // minWidth: "200px",
        height: "48px",
        marginRight: "16px"
      }
    },
    children: {
      //downloadReceiptButtonLabel: getLabel
      goToHomeButtonLabel: getLabel({
        labelName: "GO TO HOME",
        labelKey: "PT_MUTATION_HOME"
      })
    },
    // Check this onClickDefinition later again
    onClickDefination: {
      action: "page_change",
      path: `${getRedirectionURL()}`
    }
  }
});

//Function for application success(show those 3 buttons )
export const applicationSuccessFooter = (
  state,
  dispatch,
  applicationNumber,
  tenant
) => {
  return getCommonApplyFooter({
    gotoHome: {
      componentPath: "Button",
      props: {
        className: "apply-wizard-footer1",
        variant: "outlined",
        color: "primary",
        style: {
          minWidth: "180px",
          height: "48px",
        }
      },
      children: {
        //downloadReceiptButtonLabel: getLabel
        goToHomeButtonLabel: getLabel({
          labelName: "GO TO HOME",
          labelKey: "PT_MUTATION_HOME"
        })
      },
      // Check this onClickDefinition later again
      onClickDefination: {
        action: "page_change",
        path: `${getRedirectionURL()}`
      },
     
    },
    downloadFormButton: {
      componentPath: "Button",
      props: {
        variant: "outlined",
        color: "primary",
        style: {
          height: "48px",
          marginRight: "16px"
        }
      },
      children: {
        downloadFormButtonLabel: getLabel({
          labelName: "ACKNOWLEDGEMENT FORM",
          labelKey: "PT_MUTATION_ACKNOWLEDGEMENT_FORM"
        })
      },
      onClickDefination: {
        action: "condition",
        callBack: () => {
          generatePdf(state, dispatch, "application_download");
        }
      },
      visible: false
    },
    proceedToPaymentButton: {
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
        proceedToPaymentButtonLabel: getLabel({
          labelName: "Proceed to payment",
          labelKey: "PT_MUTATION_PROCEED_PAYMENT"
        })
      },
      onClickDefination: {
        action: "page_change",
        path:`/egov-common/pay?consumerCode=${applicationNumber}&tenantId=${tenant}`
      },
      roleDefination: {
        rolePath: "user-info.roles",
        action: "PAY"
      },
      visible: process.env.REACT_APP_NAME === "Citizen" ? false : true
    },
    makePayment: {
      componentPath: "Button",
      props: {
       className: "apply-wizard-footer1",
        variant: "contained",
        color: "primary",
        style: {
          minWidth: "180px",
          height: "48px",
        
        }
      },
      children: {
        submitButtonLabel: getLabel({
          labelName: "MAKE PAYMENT",
          labelKey: "PT_MUTATION_MAKE_PAYMENT"
        })
      },
      onClickDefination: {
        action: "page_change",
        path:`/egov-common/pay?consumerCode=${applicationNumber}&tenantId=${tenant}`,
      },
      roleDefination: {
        rolePath: "user-info.roles",
        roles: ["CITIZEN"],
        action: "PAY"
      },
      visible: process.env.REACT_APP_NAME === "Citizen" ? true : false
    }
  });
};


