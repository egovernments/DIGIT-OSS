import { getLabel } from "egov-ui-framework/ui-config/screens/specs/utils";
import generateReceipt from "../../utils/receiptPdf";
import { ifUserRoleExists } from "../../utils";
import { generatePdfFromDiv } from "../applyResource/footer";

const getCommonApplyFooter = children => {
  return {
    uiFramework: "custom-atoms",
    componentPath: "Div",
    props: {
      className: "pay-success-footer"
    },
    children
  };
};

export const paymentSuccessFooter = (
  state,
  dispatch,
  status,
  applicationNumber
) => {
  const roleExists = ifUserRoleExists("CITIZEN");
  // const redirectionURL = roleExists ? "/tradelicense-citizen/home" : "/inbox";
  /* Mseva 2.0 changes */
  const redirectionURL = roleExists ? "/" : "/inbox";

  /** MenuButton data based on status */
  let downloadMenu = [];
  let printMenu = [];
  let tlCertificateDownloadObject = {
    label: { labelName: "TL Certificate", labelKey: "BPA_CERTIFICATE" },
    link: () => {
      generateReceipt(state, dispatch, "certificate_download");
    },
    leftIcon: "book"
  };
  let tlCertificatePrintObject = {
    label: { labelName: "TL Certificate", labelKey: "BPA_CERTIFICATE" },
    link: () => {
      generateReceipt(state, dispatch, "certificate_print");
    },
    leftIcon: "book"
  };
  let receiptDownloadObject = {
    label: { labelName: "Receipt", labelKey: "BPA_RECEIPT" },
    link: () => {
      generateReceipt(state, dispatch, "receipt_download");
    },
    leftIcon: "receipt"
  };
  let receiptPrintObject = {
    label: { labelName: "Receipt", labelKey: "BPA_RECEIPT" },
    link: () => {
      generateReceipt(state, dispatch, "receipt_print");
    },
    leftIcon: "receipt"
  };
  let applicationDownloadObject = {
    label: { labelName: "Application", labelKey: "BPA_APPLICATION" },
    link: () => {
      generatePdfFromDiv("download", applicationNumber);
    },
    leftIcon: "assignment"
  };
  let applicationPrintObject = {
    label: { labelName: "Application", labelKey: "BPA_APPLICATION" },
    link: () => {
      generatePdfFromDiv("print", applicationNumber);
    },
    leftIcon: "assignment"
  };
  switch (status) {
    case "APPROVED":
      downloadMenu = [tlCertificateDownloadObject, receiptDownloadObject];
      printMenu = [tlCertificatePrintObject, receiptPrintObject];
      break;
    case "APPLIED":
    case "PENDINGPAYMENT":
      downloadMenu = [applicationDownloadObject, tlCertificateDownloadObject];
      printMenu = [applicationPrintObject, tlCertificatePrintObject];
      break;
    // case "PENDINGPAYMENT":
    //   downloadMenu = [applicationDownloadObject];
    //   printMenu = [applicationPrintObject];
    //   break;
    // case "pending_approval":
    //   downloadMenu = [receiptDownloadObject, applicationDownloadObject];
    //   printMenu = [receiptPrintObject, applicationPrintObject];
    //   break;
    case "cancelled":
      downloadMenu = [receiptDownloadObject, applicationDownloadObject];
      printMenu = [receiptPrintObject, applicationPrintObject];
      break;
    case "rejected":
      downloadMenu = [receiptDownloadObject, applicationDownloadObject];
      printMenu = [receiptPrintObject, applicationPrintObject];
      break;
    default:
      break;
  }
  /** END */

  return getCommonApplyFooter({
    container: {
      uiFramework: "custom-atoms",
      componentPath: "Container",
      children: {
        leftdiv: {
          uiFramework: "custom-atoms",
          componentPath: "Div",
          props: {
            style: { textAlign: "left", display: "flex" }
          },
          children: {
            downloadMenu: {
              uiFramework: "custom-atoms-local",
              moduleName: "egov-tradelicence",
              componentPath: "MenuButton",
              props: {
                data: {
                  label: "Download",
                  leftIcon: "cloud_download",
                  rightIcon: "arrow_drop_down",
                  props: { variant: "outlined", style: { marginLeft: 10 } },
                  menu: downloadMenu
                }
              }
            },
            printMenu: {
              uiFramework: "custom-atoms-local",
              moduleName: "egov-tradelicence",
              componentPath: "MenuButton",
              props: {
                data: {
                  label: "Print",
                  leftIcon: "print",
                  rightIcon: "arrow_drop_down",
                  props: { variant: "outlined", style: { marginLeft: 10 } },
                  menu: printMenu
                }
              }
            }
          },
          gridDefination: {
            xs: 12,
            sm: 4
          }
        },
        rightdiv: {
          uiFramework: "custom-atoms",
          componentPath: "Div",
          children: {
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
                downloadReceiptButtonLabel: getLabel({
                  labelName: "GO TO HOME",
                  labelKey: "BPA_HOME_BUTTON"
                })
              },
              onClickDefination: {
                action: "page_change",
                path: redirectionURL
              }
            }
            // downloadReceiptButton: {
            //   componentPath: "Button",
            //   props: {
            //     variant: "outlined",
            //     color: "primary",
            //     style: {
            //       minWidth: "200px",
            //       height: "48px",
            //       marginRight: "16px"
            //     }
            //   },
            //   children: {
            //     downloadReceiptButtonLabel: getLabel({
            //       labelName: "DOWNLOAD RECEIPT",
            //       labelKey: "TL_CONFIRMATION_BUTTON_DOWN_REPT"
            //     })
            //   },
            //   onClickDefination: {
            //     action: "condition",
            //     callBack: (state, dispatch) => {
            //       generateReceipt(state, dispatch, "receipt_download");
            //     }
            //   }
            // },
            // printReceiptButton: {
            //   componentPath: "Button",
            //   props: {
            //     variant: "contained",
            //     color: "primary",
            //     style: {
            //       minWidth: "200px",
            //       height: "48px",
            //       marginRight: "40px"
            //     }
            //   },
            //   children: {
            //     printReceiptButtonLabel: getLabel({
            //       labelName: "PRINT RECEIPT",
            //       labelKey: "TL_CONFIRMATION_BUTTON_PRT_REPT"
            //     })
            //   },
            //   onClickDefination: {
            //     action: "condition",
            //     callBack: (state, dispatch) => {
            //       generateReceipt(state, dispatch, "receipt_print");
            //     }
            //   }
            // }
          },
          gridDefination: {
            xs: 12,
            sm: 8
          }
        }
      }
    }
  });

  // return getCommonApplyFooter({
  //   gotoHome: {
  //     componentPath: "Button",
  //     props: {
  //       variant: "outlined",
  //       color: "primary",
  //       style: {
  //         minWidth: "200px",
  //         height: "48px",
  //         marginRight: "16px"
  //       }
  //     },
  //     children: {
  //       downloadReceiptButtonLabel: getLabel({
  //         labelName: "GO TO HOME",
  //         labelKey: "TL_COMMON_BUTTON_HOME"
  //       })
  //     },
  //     onClickDefination: {
  //       action: "page_change",
  //       path: redirectionURL
  //     }
  //   },
  //   downloadReceiptButton: {
  //     componentPath: "Button",
  //     props: {
  //       variant: "outlined",
  //       color: "primary",
  //       style: {
  //         minWidth: "200px",
  //         height: "48px",
  //         marginRight: "16px"
  //       }
  //     },
  //     children: {
  //       downloadReceiptButtonLabel: getLabel({
  //         labelName: "DOWNLOAD RECEIPT",
  //         labelKey: "TL_CONFIRMATION_BUTTON_DOWN_REPT"
  //       })
  //     },
  //     onClickDefination: {
  //       action: "condition",
  //       callBack: (state, dispatch) => {
  //         generateReceipt(state, dispatch, "receipt_download");
  //       }
  //     }
  //   },
  //   printReceiptButton: {
  //     componentPath: "Button",
  //     props: {
  //       variant: "contained",
  //       color: "primary",
  //       style: {
  //         minWidth: "200px",
  //         height: "48px",
  //         marginRight: "40px"
  //       }
  //     },
  //     children: {
  //       printReceiptButtonLabel: getLabel({
  //         labelName: "PRINT RECEIPT",
  //         labelKey: "TL_CONFIRMATION_BUTTON_PRT_REPT"
  //       })
  //     },
  //     onClickDefination: {
  //       action: "condition",
  //       callBack: (state, dispatch) => {
  //         generateReceipt(state, dispatch, "receipt_print");
  //       }
  //     }
  //   }
  // });
};
