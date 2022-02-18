import {
  getCommonHeader,
  getCommonContainer
} from "egov-ui-framework/ui-config/screens/specs/utils";
import {
  applicationSuccessFooter,
  paymentSuccessFooter,
  gotoHomeFooter,
  approvalSuccessFooter,
  paymentFailureFooter
} from "./acknowledgementResource/footers";
import acknowledgementCard from "./acknowledgementResource/acknowledgementUtils";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import set from "lodash/set";
import get from "lodash/get";
import { getCurrentFinancialYear, permitOrderNoDownload } from "../utils";
import { download, getAppSearchResults } from "../../../../ui-utils/commons";
import {
  prepareFinalObject
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
export const header = getCommonContainer({
  header: getCommonHeader({
    labelName: `Payment Information (${getCurrentFinancialYear()})`, //later use getFinancialYearDates
    labelKey: "COMMON_PAY_SCREEN_HEADER"
  }),
  applicationNumber: {
    uiFramework: "custom-atoms-local",
    moduleName: "egov-bpa",
    componentPath: "ApplicationNoContainer",
    props: {
      number: getQueryArg(window.location.href, "consumerCode")
    },
    visible: true
  }
});


const getHeader=(applicationNumber)=>{
return getCommonContainer({
  header: getCommonHeader({
    labelName: `Application for BPA (${getCurrentFinancialYear()})`, //later use getFinancialYearDates
    labelKey: "BPA_COMMON_APPLY_BPA_HEADER_LABEL"
  }),
  applicationNumber: {
    uiFramework: "custom-atoms-local",
    moduleName: "egov-bpa",
    componentPath: "ApplicationNoContainer",
    props: {
      number: applicationNumber
    },
    visible: true
  }
})
}

const getNOCHeader=(applicationNumber)=>{
  return getCommonContainer({
    header: getCommonHeader({
      labelName: `Application for Noc`,
      labelKey: "NOC_COMMON_HEADER_LABEL"
    }),
    applicationNumber: {
      uiFramework: "custom-atoms-local",
      moduleName: "egov-bpa",
      componentPath: "ApplicationNoContainer",
      props: {
        number: applicationNumber
      },
      visible: true
    }
  })
  }

const downloadprintMenu = (action, state, dispatch, applicationNumber, tenantId, uiCommonPayConfig, businessService) => {
  const receiptKey = get(uiCommonPayConfig, "receiptKey","consolidatedreceipt");
  let keyLabel = "BPA_PERMIT_ORDER";
  if(window.location.href.includes("BPA.NC_OC_SAN_FEE")) {
    keyLabel = "BPA_OC_PERMIT_ORDER"
  }
   let receiptDownloadObject = {
       label: { labelName: "DOWNLOAD RECEIPT", labelKey: "COMMON_DOWNLOAD_RECEIPT" },
       link: () => {
           const receiptQueryString = [
               { key: "receiptNumbers", value: applicationNumber },
               { key: "tenantId", value: tenantId }
           ]
           download(receiptQueryString, "download", receiptKey, state, businessService);

       },
       leftIcon: "receipt"
   };
   let applicationDownloadObject = {
    label: { labelName: "Permit Order Receipt", labelKey: keyLabel },
    link: () => {
      permitOrderNoDownload(action, state, dispatch, "Download");
      // generatePdf(state, dispatch, "application_download");
    },
    leftIcon: "assignment"
  };
  let applicationPrintObject = {
    label: { labelName: "Permit Order Receipt", labelKey: keyLabel },
    link: () => {
      permitOrderNoDownload(action, state, dispatch, "Print");
      // generatePdf(state, dispatch, "application_download");
    },
    leftIcon: "assignment"
  };
   let receiptPrintObject = {
       label: { labelName: "PRINT RECEIPT", labelKey: "COMMON_PRINT_RECEIPT" },
       link: () => {
           const receiptQueryString = [
               { key: "receiptNumbers", value: applicationNumber },
               { key: "tenantId", value: tenantId }
           ]
           download(receiptQueryString, "print", receiptKey, state, businessService);
       },
       leftIcon: "receipt"
   };
   let downloadMenu = [];
   let printMenu = [];
   switch (businessService) {
    case "BPA.LOW_RISK_PERMIT_FEE":
    case "BPA.NC_SAN_FEE":
    case "BPA.NC_OC_SAN_FEE":    
    downloadMenu = [receiptDownloadObject, applicationDownloadObject];
    printMenu = [receiptPrintObject, applicationPrintObject];    
    break;   
    default:
    downloadMenu = [receiptDownloadObject];    
    printMenu = [receiptPrintObject];
    break;    
  }

   return {
       uiFramework: "custom-atoms",
       componentPath: "Div",
       props: {
           className: "downloadprint-commonmenu",
           style: { textAlign: "right", display: "flex" }
       },
       children: {
           downloadMenu: {
               uiFramework: "custom-molecules",
               componentPath: "DownloadPrintButton",
               props: {
                   data: {
                       label: { labelName: "DOWNLOAD", labelKey: "TL_DOWNLOAD" },
                       leftIcon: "cloud_download",
                       rightIcon: "arrow_drop_down",
                       props: { variant: "outlined", style: { height: "60px", color: "#FE7A51",marginRight:"5px" }, className: "tl-download-button" },
                       menu: downloadMenu
                   }
               }
           },
           printMenu: {
               uiFramework: "custom-molecules",
               componentPath: "DownloadPrintButton",
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
   }

}

const getAcknowledgementCard = (
  action,
  state,
  dispatch,
  purpose,
  status,
  applicationNumber,
  secondNumber,
  tenant,
  businessService,
  moduleName
) => {
  const uiCommonPayConfig = get(state.screenConfiguration.preparedFinalObject, "commonPayInfo");  
  if (purpose === "apply" && status === "success") {
    return {
      header:getHeader(applicationNumber),
      applicationSuccessCard: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        children: {
          card: acknowledgementCard({
            icon: "done",
            backgroundColor: "#39CB74",
            header: {
              labelName: "Application Submitted Successfully",
              labelKey: "BPA_APPLICATION_SUCCESS_MESSAGE_MAIN"
            },
            body: {
              labelName:
                "A notification regarding Application Submission has been sent to building owner at registered Mobile No.",
              labelKey: "BPA_APPLICATION_SUCCESS_MESSAGE_SUB"
            },
            tailText: {
              labelName: "Application No.",
              labelKey: "BPA_HOME_SEARCH_RESULTS_APP_NO_LABEL"
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
  } else if (purpose === "apply_skip" && status === "success") {
    return {
      header:getHeader(applicationNumber),
      applicationSuccessCard: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        children: {
          card: acknowledgementCard({
            icon: "done",
            backgroundColor: "#39CB74",
            header: {
              labelName: "Application Submitted Successfully",
              labelKey: "BPA_APPLICATION_SUCCESS_MESSAGE_MAIN"
            },
            body: {
              labelName:
                "A notification regarding Application Submission has been sent to building owner at registered Mobile No.",
              labelKey: "BPA_APPLICATION_SUCCESS_MESSAGE_SUB"
            },
            tailText: {
              labelName: "Application No.",
              labelKey: "BPA_HOME_SEARCH_RESULTS_APP_NO_LABEL"
            },
            number: applicationNumber
          })
        }
      },
      iframeForPdf: {
        uiFramework: "custom-atoms",
        componentPath: "Div"
      },
      gotoHomeFooter
    };
  } else if (purpose === "SEND_TO_CITIZEN" && status === "success") {
    return {
      header:getHeader(applicationNumber),
      applicationSuccessCard: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        children: {
          card: acknowledgementCard({
            icon: "done",
            backgroundColor: "#39CB74",
            header: {
              labelName: "Application Successfully Sent To Citizen",
              labelKey: "BPA_APPLICATION_SENT_TO_CITIZEN_SUCCESS_MESSAGE_MAIN"
            },
            body: {
              labelName:
                "A notification has been sent to Architect",
              labelKey: "BPA_APPROVAL_SENT_TO_CITIZEN_SUBHEAD"
            },
            tailText: {
              labelName: "Application No.",
              labelKey: "BPA_HOME_SEARCH_RESULTS_APP_NO_LABEL"
            },
            number: applicationNumber
          })
        }
      },
      iframeForPdf: {
        uiFramework: "custom-atoms",
        componentPath: "Div"
      },
      gotoHomeFooter
      // applicationSuccessFooter: applicationSuccessFooter(
      //   state,
      //   dispatch,
      //   applicationNumber,
      //   tenant
      // )
    };
  } else if (purpose === "APPROVE" && status === "success") {
    return {
      header:getHeader(applicationNumber),
      applicationSuccessCard: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        children: {
          card: acknowledgementCard({
            icon: "done",
            backgroundColor: "#39CB74",
            header: {
              labelName: "Application Approved By Citizen Successfully",
              labelKey: "BPA_APPLICATION_APPROVED_ARCT_SUCCESS_MESSAGE_MAIN"
            },
            body: {
              labelName: "A notification has been sent to Architect",
              labelKey: "BPA_APPLICATION_APPROVED_ARCT_SUCCESS_BODY_MESSAGE"
            },
            tailText: {
              labelName: "Application No.",
              labelKey: "BPA_HOME_SEARCH_RESULTS_APP_NO_LABEL"
            },
            number: applicationNumber
          })
        }
      },
      iframeForPdf: {
        uiFramework: "custom-atoms",
        componentPath: "Div"
      },
      gotoHomeFooter
      // applicationSuccessFooter: applicationSuccessFooter(
      //   state,
      //   dispatch,
      //   applicationNumber,
      //   tenant
      // )
    };
  } else if (purpose === "SEND_TO_ARCHITECT" && status === "success") {
    return {
      header:getHeader(applicationNumber),
      applicationSuccessCard: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        children: {
          card: acknowledgementCard({
            icon: "done",
            backgroundColor: "#39CB74",
            header: {
              labelName: "Application Send To Architect Successfully",
              labelKey: "BPA_APPLICATION_SEND_TO_ARCHITECT_SUCCESS_MESSAGE_MAIN"
            },
            body: {
              labelName:
                "A notification has been sent to Architect",
              labelKey: "BPA_APPROVAL_SEND_TO_ARCHITECT_SUBHEAD"
            },
            tailText: {
              labelName: "Application No.",
              labelKey: "BPA_HOME_SEARCH_RESULTS_APP_NO_LABEL"
            },
            number: applicationNumber
          })
        }
      },
      iframeForPdf: {
        uiFramework: "custom-atoms",
        componentPath: "Div"
      },
      // applicationSuccessFooter: applicationSuccessFooter(
      //   state,
      //   dispatch,
      //   applicationNumber,
      //   tenant
      // )
      gotoHomeFooter
    };
  }  else if (purpose === "pay" && status === "success") {
    return {
      header,
      headerdownloadprint: downloadprintMenu(action, state, dispatch, secondNumber, tenant, uiCommonPayConfig, businessService),      
      applicationSuccessCard: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        children: {
          card: acknowledgementCard({
            icon: "done",
            backgroundColor: "#39CB74",
            header: {
              labelName: "Payment has been collected successfully!",
              labelKey: "CITIZEN_SUCCESS_BPA_NC_APP_FEE_PAYMENT_MESSAGE"
            },
            body: {
              labelName:
                "A notification regarding Payment Collection has been sent to building owner at registered Mobile No.",
              labelKey: "CITIZEN_SUCCESS_BPA_NC_APP_FEE_PAYMENT_MESSAGE_DETAIL"
            },
            tailText: {
              labelName: "Payment Receipt No.",
              labelKey: "CITIZEN_SUCCESS_BPA_NC_APP_FEE_PAYMENT_RECEIPT_NO"
            },
            number: secondNumber,
            tailText: {
              labelName: "Payment Receipt No.",
              labelKey: "CITIZEN_SUCCESS_BPA_NC_APP_FEE_PAYMENT_RECEIPT_NO"
            },
            // number: secondNumber
          })
        }
      },
      paymentSuccessFooter: paymentSuccessFooter()
    };
  } else if (purpose === "approve" && status === "success" && moduleName !== "Noc") {
    return {
      header:getHeader(applicationNumber),
      applicationSuccessCard: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        children: {
          card: acknowledgementCard({
            icon: "done",
            backgroundColor: "#39CB74",
            header: {
              labelName: "BPA Approved Successfully",
              labelKey: "BPA_APPROVAL_CHECKLIST_MESSAGE_HEAD"
            },
            body: {
              labelName:
                "A notification regarding BPA Approval has been sent to building owner at registered Mobile No.",
              labelKey: "BPA_APPROVAL_CHECKLIST_MESSAGE_SUB"
            },
            // tailText: {
            //   labelName: "BPA No.",
            //   labelKey: "BPA_HOME_SEARCH_RESULTS_BPA_NO_LABEL"
            // },
            // number: secondNumber
          })
        }
      },
      approvalSuccessFooter
    };
  } else if (purpose === "approve" && status === "success" && moduleName === "Noc") {
    return {
      header:getNOCHeader(applicationNumber),
      applicationSuccessCard: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        children: {
          card: acknowledgementCard({
            icon: "done",
            backgroundColor: "#39CB74",
            header: {
              labelName: "BPA Approved Successfully",
              labelKey: "BPA_APPROVAL_CHECKLIST_MESSAGE_HEAD"
            },
            body: {
              labelName:
                "A notification regarding BPA Approval has been sent to building owner at registered Mobile No.",
              labelKey: "BPA_APPROVAL_CHECKLIST_MESSAGE_SUB"
            },
          })
        }
      },
      approvalSuccessFooter
    };
  } else if (purpose === "application" && status === "rejected" && moduleName === "Noc") {
    return {
      header:getNOCHeader(applicationNumber),
      applicationSuccessCard: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        children: {
          card: acknowledgementCard({
            icon: "close",
            backgroundColor: "#E54D42",
            header: {
              labelName: "Application for NOC is rejected",
              labelKey: "NOC_BPA_APPROVAL_REJECTED_MESSAGE_HEAD"
            },
            body: {
              labelName:
                "A notification regarding BPA Rejection has been sent to building owner at registered Mobile No.",
              labelKey: "NOC_BPA_APPROVAL_REJE_MESSAGE_SUBHEAD"
            }
          })
        }
      },
      gotoHomeFooter
    };
  } else if (purpose === "application" && status === "rejected" && moduleName !== "Noc") {
    return {
      header:getHeader(applicationNumber),
      applicationSuccessCard: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        children: {
          card: acknowledgementCard({
            icon: "close",
            backgroundColor: "#E54D42",
            header: {
              labelName: "Application for permit order is rejected",
              labelKey: "BPA_APPROVAL_REJECTED_MESSAGE_HEAD"
            },
            body: {
              labelName:
                "A notification regarding BPA Rejection has been sent to building owner at registered Mobile No.",
              labelKey: "BPA_APPROVAL_REJE_MESSAGE_SUBHEAD"
            },
            tailText: {
              labelName: "Application No.",
              labelKey: "BPA_HOME_SEARCH_RESULTS_APP_NO_LABEL"
            },
            number: applicationNumber
          })
        }
      },
      gotoHomeFooter
    };
  } else if (purpose === "application" && status === "revocated") {
    return {
      header:getHeader(applicationNumber),
      applicationSuccessCard: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        children: {
          card: acknowledgementCard({
            icon: "close",
            backgroundColor: "#E54D42",
            header: {
              labelName: "Application for permit order is revocated",
              labelKey: "BPA_APPROVAL_REVOCATED_MESSAGE_HEAD"
            },
            body: {
              labelName:
                "A notification regarding Building Permit application revocation has been sent to applicant at registered Mobile No.",
              labelKey: "BPA_APPROVAL_REV_MESSAGE_SUBHEAD"
            },
            tailText: {
              labelName: "Application No.",
              labelKey: "BPA_HOME_SEARCH_RESULTS_APP_NO_LABEL"
            },
            number: applicationNumber
          })
        }
      },
      gotoHomeFooter
    };
  } else if (purpose === "application" && status === "cancelled") {
    return {
      header,
      applicationSuccessCard: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        children: {
          card: acknowledgementCard({
            icon: "close",
            backgroundColor: "#E54D42",
            header: {
              labelName: "BPA Cancelled",
              labelKey: "BPA_CANCELLED_MESSAGE_HEAD"
            },
            body: {
              labelName:
                "A notification regarding BPA cancellation has been sent to building owner at registered Mobile No.",
              labelKey: "BPA_CANCELLED_MESSAGE_SUBHEAD"
            },
            tailText: {
              labelName: "BPA No.",
              labelKey: "BPA_HOME_SEARCH_RESULTS_BPA_NO_LABEL"
            },
            number: secondNumber
          })
        }
      },
      gotoHomeFooter
    };
  } else if (purpose === "pay" && status === "failure") {
    return {
      header,
      applicationSuccessCard: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        children: {
          card: acknowledgementCard({
            icon: "close",
            backgroundColor: "#E54D42",
            header: {
              labelName: "Payment has failed!",
              labelKey: "BPA_PAYMENT_FAILED"
            },
            body: {
              labelName:
                "A notification regarding payment failure has been sent to the building owner and applicant.",
              labelKey: "BPA_PAYMENT_FAILURE_MESSAGE_SUB"
            }
          })
        }
      },
      paymentFailureFooter: paymentFailureFooter(applicationNumber, tenant)
    };
  } else if (purpose === "mark" && status === "success") {
    return {
      header,
      applicationSuccessCard: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        children: {
          card: acknowledgementCard({
            icon: "done",
            backgroundColor: "#39CB74",
            header: {
              labelName: "Application Marked Successfully",
              labelKey: "BPA_MARK_SUCCESS_MESSAGE_MAIN"
            },
            body: {
              labelName: "Application has been marked successfully",
              labelKey: "BPA_APPLICATION_MARKED_SUCCESS"
            },
            tailText: {
              labelName: "Application No.",
              labelKey: "BPA_HOME_SEARCH_RESULTS_APP_NO_LABEL"
            },
            number: applicationNumber
          })
        }
      },
      gotoHomeFooter
    };
  } else if ((purpose === "forward" || purpose === "FORWARD") && status === "success") {
    return {
      header:getHeader(applicationNumber),
      applicationSuccessCard: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        children: {
          card: acknowledgementCard({
            icon: "done",
            backgroundColor: "#39CB74",
            header: {
              labelName: "Application Forwarded Successfully",
              labelKey: "BPA_FORWARD_SUCCESS_MESSAGE_MAIN"
            },
            body: {
              labelName: "Application has been forward successfully",
              labelKey: "BPA_APPLICATION_FORWARD_SUCCESSFULLY"
            },
            tailText: {
              labelName: "Application No.",
              labelKey: "BPA_HOME_SEARCH_RESULTS_APP_NO_LABEL"
            },
            number: applicationNumber
          })
        }
      },
      gotoHomeFooter
    };
  } else if (purpose === "sendback" && status === "success") {
    return {
      header:getHeader(applicationNumber),
      applicationSuccessCard: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        children: {
          card: acknowledgementCard({
            icon: "done",
            backgroundColor: "#39CB74",
            header: {
              labelName: "Application sent back Successfully",
              labelKey: "BPA_SENDBACK_SUCCESS_MESSAGE_MAIN"
            },
            body: {
              labelName: "Application has been sent back successfully",
              labelKey: "BPA_APPLICATION_SENDBACK_SUCCESS"
            },
            tailText: {
              labelName: "Application No.",
              labelKey: "BPA_HOME_SEARCH_RESULTS_APP_NO_LABEL"
            },
            number: applicationNumber
          })
        }
      },
      gotoHomeFooter
    };
  } else if (purpose === "refer" && status === "success") {
    return {
      header,
      applicationSuccessCard: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        children: {
          card: acknowledgementCard({
            icon: "done",
            backgroundColor: "#39CB74",
            header: {
              labelName: "Application referred Successfully",
              labelKey: "NOC_REFER_SUCCESS_MESSAGE_MAIN"
            },
            body: {
              labelName: "Application has been referred successfully",
              labelKey: "NOC_APPLICATION_REFER_SUCCESS"
            },
            tailText: {
              labelName: "Application No.",
              labelKey: "NOC_HOME_SEARCH_RESULTS_APP_NO_LABEL"
            },
            number: applicationNumber
          })
        }
      },
      gotoHomeFooter
    };
  }
};

const getBpaDetails = async ( action, state, dispatch, applicationNumber, tenantId ) => {
  const response = await getAppSearchResults([
    {
      key: "tenantId",
      value: tenantId
    },
    { key: "applicationNo", value: applicationNumber }
  ]);
  dispatch(prepareFinalObject("BPA", response.BPA[0]));  
}
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
    const applicationNumber = getQueryArg(window.location.href,"consumerCode") || getQueryArg(window.location.href,"applicationNumber");
    const tenant = getQueryArg(window.location.href, "tenantId");
    const secondNumber = getQueryArg(window.location.href, "receiptNumber");
    const businessService = getQueryArg(window.location.href, "businessService");
    const moduleName = getQueryArg(window.location.href, "moduleName");
    if(purpose && purpose === "pay") {
      getBpaDetails(action, state, dispatch, applicationNumber, tenant);
    }
    const data = getAcknowledgementCard(
      action,
      state,
      dispatch,
      purpose,
      status,
      applicationNumber,
      secondNumber,
      tenant,
      businessService,
      moduleName
    );
    set(action, "screenConfig.components.div.children", data);
    return action;
  }
};

export default screenConfig;
