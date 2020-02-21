import {
  getCommonHeader,
  getCommonContainer
} from "egov-ui-framework/ui-config/screens/specs/utils";
import {
  applicationSuccessFooter,
  gotoHomeFooter,
} from "./acknowledgementResource/footers";
import { downloadReceiptFromFilestoreID } from "egov-common/ui-utils/commons"
import { getSearchResults,generatePdfFromDiv } from "../../../../ui-utils/commons";
import acknowledgementCard from "./acknowledgementResource/acknowledgementUtils";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { httpRequest } from "../../../../ui-utils/api";
import { getLabel } from "egov-ui-framework/ui-config/screens/specs/utils";
import generatePdf from "../utils/receiptPdf";
import './index.css';
import set from "lodash/set";
import get from "lodash/get";
import { loadPdfGenerationData } from "../utils/receiptTransformer";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
export const header = getCommonContainer({
  header: getCommonHeader({
    labelName: `Application for Transfer of Ownership`, 
    labelKey: "PT_MUTATION_APPLICATION_HEADER"
  }),
  applicationNumber: {
    uiFramework: "custom-atoms-local",
    moduleName: "egov-pt",
    componentPath: "ApplicationNoContainer",
    props: {
      number: getQueryArg(window.location.href, "applicationNumber"),
      label: {
        labelValue: "Application No.",
        labelKey: "PT_MUTATION_APPLICATION_NO"
    }
    },
    visible: true
  }
});
 
export const downloadCertificateForm = (Properties,tenantId,mode='download') => {
   const queryStr = [
     { key: "key", value:"ptmutationcertificate" },
     { key: "tenantId", value: tenantId }
   ]
   const DOWNLOADRECEIPT = {
     GET: {
       URL: "/pdf-service/v1/_create",
       ACTION: "_get",
     },
   };
   try {
     httpRequest("post", DOWNLOADRECEIPT.GET.URL, DOWNLOADRECEIPT.GET.ACTION, queryStr, { Properties }, { 'Accept': 'application/json' }, { responseType: 'arraybuffer' })
       .then(res => {
         res.filestoreIds[0]
         if (res && res.filestoreIds && res.filestoreIds.length > 0) {
           res.filestoreIds.map(fileStoreId => {
             downloadReceiptFromFilestoreID(fileStoreId,tenantId,mode)
           })
         } else {
           console.log("Error In Acknowledgement form Download");
         }
       });
   } catch (exception) {
     alert('Some Error Occured while downloading Acknowledgement form!');
   }
 }

 const downloadprintMenu=(state,applicationNumber,tenantId,purpose)=>{
  const certificateDownloadObject = {
    label: { labelName: "PT Certificate", labelKey: "PT_CERTIFICATE" },
    link: () => {
      downloadCertificateForm(get(state,"screenConfiguration.preparedFinalObject.Properties"),tenantId);
    },
    leftIcon: "book"
  };
  const certificatePrintObject = {
    label: { labelName: "PT Certificate", labelKey: "PT_CERTIFICATE" },
    link: () => {
      downloadCertificateForm(get(state,"screenConfiguration.preparedFinalObject.Properties"),tenantId,'print');
    },
    leftIcon: "book"
  };
 
  const applicationDownloadObject = {
    label: { labelName: "PT Application", labelKey: "PT_APPLICATION" },
    link: () => {
      generatePdfFromDiv("download" ,applicationNumber )
     
    },
    leftIcon: "assignment"
  };
  let applicationPrintObject = {
    label: { labelName: "PT Application", labelKey: "PT_APPLICATION" },
    link: () => {
      // const { Licenses,LicensesTemp } = state.screenConfiguration.preparedFinalObject;
      // const documents = LicensesTemp[0].reviewDocData;
      // set(Licenses[0],"additionalDetails.documents",documents)
      // downloadAcknowledgementForm(Licenses,'print');
      generatePdfFromDiv("print" , applicationNumber)
     
    },
    leftIcon: "assignment"
  };
  let downloadMenu = [];
  let printMenu = [];
  switch (purpose) {
    case "approve":
      downloadMenu = [certificateDownloadObject ];
      printMenu = [certificatePrintObject ];
      break;
    case "apply":
      downloadMenu = [applicationDownloadObject];
      printMenu = [applicationPrintObject];
      break;
      default:
      break;
  }

    return {

      uiFramework: "custom-atoms",
      componentPath: "Div",
      props: {
        className:"downloadprint-menu",
        style: { textAlign: "right", display: "flex" }
      },
      children: {
        downloadMenu: {
          uiFramework: "custom-molecules",
          componentPath: "DownloadPrintButton",
          props: {
            data: {
              label: {labelName : "DOWNLOAD" , labelKey :"TL_DOWNLOAD"},
               leftIcon: "cloud_download",
              rightIcon: "arrow_drop_down",
              props: { variant: "outlined", style: { height: "60px", color : "#FE7A51" }, className: "tl-download-button" },
              menu: downloadMenu
            }
          }
        },
        printMenu: {
          uiFramework: "custom-molecules",
          componentPath: "DownloadPrintButton",
          props: {
            data: {
              label: {labelName : "PRINT" , labelKey :"TL_PRINT"},
              leftIcon: "print",
              rightIcon: "arrow_drop_down",
              props: { variant: "outlined", style: { height: "60px", color : "#FE7A51" }, className: "tl-print-button" },
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
  /** END */


const getHeader=(applicationNumber)=>{
return getCommonContainer({
  header: getCommonHeader({
    labelName: `Application for Transfer of Ownership`, 
    labelKey: "PT_MUTATION_APPLICATION_HEADER"
  }),
  // applicationNumber: {
  //   uiFramework: "custom-atoms-local",
  //   moduleName: "egov-pt",
  //   componentPath: "ApplicationNoContainer",
  //   props: {
  //     number:applicationNumber,
  //     label: {
  //       labelValue: "Application No.",
  //       labelKey: "PT_MUTATION_APPLICATION_NO"
  //   }
  //   },
  //   visible: true
  // }
})
}
const getAcknowledgementCard = (
  state,
  dispatch,
  purpose,
  status,
  applicationNumber,
  secondNumber,
  tenant
) => {
  if (purpose === "apply" && status === "success") {
    // loadPdfGenerationData(applicationNumber, tenant);
    return {
      header:getHeader(applicationNumber),
 //     dpmenu: downloadprintMenu(state,applicationNumber,tenant,purpose),
      applicationSuccessCard: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        children: {
          
          card: acknowledgementCard({
            icon: "done",
            backgroundColor: "#39CB74",
            header: {
              labelName: "Application Submitted Successfully",
              labelKey: "PT_MUTATION_ACKNOWLEDGEMENT_SUCCESS_HEADER"
            },
            body: {
              labelName:
                "A notification regarding Application Submission has been sent to both Transferor and Transferee at registered Mobile No. Please note your application  No for future reference.",
              labelKey: "PT_MUTATION_ACKNOWLEDGEMENT_SUCCESS_MESSAGE"
            },
            tailText: {
              labelName: "Application No.",
              labelKey: "PT_MUTATION_APPLICATION_NO"
            },
            number: applicationNumber
          }),
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
  }  else if (purpose === "apply" && status === "failure") {
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
              labelName: "Application Submitted Failed",
              labelKey: "PT_MUTATION_ACKNOWLEDGEMENT_FAILURE_HEADER"
            },
            body: {
              labelName:
                "A notification regarding Application Submission failure has been sent to both Transferor and Transferee at registered Mobile No.",
              labelKey: "PT_MUTATION_ACKNOWLEDGEMENT_FAILURE_MESSAGE"
            }
          })
        }
      },
      gotoHomeFooter
    };
  }else if (purpose === "resubmit" && status === "success") {
    return {
      header:getHeader(applicationNumber),
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
              labelName: "Application Submitted Successfully",
              labelKey: "PT_APPLICATION_RESUBMIT_SUCCESS_MESSAGE_MAIN"
            },
            body: {
              labelName:
                "A notification regarding Application Submission has been sent to trade owner at registered Mobile No.",
              labelKey: "PT_APPLICATION_RESUBMIT_SUCCESS_MESSAGE_SUB"
            },
            tailText: {
              labelName: "Application No.",
              labelKey: "PT_MUTATION_APPLICATION_NO"
            },
            number: applicationNumber
          })
        }
      },
     
      applicationSuccessFooter: applicationSuccessFooter(
        state,
        dispatch,
        applicationNumber,
        tenant
      )
    };
  }else if (purpose === "approve" && status === "success") {
    // loadReceiptGenerationData(applicationNumber, tenant);
    return {
      header:getHeader(applicationNumber),
      dpmenu: downloadprintMenu(state,applicationNumber,tenant,purpose),
      applicationSuccessCard: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        children: {
          card: acknowledgementCard({
            icon: "done",
            backgroundColor: "#39CB74",
            header: {
              labelName: "Application is Approved Successfully",
              labelKey: "PT_APPROVAL_CHECKLIST_MESSAGE_HEAD"
            },
            body: {
              labelName:
                "A notification regarding Trade License Approval has been sent to trade owner at registered Mobile No.",
              labelKey: "PT_APPROVAL_CHECKLIST_MESSAGE_SUB"
            },
            tailText: {
              labelName: "Trade License No.",
              labelKey: "PT_MUTATION_APPLICATION_NO"
            },
            number: applicationNumber
          })
        }
      },
      gotoHomeFooter
    };
  }
  else if (purpose === "verified" && status === "failure") {
    // loadReceiptGenerationData(applicationNumber, tenant);
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
              labelName: "Application Verification Failed",
              labelKey: "PT_VERIFY_FAILURE_CHECKLIST_MESSAGE_HEAD"
            },
            body: {
              labelName:
                "A notification regarding Trade License Approval has been sent to trade owner at registered Mobile No.",
              labelKey: "PT_VERIFY_FAILURE_CHECKLIST_MESSAGE_SUB"
            },
            tailText: {
              labelName: "Trade License No.",
              labelKey: "PT_MUTATION_APPLICATION_NO"
            },
            number: applicationNumber
          })
        }
      },
      gotoHomeFooter
    };
  }  
  else if (purpose === "verify" && status === "success") {
    // loadReceiptGenerationData(applicationNumber, tenant);
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
              labelName: "Application is Verified Successfully",
              labelKey: "PT_VERIFIED_CHECKLIST_MESSAGE_HEAD"
            },
            body: {
              labelName:
                "A notification regarding Trade License Approval has been sent to trade owner at registered Mobile No.",
              labelKey: "PT_VERIFIED_CHECKLIST_MESSAGE_SUB"
            },
            tailText: {
              labelName: "Trade License No.",
              labelKey: "PT_MUTATION_APPLICATION_NO"
            },
            number: applicationNumber
          })
        }
      },
      gotoHomeFooter
    };
  } 
  
  else if (purpose === "sendback" && status === "success") {
    // loadReceiptGenerationData(applicationNumber, tenant);
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
              labelName: "Application is sent back Successfully",
              labelKey: "PT_SENDBACK_CHECKLIST_MESSAGE_HEAD"
            },
            // body: {
            //   labelName:
            //     "A notification regarding above application status has been sent to trade owner at registered Mobile No.",
            //   labelKey: "PT_SENDBACK_CHECKLIST_MESSAGE_SUB"
            // },
            tailText: {
              labelName: "Trade License No.",
              labelKey: "PT_MUTATION_APPLICATION_NO"
            },
            number: applicationNumber
          })
        }
      },
      gotoHomeFooter
    };
  }else if (purpose === "sendbacktocitizen" && status === "success") {
    // loadReceiptGenerationData(applicationNumber, tenant);
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
              labelName: "Application is sent back to Citizen Successfully",
              labelKey: "PT_SENDBACK_TOCITIZEN_CHECKLIST_MESSAGE_HEAD"
            },
            // body: {
            //   labelName:
            //     "A notification regarding above application status has been sent to trade owner at registered Mobile No.",
            //   labelKey: "TL_SENDBACK_CHECKLIST_MESSAGE_SUB"
            // },
            tailText: {
              labelName: "Trade License No.",
              labelKey: "PT_MUTATION_APPLICATION_NO"
            },
            number: applicationNumber
          })
        }
      },
      gotoHomeFooter
    };
  } else if (purpose === "application" && status === "rejected") {
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
              labelName: "Trade License Application Rejected",
              labelKey: "PT_APPROVAL_REJ_MESSAGE_HEAD"
            },
            body: {
              labelName:
                "A notification regarding Trade License Rejection has been sent to trade owner at registered Mobile No.",
              labelKey: "PT_APPROVAL_REJ_MESSAGE_SUBHEAD"
            }
          })
        }
      },
      gotoHomeFooter
    };
  } else if (purpose === "application" && status === "cancelled") {
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
              labelName: "Trade License Cancelled",
              labelKey: "PT_PT_CANCELLED_MESSAGE_HEAD"
            },
            body: {
              labelName:
                "A notification regarding Trade License cancellation has been sent to trade owner at registered Mobile No.",
              labelKey: "PT_PT_CANCELLED_MESSAGE_SUBHEAD"
            },
            tailText: {
              labelName: "Trade License No.",
              labelKey: "PT_MUTATION_APPLICATION_NO"
            },
            number: applicationNumber
          })
        }
      },
      gotoHomeFooter
    };
  }else if (purpose === "forward" && status === "success") {
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
              labelKey: "PT_FORWARD_SUCCESS_MESSAGE_MAIN"
            },
            body: {
              labelName:
                "A notification regarding above application status has been sent to trade owner at registered Mobile No.",
              labelKey: "PT_APPLICATION_FORWARD_SUCCESS"
            },
            tailText: {
              labelName: "Application No.",
              labelKey: "PT_MUTATION_APPLICATION_NO"
            },
            number: applicationNumber
          })
        }
      },
      gotoHomeFooter
    };
  }
};
const setApplicationData = async (dispatch, applicationNumber, tenant) => {
  const queryObject = [
    {
      key: "tenantId",
      value: tenant
    },
    {
      key: "propertyIds",
      value: applicationNumber
    }
  ];
  const response = await getSearchResults(queryObject);
 // dispatch(prepareFinalObject("Properties", get(response, "Properties", [])));
};
export const setData=async(state,dispatch,applicationNumber,tenantId)=>{
  const response = await getSearchResults([
     {
       key: "tenantId",
       value: tenantId
     },
     { key: "acknowledgementIds", value: applicationNumber }
   ]);
   
   dispatch(prepareFinalObject("Properties", get(response, "Properties", [])));
 
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
    const applicationNumber = getQueryArg(
      window.location.href,
      "applicationNumber"
    );
    const secondNumber = getQueryArg(window.location.href, "secondNumber");
    const tenant = getQueryArg(window.location.href, "tenantId");
    setData(state,dispatch,applicationNumber,tenant);
    setApplicationData(dispatch, applicationNumber, tenant);
    const data = getAcknowledgementCard(
      state,
      dispatch,
      purpose,
      status,
      applicationNumber,
      secondNumber,
      tenant
    );
    
    set(action, "screenConfig.components.div.children", data);
    return action;
  }
};
export default screenConfig;
