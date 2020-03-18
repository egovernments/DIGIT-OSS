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
import { downloadApp } from "../../../../ui-utils/commons";
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
              labelName: "Sewerage Application No.",
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
              labelName: "Application Number.",
              labelKey: "WS_ACK_COMMON_APP_NO_LABEL"
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
          labelName: `Application for New Water and Sewerage Connection`,
          labelKey: "WS_APPLICATION_NEW_CONNECTION_HEADER",
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
                "A notification regarding Approval connection has been sent to registered Mobile No.",
              labelKey: "WS_APPROVAL_CHECKLIST_MESSAGE_SUB"
            },
            tailText: {
              labelName: "Application Number.",
              labelKey: "WS_ACK_COMMON_APP_NO_LABEL"
            },
            number: applicationNumber
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
          labelName: `Application for New Water and Sewerage Connection`,
          labelKey: "WS_APPLICATION_NEW_CONNECTION_HEADER"
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
            body: {
              labelName:
                "A notification regarding above application status has been sent to registered Mobile No.",
              labelKey: "WS_SENDBACK_CHECKLIST_MESSAGE_SUB"
            },
            tailText: {
              labelName: "Application Number.",
              labelKey: "WS_ACK_COMMON_APP_NO_LABEL"
            },
            number: applicationNumber
          })
        }
      },
      approvalSuccessFooter
    };
  } else if (purpose === "application" && status === "rejected") {
    return {
      header: getCommonContainer({
        header: getCommonHeader({
          labelName: `Application for New Water and Sewerage Connection`,
          labelKey: "WS_APPLICATION_NEW_CONNECTION_HEADER"
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
              labelName: "Application Rejected",
              labelKey: "WS_APPROVAL_REJ_MESSAGE_HEAD"
            },
            body: {
              labelName:
                "A notification regarding Application Rejection has been sent to registered Mobile No.",
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
          labelKey: "TL_TRADE_APPLICATION",
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
              labelKey: "TL_TL_CANCELLED_MESSAGE_SUBHEAD"
            },
            tailText: {
              labelName: "Trade License No.",
              labelKey: "TL_HOME_SEARCH_RESULTS_TL_NO_LABEL"
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
          labelKey: "TL_TRADE_APPLICATION"
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
              labelKey: "TL_PAYMENT_FAILED"
            },
            body: {
              labelName:
                "A notification regarding payment failure has been sent to the trade owner and applicant.",
              labelKey: "TL_PAYMENT_NOTIFICATION"
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
        labelName: `Application for New Water and Sewerage Connection`,
        labelKey: "WS_APPLICATION_NEW_CONNECTION_HEADER"
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
                "A notification regarding above application status has been sent to registered Mobile No.",
              labelKey: "WS_APPLICATION_FORWARD_SUCCESS_SUBHEAD"
            },
            tailText: {
              labelName: "Application No.",
              labelKey: "WS_ACK_COMMON_APP_NO_LABEL"
            },
            number: applicationNumber
          })
        }
      },
      gotoHomeFooter
    };
  } else if (purpose === "activate" && status === "success") {
    return {
      header: getCommonHeader({
        labelName: `Application for New Water and Sewerage Connection`,
        labelKey: "WS_APPLICATION_NEW_CONNECTION_HEADER"
      }),
      applicationSuccessCard: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        children: {
          card: acknowledgementCard({
            icon: "done",
            backgroundColor: "#39CB74",
            header: {
              labelName: "Connection Activated Successfully ",
              labelKey: "WS_ACTIVATE_SUCCESS_MESSAGE_MAIN"
            },
            body: {
              labelName:
                "A notification regarding above application status has been sent to registered Mobile No.",
              labelKey: "WS_CONNECTION_ACTIVATE_SUCCESS_SUBHEAD"
            },
            tailText: {
              labelName: "Application No.",
              labelKey: "WS_ACK_COMMON_APP_NO_LABEL"
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
  appStatus,
  applicationNumber,
  tenantId
) => {
  /** MenuButton data based on status */
  let downloadMenu = [];
  let printMenu = [];
  let wsEstimateDownloadObject = {
    label: { labelKey: "WS_ESTIMATION_NOTICE" },
    link: () => {
      const { WaterConnection } = state.screenConfiguration.preparedFinalObject;
      downloadApp(WaterConnection, 'estimateNotice');
    },
    leftIcon: "book"
  };
  let wsEstimatePrintObject = {
    label: { labelKey: "WS_ESTIMATION_NOTICE" },
    link: () => {
      const { WaterConnection } = state.screenConfiguration.preparedFinalObject;
      downloadApp(WaterConnection, 'estimateNotice', 'print');
    },
    leftIcon: "book"
  };
  let sanctionDownloadObject = {
    label: { labelKey: "WS_SANCTION_LETTER" },
    link: () => {
      const { WaterConnection } = state.screenConfiguration.preparedFinalObject;
      const appUserType = process.env.REACT_APP_NAME === "Citizen" ? "To Citizen" : "Department Use";
      WaterConnection[0].appUserType = appUserType;
      WaterConnection[0].commissionerName = "S.Ravindra Babu";
      downloadApp(WaterConnection, 'sanctionLetter');
    },
    leftIcon: "receipt"
  };
  let sanctionPrintObject = {
    label: { labelKey: "WS_SANCTION_LETTER" },
    link: () => {
      const { WaterConnection } = state.screenConfiguration.preparedFinalObject;
      const appUserType = process.env.REACT_APP_NAME === "Citizen" ? "Department Use" : "To Citizen";
      WaterConnection[0].appUserType = appUserType;
      WaterConnection[0].commissionerName = "S.Ravindra Babu";
      downloadApp(WaterConnection, 'sanctionLetter', 'print');
    },
    leftIcon: "receipt"
  };
  let applicationDownloadObject = {
    label: { labelKey: "WS_APPLICATION" },
    link: () => {
      const { WaterConnection, DocumentsData } = state.screenConfiguration.preparedFinalObject;
      let filteredDocs = DocumentsData;
      filteredDocs.map((val) => {
        if (val.title.includes("WS_OWNER.IDENTITYPROOF.")) {
          val.title = "WS_OWNER.IDENTITYPROOF";
        } else if (val.title.includes("WS_OWNER.ADDRESSPROOF.")) {
          val.title = "WS_OWNER.ADDRESSPROOF";
        }
      });
      WaterConnection[0].pdfDocuments = filteredDocs;
      downloadApp(WaterConnection, 'application');
    },
    leftIcon: "assignment"
  };
  let applicationPrintObject = {
    label: { labelName: "Application", labelKey: "WS_APPLICATION" },
    link: () => {
      const { WaterConnection, DocumentsData } = state.screenConfiguration.preparedFinalObject;
      let filteredDocs = DocumentsData;
      filteredDocs.map((val) => {
        if (val.title.includes("WS_OWNER.IDENTITYPROOF.")) {
          val.title = "WS_OWNER.IDENTITYPROOF";
        } else if (val.title.includes("WS_OWNER.ADDRESSPROOF.")) {
          val.title = "WS_OWNER.ADDRESSPROOF";
        }
      });
      WaterConnection[0].pdfDocuments = filteredDocs;
      downloadApp(WaterConnection, 'application', 'print');
    },
    leftIcon: "assignment"
  };
  switch (appStatus) {
    case "PENDING_FOR_DOCUMENT_VERIFICATION":
    case "PENDING_FOR_CITIZEN_ACTION":
    case "PENDING_FOR_FIELD_INSPECTION":
      downloadMenu = [applicationDownloadObject];
      printMenu = [applicationPrintObject];
      break;
    case "PENDING_APPROVAL_FOR_CONNECTION":
      downloadMenu = [applicationDownloadObject, wsEstimateDownloadObject];
      printMenu = [applicationPrintObject, wsEstimatePrintObject];
      break;
    case "PENDING_FOR_PAYMENT":
    case "PENDING_FOR_CONNECTION_ACTIVATION":
    case "CONNECTION_ACTIVATED":
      downloadMenu = [sanctionDownloadObject, wsEstimateDownloadObject, applicationDownloadObject];
      printMenu = [sanctionPrintObject, wsEstimatePrintObject, applicationPrintObject];
      break;
    case "REJECTED":
      downloadMenu = [applicationDownloadObject];
      printMenu = [applicationPrintObject];
      break;
    default: downloadMenu = [applicationDownloadObject];
      printMenu = [applicationPrintObject];
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
              label: { labelName: "DOWNLOAD", labelKey: "WS_COMMON_BUTTON_DOWNLOAD" },
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
              label: { labelName: "PRINT", labelKey: "WS_COMMON_BUTTON_PRINT" },
              leftIcon: "print",
              rightIcon: "arrow_drop_down",
              props: { variant: "outlined", style: { height: "60px", color: "#FE7A51", marginLeft: "15px" }, className: "tl-print-button" },
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
    // const service = getQueryArg(window.location.href, "service");
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
