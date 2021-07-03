import { getLabel } from "egov-ui-framework/ui-config/screens/specs/utils";
import { ifUserRoleExists } from "../../utils";
import generatePdf from "../../utils/generatePdfForBpa";
import "./index.css";
import get from "lodash/get";
import { stat } from "fs";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";

export const getRedirectionURL = () => {
  const redirectionURL = ifUserRoleExists("CITIZEN")
    ? "/bpastakeholder-citizen/home"
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
      variant: "contained",
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
        labelKey: "BPA_HOME_BUTTON"
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
  let status = (get(state.screenConfiguration.preparedFinalObject, "BPA[0].status") ||  get(state.screenConfiguration.preparedFinalObject, "BPA.status"));
  let businessService = (get(state.screenConfiguration.preparedFinalObject, "BPA[0].businessService") ||  get(state.screenConfiguration.preparedFinalObject, "BPA.businessService"));
  let billbService
  if(businessService === "BPA_LOW") {
    billbService = "BPA.LOW_RISK_PERMIT_FEE"
  } else if(businessService === "BPA"){
    billbService = (( status=="PENDING_APPL_FEE")?"BPA.NC_APP_FEE":"BPA.NC_SAN_FEE");
  } else if(businessService === "BPA_OC"){
    billbService = (( status=="PENDING_APPL_FEE")?"BPA.NC_OC_APP_FEE":"BPA.NC_OC_SAN_FEE");
  }
  let purpose = getQueryArg(window.location.href, "purpose");
  let isTrue = false;
  if(purpose == "apply") {
    isTrue = true;
  }
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
          labelKey: "BPA_HOME_BUTTON"
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
        //  minWidth: "290px",
          height: "48px",
          marginRight: "16px"
        }
      },
      children: {
        downloadFormButtonLabel: getLabel({
          labelName: "DOWNLOAD CONFIRMATION FORM",
          labelKey: "BPA_APPLICATION_BUTTON_DOWN_CONF"
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
    printFormButton: {
      componentPath: "Button",
      props: {
        variant: "outlined",
        color: "primary",
        style: {
       //   minWidth: "170px",
          height: "48px",
          marginRight: "45px"
        }
      },
      children: {
        printFormButtonLabel: getLabel({
          labelName: "PRINT CONFIRMATION FORM",
          labelKey: "BPA_APPLICATION_BUTTON_PRINT_CONF"
        })
      },
      onClickDefination: {
        action: "condition",
        callBack: () => {
          generatePdf(state, dispatch, "application_print");
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
        //  minWidth: "170px",
          height: "48px",
         marginRight: "45px"
        }
      },
      children: {
        proceedToPaymentButtonLabel: getLabel({
          labelName: "Proceed to payment",
          labelKey: "BPA_PROCEED_PAYMENT"
        })
      },
      //Add onClickDefination and RoleDefination later
      onClickDefination: {
        action: "page_change",
        path:`/egov-common/pay?consumerCode=${applicationNumber}&tenantId=${tenant}&businessService=${billbService}`
          // process.env.REACT_APP_SELF_RUNNING === "true"
          //   ? `/egov-ui-framework/BPA/pay?applicationNumber=${applicationNumber}&tenantId=${tenant}&businessService=FIRENOC`
          //   : `/BPA/pay?applicationNumber=${applicationNumber}&tenantId=${tenant}&businessService=FIRENOC`
      },
      roleDefination: {
        rolePath: "user-info.roles",
        action: "PAY"
        // roles: ["BPA_CEMP", "SUPERUSER"]
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
          labelKey: "BPA_CITIZEN_MAKE_PAYMENT"
        })
      },
      onClickDefination: {
        action: "page_change",
        path:`/egov-common/pay?consumerCode=${applicationNumber}&tenantId=${tenant}&businessService=${billbService}`,
          // process.env.REACT_APP_SELF_RUNNING === "true"
          //   ? `BPA/citizen-pay?applicationNumber=${applicationNumber}&tenantId=${tenant}`
          //   : `/BPA/citizen-pay?applicationNumber=${applicationNumber}&tenantId=${tenant}`
      },
      roleDefination: {
        rolePath: "user-info.roles",
        roles: ["CITIZEN"],
        action: "PAY"
      },
      visible: process.env.REACT_APP_NAME === "Citizen" ? isTrue : false
    }
  });
};

//Function for approval footer buttons
export const approvalSuccessFooter = getCommonApplyFooter({
  //Call gotoHome
  gotoHome: {
    componentPath: "Button",
    props: {
      variant: "contained",
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
        labelKey: "BPA_HOME_BUTTON"
      })
    },
    // Check this onClickDefinition later again
    onClickDefination: {
      action: "page_change",
      path: `${getRedirectionURL()}`
    }
  },
  // downloadLicenseButton: {
  //   componentPath: "Button",
  //   props: {
  //     variant: "outlined",
  //     color: "primary",
  //     style: {
  //       width: "250px",
  //       height: "48px",
  //       marginRight: "16px"
  //     }
  //   },
  //   children: {
  //     downloadLicenseButtonLabel: getLabel({
  //       labelName: "DOWNLOAD BPA",
  //       labelKey: "BPA_APPROVAL_CHECKLIST_BUTTON_DOWN_LIC"
  //     })
  //   },
  //   onClickDefination: {
  //     action: "condition",
  //     callBack: (state, dispatch) => {
  //       generatePdf(state, dispatch, "certificate_download");
  //     }
  //   }
  // },
  // printNOCButton: {
  //   componentPath: "Button",
  //   props: {
  //     variant: "contained",
  //     color: "primary",
  //     style: {
  //       width: "250px",
  //       height: "48px",
  //       marginRight: "40px"
  //     }
  //   },
  //   children: {
  //     printLicenseButtonLabel: getLabel({
  //       labelName: "PRINT BPA",
  //       labelKey: "BPA_APPROVAL_CHECKLIST_PRINT_LIC"
  //     })
  //   },
  //   onClickDefination: {
  //     action: "condition",
  //     callBack: (state, dispatch) => {
  //       generatePdf(state, dispatch, "certificate_print");
  //     }
  //   }
  // }
});

//Function for payment failure(retry button)
export const paymentFailureFooter = (applicationNumber, tenant) => {
  return getCommonApplyFooter({
    //Call gotoHome
    retryPayment: {
      componentPath: "Button",
      props: {
        variant: "contained",
        color: "primary",
        style: {
        //  minWidth: "200px",
          height: "48px",
          marginRight: "16px"
        }
      },
      children: {
        downloadReceiptButtonLabel: getLabel({
          labelName: "RETRY",
          labelKey: "BPA_PAYMENT_RETRY"
        })
      },
      onClickDefination: {
        action: "page_change",
        path: `/egov-bpa/citizen-pay?applicationNumber=${applicationNumber}&tenantId=${tenant}`
      }
    }
  });
};

//Function for payment success(Show buttons for download and print receipts)
export const paymentSuccessFooter = () => {
  return getCommonApplyFooter({
    //call gotoHome
    downloadReceiptButton: {
      componentPath: "Button",
      props: {
        variant: "outlined",
        color: "primary",
        style: {
       //   minWidth: "200px",
          height: "48px",
          marginRight: "16px"
        }
      },
      children: {
        downloadReceiptButtonLabel: getLabel({
          labelName: "DOWNLOAD RECEIPT",
          labelKey: "BPA_CONFIRMATION_BUTTON_DOWNLOAD_RECEIPT"
        })
      },
      onClickDefination: {
        action: "condition",
        callBack: (state, dispatch) => {
          generatePdf(state, dispatch, "receipt_download");
        }
      },
      visible: false            
    },
    printReceiptButton: {
      componentPath: "Button",
      props: {
        variant: "contained",
        color: "primary",
        style: {
       //   minWidth: "200px",
          height: "48px",
          marginRight: "40px"
        }
      },
      children: {
        printReceiptButtonLabel: getLabel({
          labelName: "PRINT RECEIPT",
          labelKey: "BPA_CONFIRMATION_BUTTON_PRINT_RECEIPT"
        })
      },
      onClickDefination: {
        action: "condition",
        callBack: (state, dispatch) => {
          generatePdf(state, dispatch, "receipt_print");
        }
      },
      visible: false      
    },
    gotoHome: {
      componentPath: "Button",
      props: {
        variant: "contained",
        color: "primary",
        style: {
      //    minWidth: "200px",
          height: "48px",
          marginRight: "16px"
        }
      },
      children: {
        goToHomeButtonLabel: getLabel({
          labelName: "GO TO HOME",
          labelKey: "BPA_COMMON_BUTTON_HOME"
        })
      },
      onClickDefination: {
        action: "page_change",
        path:
          process.env.REACT_APP_SELF_RUNNING === "true"
            ? `/egov-ui-framework/BPA/search`
            : `/`
      },
       visible: true
    }
  });
};

//Write a function using map to return buttons
