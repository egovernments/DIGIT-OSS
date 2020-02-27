import {
  getCommonHeader,
  getCommonContainer
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { applicationSuccessFooter } from "./acknowledgementResource/applicationSuccessFooter";
import { paymentSuccessFooter } from "./acknowledgementResource/paymentSuccessFooter";
import { approvalSuccessFooter } from "./acknowledgementResource/approvalSuccessFooter";
import { gotoHomeFooter } from "./acknowledgementResource/gotoHomeFooter";
import { paymentFailureFooter } from "./acknowledgementResource/paymentFailureFooter";
import acknowledgementCard from "./acknowledgementResource/acknowledgementUtils";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { loadReceiptGenerationData } from "../utils/receiptTransformer";
import get from "lodash/get";
import set from "lodash/set";

const getAcknowledgementCard = (
  state,
  dispatch,
  purpose,
  status,
  applicationNumber,
  applicationNumberWater,
  applicationNumberSewerage,
  secondNumber,
  tenant
) => {
  if (purpose === "apply" && status === "success" && applicationNumberWater && applicationNumberSewerage) {
    return {
      header: getCommonHeader({
        labelKey: "WS_APPLICATION_NEW_CONNECTION_HEADER",
      }),
      applicationSuccessCard: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        props: {
          // style: {
          //   position: "absolute",
          //   width: "95%"
          // }
        },
        children: {
          card: acknowledgementCard({
            icon: "done",
            backgroundColor: "#39CB74",
            header: {
              labelName: "Thank you for submitting the Application",
              labelKey: "WS_APPLICATION_SUCCESS_MESSAGE_MAIN"
            },
            body: {
              labelName:
                " A notification regarding Application Submission has been sent to trade owner at registered Mobile No. Please note your application No. for future reference ",
              labelKey: "WS_APPLICATION_SUCCESS_ACKO_MESSAGE_SUB"
            },
            tailText: {
              labelName: "Water Application No.",
              labelKey: "WS_ACKNO_APP_NO_LABEL"
            },
            number: applicationNumberWater,
            tailTextOne: {
              labelName: "Water Application No.",
              labelKey: "WS_ACKNO_SEW_APP_NO_LABEL"
            },
            newNumber: applicationNumberSewerage,
          })
        }
      },
      iframeForPdf: {
        uiFramework: "custom-atoms",
        componentPath: "Div"
      },
      applicationSuccessFooter: applicationSuccessFooter(
        state,
        dispatch,
        applicationNumber,
        tenant
      )
    };
  } else if (purpose === "apply" && status === "success") {
    return {
      header: getCommonHeader({
        labelKey: "WS_APPLICATION_NEW_CONNECTION_HEADER",
      }),
      applicationSuccessCard: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        props: {
          // style: {
          //   position: "absolute",
          //   width: "95%"
          // }
        },
        children: {
          card: acknowledgementCard({
            icon: "done",
            backgroundColor: "#39CB74",
            header: {
              labelName: "Thank you for submitting the Application",
              labelKey: "WS_APPLICATION_SUCCESS_MESSAGE_MAIN"
            },
            body: {
              labelName:
                " A notification regarding application submission has been sent at registered mobile no. Please note the application no. for future reference. ",
              labelKey: "WS_APPLICATION_SUCCESS_ACKO_MESSAGE_SUB"
            },
            tailText: {
              labelName: "Water Application No.",
              labelKey: "WS_HOME_SEARCH_RESULTS_APP_NO_LABEL"
            },
            number: applicationNumber
          })
        }
      },
      iframeForPdf: {
        uiFramework: "custom-atoms",
        componentPath: "Div"
      },
      applicationSuccessFooter: applicationSuccessFooter(
        state,
        dispatch,
        applicationNumber,
        tenant
      )
    };
  } else if (purpose === "pay" && status === "success") {
    loadReceiptGenerationData(applicationNumber, tenant);
    return {
      header: getCommonContainer({
        header: getCommonHeader({
          labelName: `Payment for New Trade License ${financialYearText}`,
          labelKey: "WS_COMMON_PAYMENT_NEW_LICENSE",
          dynamicArray: [financialYearText]
        }),
        applicationNumber: {
          uiFramework: "custom-atoms-local",
          moduleName: "egov-wns",
          componentPath: "ApplicationNoContainer",
          props: {
            number: applicationNumber
          }
        }
      }),
      applicationSuccessCard: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        children: {
          card: acknowledgementCard({
            icon: "done",
            backgroundColor: "#39CB74",
            header: {
              labelName:
                "Payment is collected successfully, Now you can dowload and issue Trade License Certificate to citizen",
              labelKey: "WS_CONFIRMATION_MESSAGE_MAIN"
            },
            body: {
              labelName:
                "A notification regarding Payment Collection has been sent to trade owner at registered Mobile No.",
              labelKey: "WS_CONFIRMATION_MESSAGE_SUB"
            },
            tailText: {
              labelName: "Payment Receipt No.",
              labelKey: "WS_PMT_RCPT_NO"
            },
            number: secondNumber
          })
        }
      },
      paymentSuccessFooter: paymentSuccessFooter(
        state,
        dispatch,
        "APPROVED",
        applicationNumber
      )
    };
  } else if (purpose === "approve" && status === "success") {
    loadReceiptGenerationData(applicationNumber, tenant);
    return {
      header: getCommonContainer({
        header: getCommonHeader({
          labelName: `Trade License Application ${financialYearText}`,
          labelKey: "WS_TRADE_APPLICATION",
          dynamicArray: [financialYearText]
        }),
        applicationNumber: {
          uiFramework: "custom-atoms-local",
          moduleName: "egov-wns",
          componentPath: "ApplicationNoContainer",
          props: {
            number: applicationNumber
          }
        }
      }),
      applicationSuccessCard: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        children: {
          card: acknowledgementCard({
            icon: "done",
            backgroundColor: "#39CB74",
            header: {
              labelName: "Application is Approved Successfully",
              labelKey: "WS_APPROVAL_CHECKLIST_MESSAGE_HEAD"
            },
            body: {
              labelName:
                "A notification regarding Trade License Approval has been sent to trade owner at registered Mobile No.",
              labelKey: "WS_APPROVAL_CHECKLIST_MESSAGE_SUB"
            },
            tailText: {
              labelName: "Trade License No.",
              labelKey: "WS_HOME_SEARCH_RESULTS_WS_NO_LABEL"
            },
            number: secondNumber
          })
        }
      },
      approvalSuccessFooter
    };
  } else if (purpose === "sendback" && status === "success") {
    loadReceiptGenerationData(applicationNumber, tenant);
    return {
      header: getCommonContainer({
        header: getCommonHeader({
          labelName: `Trade License Application ${financialYearText}`,
          labelKey: "WS_TRADE_APPLICATION",
          dynamicArray: [financialYearText]
        }),
        applicationNumber: {
          uiFramework: "custom-atoms-local",
          moduleName: "egov-wns",
          componentPath: "ApplicationNoContainer",
          props: {
            number: applicationNumber
          }
        }
      }),
      applicationSuccessCard: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        children: {
          card: acknowledgementCard({
            icon: "done",
            backgroundColor: "#39CB74",
            header: {
              labelName: "Application is sent back Successfully",
              labelKey: "WS_SENDBACK_CHECKLIST_MESSAGE_HEAD"
            },
            // body: {
            //   labelName:
            //     "A notification regarding above application status has been sent to trade owner at registered Mobile No.",
            //   labelKey: "WS_SENDBACK_CHECKLIST_MESSAGE_SUB"
            // },
            tailText: {
              labelName: "Trade License No.",
              labelKey: "WS_HOME_SEARCH_RESULTS_WS_NO_LABEL"
            },
            number: secondNumber
          })
        }
      },
      approvalSuccessFooter
    };
  } else if (purpose === "application" && status === "rejected") {
    return {
      header: getCommonContainer({
        header: getCommonHeader({
          labelName: `Trade License Application ${financialYearText}`,
          labelKey: "WS_TRADE_APPLICATION",
          dynamicArray: [financialYearText]
        }),
        applicationNumber: {
          uiFramework: "custom-atoms-local",
          moduleName: "egov-wns",
          componentPath: "ApplicationNoContainer",
          props: {
            number: applicationNumber
          }
        }
      }),
      applicationSuccessCard: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        children: {
          card: acknowledgementCard({
            icon: "close",
            backgroundColor: "#E54D42",
            header: {
              labelName: "Trade License Application Rejected",
              labelKey: "WS_APPROVAL_REJ_MESSAGE_HEAD"
            },
            body: {
              labelName:
                "A notification regarding Trade License Rejection has been sent to trade owner at registered Mobile No.",
              labelKey: "WS_APPROVAL_REJ_MESSAGE_SUBHEAD"
            }
          })
        }
      },
      gotoHomeFooter
    };
  } else if (purpose === "application" && status === "cancelled") {
    return {
      header: getCommonContainer({
        header: getCommonHeader({
          labelName: `Trade License Application ${financialYearText}`,
          labelKey: "WS_TRADE_APPLICATION",
          dynamicArray: [financialYearText]
        }),
        applicationNumber: {
          uiFramework: "custom-atoms-local",
          moduleName: "egov-wns",
          componentPath: "ApplicationNoContainer",
          props: {
            number: applicationNumber
          }
        }
      }),
      applicationSuccessCard: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        children: {
          card: acknowledgementCard({
            icon: "close",
            backgroundColor: "#E54D42",
            header: {
              labelName: "Trade License Cancelled",
              labelKey: "WS_WS_CANCELLED_MESSAGE_HEAD"
            },
            body: {
              labelName:
                "A notification regarding Trade License cancellation has been sent to trade owner at registered Mobile No.",
              labelKey: "WS_WS_CANCELLED_MESSAGE_SUBHEAD"
            },
            tailText: {
              labelName: "Trade License No.",
              labelKey: "WS_HOME_SEARCH_RESULTS_WS_NO_LABEL"
            },
            number: secondNumber
          })
        }
      },
      gotoHomeFooter
    };
  } else if (purpose === "pay" && status === "failure") {
    return {
      header: getCommonContainer({
        header: getCommonHeader({
          labelName: `Trade License Application ${financialYearText}`,
          dynamicArray: [financialYearText],
          labelKey: "WS_TRADE_APPLICATION"
        }),
        applicationNumber: {
          uiFramework: "custom-atoms-local",
          moduleName: "egov-wns",
          componentPath: "ApplicationNoContainer",
          props: {
            number: applicationNumber
          }
        }
      }),
      applicationSuccessCard: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        children: {
          card: acknowledgementCard({
            icon: "close",
            backgroundColor: "#E54D42",
            header: {
              labelName: "Payment has failed!",
              labelKey: "WS_PAYMENT_FAILED"
            },
            body: {
              labelName:
                "A notification regarding payment failure has been sent to the trade owner and applicant.",
              labelKey: "WS_PAYMENT_NOTIFICATION"
            }
          })
        }
      },
      paymentFailureFooter: paymentFailureFooter(applicationNumber, tenant)
    };
  } else if (purpose === "mark" && status === "success") {
    return {
      header: getCommonHeader({
        labelName: `Application for Trade License ${financialYearText}`,
        labelKey: "WS_APPLICATION_TRADE_LICENSE",
        dynamicArray: [financialYearText]
      }),
      applicationSuccessCard: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        children: {
          card: acknowledgementCard({
            icon: "done",
            backgroundColor: "#39CB74",
            header: {
              labelName: "Application Marked Successfully",
              labelKey: "WS_MARK_SUCCESS_MESSAGE_MAIN"
            },
            body: {
              labelName: "Application has been marked successfully",
              labelKey: "WS_APPLICATION_MARKED_SUCCESS"
            },
            tailText: {
              labelName: "Application No.",
              labelKey: "WS_HOME_SEARCH_RESULTS_APP_NO_LABEL"
            },
            number: applicationNumber
          })
        }
      },
      gotoHomeFooter
    };
  } else if (purpose === "forward" && status === "success") {
    return {
      header: getCommonHeader({
        labelName: `Application for Trade License ${financialYearText}`,
        labelKey: "WS_APPLICATION_TRADE_LICENSE",
        dynamicArray: [financialYearText]
      }),
      applicationSuccessCard: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        children: {
          card: acknowledgementCard({
            icon: "done",
            backgroundColor: "#39CB74",
            header: {
              labelName: "Application Forwarded Successfully",
              labelKey: "WS_FORWARD_SUCCESS_MESSAGE_MAIN"
            },
            body: {
              labelName:
                "A notification regarding above application status has been sent to trade owner at registered Mobile No.",
              labelKey: "WS_APPLICATION_FORWARD_SUCCESS"
            },
            tailText: {
              labelName: "Application No.",
              labelKey: "WS_HOME_SEARCH_RESULTS_APP_NO_LABEL"
            },
            number: applicationNumber
          })
        }
      },
      gotoHomeFooter
    };
  }
};

export const downloadPrintContainer = (
  action,
  state,
  dispatch,
  status,
  applicationNumber,
  tenantId
) => {
  /** MenuButton data based on status */
  let downloadMenu = [];
  let printMenu = [];
  let tlCertificateDownloadObject = {
    label: { labelName: "TL Certificate", labelKey: "TL_CERTIFICATE" },
    link: () => {
      const { Licenses } = state.screenConfiguration.preparedFinalObject;
      downloadCertificateForm(Licenses);
    },
    leftIcon: "book"
  };
  let tlCertificatePrintObject = {
    label: { labelName: "TL Certificate", labelKey: "TL_CERTIFICATE" },
    link: () => {
      const { Licenses } = state.screenConfiguration.preparedFinalObject;
      downloadCertificateForm(Licenses, 'print');
    },
    leftIcon: "book"
  };
  let receiptDownloadObject = {
    label: { labelName: "Receipt", labelKey: "TL_RECEIPT" },
    link: () => {
      const receiptQueryString = [
        { key: "consumerCodes", value: get(state.screenConfiguration.preparedFinalObject.Licenses[0], "applicationNumber") },
        { key: "tenantId", value: get(state.screenConfiguration.preparedFinalObject.Licenses[0], "tenantId") }
      ]
      download(receiptQueryString);
    },
    leftIcon: "receipt"
  };
  let receiptPrintObject = {
    label: { labelName: "Receipt", labelKey: "TL_RECEIPT" },
    link: () => {
      const receiptQueryString = [
        { key: "consumerCodes", value: get(state.screenConfiguration.preparedFinalObject.Licenses[0], "applicationNumber") },
        { key: "tenantId", value: get(state.screenConfiguration.preparedFinalObject.Licenses[0], "tenantId") }
      ]
      download(receiptQueryString, "print");
    },
    leftIcon: "receipt"
  };
  let applicationDownloadObject = {
    label: { labelName: "Application", labelKey: "TL_APPLICATION" },
    link: () => {
      const { Licenses, LicensesTemp } = state.screenConfiguration.preparedFinalObject;
      const documents = LicensesTemp[0].reviewDocData;
      set(Licenses[0], "additionalDetails.documents", documents)
      downloadAcknowledgementForm(Licenses);
    },
    leftIcon: "assignment"
  };
  let applicationPrintObject = {
    label: { labelName: "Application", labelKey: "TL_APPLICATION" },
    link: () => {
      const { Licenses, LicensesTemp } = state.screenConfiguration.preparedFinalObject;
      const documents = LicensesTemp[0].reviewDocData;
      set(Licenses[0], "additionalDetails.documents", documents)
      downloadAcknowledgementForm(Licenses, 'print');
    },
    leftIcon: "assignment"
  };
  switch (status) {
    case "APPROVED":
      downloadMenu = [
        tlCertificateDownloadObject,
        receiptDownloadObject,
        applicationDownloadObject
      ];
      printMenu = [
        tlCertificatePrintObject,
        receiptPrintObject,
        applicationPrintObject
      ];
      break;
    case "APPLIED":
    case "CITIZENACTIONREQUIRED":
    case "FIELDINSPECTION":
    case "PENDINGAPPROVAL":
    case "PENDINGPAYMENT":
      downloadMenu = [applicationDownloadObject];
      printMenu = [applicationPrintObject];
      break;
    case "CANCELLED":
      downloadMenu = [applicationDownloadObject];
      printMenu = [applicationPrintObject];
      break;
    case "REJECTED":
      downloadMenu = [applicationDownloadObject];
      printMenu = [applicationPrintObject];
      break;
    default:
      break;
  }
  /** END */

  return {
    rightdiv: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      props: {
        style: { textAlign: "right", display: "flex" }
      },
      children: {
        downloadMenu: {
          uiFramework: "custom-atoms-local",
          moduleName: "egov-tradelicence",
          componentPath: "MenuButton",
          props: {
            data: {
              label: { labelName: "DOWNLOAD", labelKey: "TL_DOWNLOAD" },
              leftIcon: "cloud_download",
              rightIcon: "arrow_drop_down",
              props: { variant: "outlined", style: { height: "60px", color: "#FE7A51" }, className: "tl-download-button" },
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
              label: { labelName: "PRINT", labelKey: "TL_PRINT" },
              leftIcon: "print",
              rightIcon: "arrow_drop_down",
              props: { variant: "outlined", style: { height: "60px", color: "#FE7A51" }, className: "tl-print-button" },
              menu: printMenu
            }
          }
        }

      },
      // gridDefination: {
      //   xs: 12,
      //   sm: 6
      // }
    }
  }
};

const screenConfig = {
  uiFramework: "material-ui",
  name: "acknowledgement",
  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      props: {
        className: "common-div-css"
      }
    }
  },
  beforeInitScreen: (action, state, dispatch) => {
    const purpose = getQueryArg(window.location.href, "purpose");
    const status = getQueryArg(window.location.href, "status");
    const applicationNumber = getQueryArg(window.location.href, "applicationNumber");
    const applicationNumberWater = getQueryArg(window.location.href, "applicationNumberWater");
    const applicationNumberSewerage = getQueryArg(window.location.href, "applicationNumberSewerage");
    const secondNumber = getQueryArg(window.location.href, "secondNumber");
    const tenant = getQueryArg(window.location.href, "tenantId");
    if (applicationNumberSewerage && applicationNumberWater) {
      const cardOne = getAcknowledgementCard(state, dispatch, purpose, status, applicationNumber, applicationNumberWater, applicationNumberSewerage, secondNumber, tenant);
      set(action, "screenConfig.components.div.children", cardOne);
    } else {
      const data = getAcknowledgementCard(
        state,
        dispatch,
        purpose,
        status,
        applicationNumber,
        secondNumber,
        // financialYear,
        tenant
      );
      set(action, "screenConfig.components.div.children", data);
    }
    return action;
  }
};

export default screenConfig;
