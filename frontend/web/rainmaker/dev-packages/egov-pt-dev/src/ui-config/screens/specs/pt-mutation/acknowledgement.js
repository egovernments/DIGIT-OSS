import {
  getCommonHeader,
  getCommonContainer,
  getCommonCard,
  getLabelWithValue,
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
import { prepareDocumentsView } from "../utils/index";
import './index.css';
import set from "lodash/set";
import get from "lodash/get";
import { loadPdfGenerationData } from "../utils/receiptTransformer";
import {  downloadCertificateForm} from "../utils/index";
import { handleScreenConfigurationFieldChange as handleField, prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {
  transferorSummary,
  transferorInstitutionSummary
} from "./summaryResource/transferorSummary";
import {
  transfereeSummary,
  transfereeInstitutionSummary
} from "./summaryResource/transfereeSummary";
import { documentsSummary } from "./summaryResource/documentsSummary";
import { propertySummary } from "./summaryResource/propertySummary";
import { registrationSummary } from './summaryResource/registrationSummary';
import { mutationSummary } from "./applyResourceMutation/mutationSummary";

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
 
 const downloadprintMenu=(state,applicationNumber,tenantId,purpose,moduleName)=>{
  const certificateDownloadObject = {
    label: { labelName: "PT Certificate", labelKey: "PT_CERTIFICATE" },
    link: () => {
      downloadCertificateForm(get(state, "screenConfiguration.preparedFinalObject.Properties"), "ptmutationcertificate", tenantId,applicationNumber);
     
    },
    leftIcon: "book"
  };
  const certificatePrintObject = {
    label: { labelName: "PT Certificate", labelKey: "PT_CERTIFICATE" },
    link: () => {
      downloadCertificateForm(get(state, "screenConfiguration.preparedFinalObject.Properties"), "ptmutationcertificate", tenantId,applicationNumber, 'print');
    },
    leftIcon: "book"
  };
 
  const applicationDownloadObject = {
    label: { labelName: "PT Application", labelKey: "PT_APPLICATION" },
    link: () => {
      generatePdfFromDiv("download" ,applicationNumber, ".print-mutation-application-pdf" )
     
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
generatePdfFromDiv("print" , applicationNumber, ".print-mutation-application-pdf")
     
    },
    leftIcon: "assignment"
  };
  let downloadMenu = [];
  let printMenu = [];
  let visibility=moduleName=='ASMT'|| moduleName=="PT.CREATE"?"hidden":"visible"
  switch (purpose) {
    case "approve":
      downloadMenu = [certificateDownloadObject ];
      printMenu = [certificatePrintObject ];
      break;
    case "apply":
      downloadMenu = [applicationDownloadObject];
      printMenu = [applicationPrintObject];
      break;
    case "verify":
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
              props: { variant: "outlined", style: { height: "60px", color : "#FE7A51",visibility }, className: "tl-download-button" },
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
              props: { variant: "outlined", style: { height: "60px", color : "#FE7A51",visibility }, className: "tl-print-button" },
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
const getDocumentDetailsCard = ()=>{
  return {
    body: {...getCommonCard({
      pdfHeader: {
        uiFramework: "custom-atoms-local",
        moduleName: "egov-pt",
        componentPath: "pdfHeader"
      },
      propertySummary: propertySummary,
      transferorSummary: transferorSummary,
      transferorInstitutionSummary: transferorInstitutionSummary,
      transfereeSummary: transfereeSummary,
      transfereeInstitutionSummary: transfereeInstitutionSummary,
      mutationSummary: mutationSummary,
      registrationSummary: registrationSummary,
      documentsSummary: documentsSummary
    },{},{className:"print-mutation-application-pdf"}),
    props: {
      style: {
        height: "100%",
        position: "fixed",
        zIndex: -9999,
        opacity: 0,
      }
    }
  }
  }
}

const getHeader=(applicationNumber,moduleName)=>{
  if(moduleName=='PT.CREATE'){
    return getCommonContainer({
      header: getCommonHeader({
        labelName: `Application for Transfer of Ownership`, 
        labelKey: "PT_CREATE_APPLICATION_HEADER"
      }),
    })
  }else if(moduleName=='ASMT'){
    return getCommonContainer({
      header: getCommonHeader({
        labelName: `Application for Transfer of Ownership`, 
        labelKey: "PT_ASSESSMENT_APPLICATION_HEADER"
      }),
    })
  }else if(moduleName=='PT.MUTATION'){
    return getCommonContainer({
      header: getCommonHeader({
        labelName: `Application for Transfer of Ownership`, 
        labelKey: "PT_MUTATION_APPLICATION_HEADER"
      }),
    })
  }else{
    
      return getCommonContainer({
        header: getCommonHeader({
          labelName: `Application for Transfer of Ownership`, 
          labelKey: "PT_APPLICATION_HEADER"
        }),
      })
    
  }

}
const getAcknowledgementCard = (
  state,
  dispatch,
  purpose,
  status,
  applicationNumber,
  secondNumber,
  tenant,
  moduleName
) => {
  if (purpose === "apply" && status === "success") {
    // loadPdfGenerationData(applicationNumber, tenant);
    return {
      header:getHeader(applicationNumber,moduleName),
      dpmenu: downloadprintMenu(state,applicationNumber,tenant,purpose),
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
      header:getHeader(applicationNumber,moduleName),
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
      header:getHeader(applicationNumber,moduleName),
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
      header:getHeader(applicationNumber,moduleName),
      dpmenu:downloadprintMenu(state,applicationNumber,tenant,purpose,moduleName),
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
          }),
		  ...getDocumentDetailsCard()
        }
      },
      gotoHomeFooter
    };
  }
  else if (purpose === "verified" && status === "failure") {
    // loadReceiptGenerationData(applicationNumber, tenant);
    return {
      header:getHeader(applicationNumber,moduleName),
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
      header:getHeader(applicationNumber,moduleName),
	  dpmenu: downloadprintMenu(state,applicationNumber,tenant,purpose),
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
          }),
          ...getDocumentDetailsCard()
        }
      },
      gotoHomeFooter
    };
  } 
  
  else if (purpose === "sendback" && status === "success") {
    // loadReceiptGenerationData(applicationNumber, tenant);
    return {
      header:getHeader(applicationNumber,moduleName),
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
      header:getHeader(applicationNumber,moduleName),
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
      header:getHeader(applicationNumber,moduleName),
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
      header:getHeader(applicationNumber,moduleName),
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
      header:getHeader(applicationNumber,moduleName),
	  dpmenu: downloadprintMenu(state,applicationNumber,tenant,purpose),
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
          }),
          ...getDocumentDetailsCard()
        }
      },
      gotoHomeFooter
    };
  }
};

const prepareUoms = (state, dispatch) => {
  let buildings = get(
    state,
    "screenConfiguration.preparedFinalObject.FireNOCs[0].fireNOCDetails.buildings",
    []
  );
  buildings.forEach((building, index) => {
    let uoms = get(building, "uoms", []);
    let uomsMap = {};
    uoms.forEach(uom => {
      uomsMap[uom.code] = uom.value;
    });
    dispatch(
      prepareFinalObject(
        `FireNOCs[0].fireNOCDetails.buildings[${index}].uomsMap`,
        uomsMap
      )
    );

    // Display UOMS on search preview page
    uoms.forEach(item => {
      let labelElement = getLabelWithValue(
        {
          labelName: item.code,
          labelKey: `NOC_PROPERTY_DETAILS_${item.code}_LABEL`
        },
        {
          jsonPath: `FireNOCs[0].fireNOCDetails.buildings[0].uomsMap.${item.code}`
        }
      );

      dispatch(
        handleField(
          "acknowledgement",
          "components.div.children.body.children.cardContent.children.propertySummary.children.cardContent.children.cardOne.props.scheama.children.cardContent.children.propertyContainer.children",
          item.code,
          labelElement
        )
      );
    });
  });
};

const setApplicationData = async (state, dispatch, applicationNumber, tenant) => {
  const queryObject = [
    {
      key: "tenantId",
      value: tenant
    },
    {
      key: "acknowledgementIds",
      value: applicationNumber
    }
  ];
  const response = await getSearchResults(queryObject);
  const properties = get(response, "Properties", []);
  let property = (properties && properties.length > 0 && properties[0]) || {};

  if (!property.workflow) {
    let workflow = {
      id: null,
      tenantId: getQueryArg(window.location.href, "tenantId"),
      businessService: "PT.MUTATION",
      businessId: getQueryArg(window.location.href, "applicationNumber"),
      action: "",
      moduleName: "PT",
      state: null,
      comment: null,
      documents: null,
      assignes: null
    };
    property.workflow = workflow;

  }

  if (property && property.owners && property.owners.length > 0) {

    let ownersTemp = [];
    let owners = [];
    property.owners.map(owner => {
      owner.documentUid = owner.documents ? owner.documents[0].documentUid : "NA";
      owner.documentType = owner.documents ? owner.documents[0].documentType : "NA";
      if (owner.status == "ACTIVE") {

        ownersTemp.push(owner);
      } else {
        owners.push(owner);
      }
    });

    property.ownersInit = owners;
    property.ownersTemp = ownersTemp;
  }
  property.ownershipCategoryTemp = property.ownershipCategory;
  property.ownershipCategoryInit = 'NA';
  // Set Institution/Applicant info card visibility
  if (
    get(
      response,
      "Properties[0].ownershipCategory",
      ""
    ).startsWith("INSTITUTION")
  ) {
    property.institutionTemp = property.institution;

    dispatch(
      handleField(
        "acknowledgement",
        "components.div.children.applicationSuccessCard.children.body.children.cardContent.children.transfereeSummary",
        "visible",
        false
      )
    );
  } else {

    dispatch(
      handleField(
        "acknowledgement",
        "components.div.children.applicationSuccessCard.children.body.children.cardContent.children.transfereeInstitutionSummary",
        "visible",
        false
      )
    );
  }

  if (get(property, 'ownersInit[0].altContactNumber', 0)) {
   
    dispatch(
      handleField(
        "acknowledgement",
        "components.div.children.applicationSuccessCard.children.body.children.cardContent.children.transferorSummary",
        "visible",
        false
      )
    );

  } else {

    dispatch(
      handleField(
        "acknowledgement",
        "components.div.children.applicationSuccessCard.children.body.children.cardContent.children.transferorInstitutionSummary",
        "visible",
        false
      )
    );
  }


  let transfereeOwners = get(
    property,
    "ownersTemp", []
  );
  let transferorOwners = get(
    property,
    "ownersInit", []
  );
  let transfereeOwnersDid = true;
  let transferorOwnersDid = true;
  transfereeOwners.map(owner => {
    if (owner.ownerType != 'NONE') {
      transfereeOwnersDid = false;
    }
  })
  transferorOwners.map(owner => {
    if (owner.ownerType != 'NONE') {
      transferorOwnersDid = false;
    }

  })
  if (transferorOwnersDid) {
    dispatch(
      handleField(
        "acknowledgement",
        "components.div.children.applicationSuccessCard.children.body.children.cardContent.children.transferorSummary.children.cardContent.children.cardOne.props.scheama.children.cardContent.children.ownerContainer.children.ownerSpecialDocumentType",
        "props.style.display",
        'none'
      )
    );
    dispatch(
      handleField(
        "acknowledgement",
        "components.div.children.applicationSuccessCard.children.body.children.cardContent.children.transferorSummary.children.cardContent.children.cardOne.props.scheama.children.cardContent.children.ownerContainer.children.ownerSpecialDocumentID",
        "props.style.display",
        'none'
      )
    );

  }
  if (transfereeOwnersDid) {
    dispatch(
      handleField(
        "acknowledgement",
        "components.div.children.applicationSuccessCard.children.body.children.cardContent.children.transfereeSummary.children.cardContent.children.cardOne.props.scheama.children.cardContent.children.ownerContainer.children.ownerDocumentId",
        "props.style.display",
        'none'
      )
    );
    dispatch(
      handleField(
        "acknowledgement",
        "components.div.children.applicationSuccessCard.children.body.children.cardContent.children.transfereeSummary.children.cardContent.children.cardOne.props.scheama.children.cardContent.children.ownerContainer.children.ownerSpecialDocumentType",
        "props.style.display",
        'none'
      )
    );

  }

  dispatch(prepareFinalObject("Property", property));
  dispatch(prepareFinalObject("documentsUploadRedux", property.documents));
  prepareDocumentsView(state, dispatch);

  // prepareUoms(state, dispatch);
  // await loadPdfGenerationData(applicationNumber, tenantId);
  // setDownloadMenu(state, dispatch, tenantId, applicationNumber);
 dispatch(prepareFinalObject("Properties", get(response, "Properties", [])));
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
    const moduleName= getQueryArg(window.location.href, "moduleName");
    const secondNumber = getQueryArg(window.location.href, "secondNumber");
    const tenant = getQueryArg(window.location.href, "tenantId");
    setData(state,dispatch,applicationNumber,tenant);
    setApplicationData(state, dispatch, applicationNumber, tenant);
    const data = getAcknowledgementCard(
      state,
      dispatch,
      purpose,
      status,
      applicationNumber,
      secondNumber,
      tenant,moduleName
    );
    
    set(action, "screenConfig.components.div.children", data);
        // Hiding edit section
    set(
      action,
      "screenConfig.components.div.children.applicationSuccessCard.children.body.children.cardContent.children.nocSummary.children.cardContent.children.header.children.editSection.visible",
      false
    );
    set(
      action,
      "screenConfig.components.div.children.applicationSuccessCard.children.body.children.cardContent.children.propertySummary.children.cardContent.children.header.children.editSection.visible",
      false
    );
    set(
      action,
      "screenConfig.components.div.children.applicationSuccessCard.children.body.children.cardContent.children.transfereeSummary.children.cardContent.children.header.children.editSection.visible",
      false
    );
    set(
      action,
      "screenConfig.components.div.children.applicationSuccessCard.children.body.children.cardContent.children.registrationSummary.children.cardContent.children.header.children.editSection.visible",
      false
    );
    set(
      action,
      "screenConfig.components.div.children.applicationSuccessCard.children.body.children.cardContent.children.documentsSummary.children.cardContent.children.header.children.editSection.visible",
      false
    );
    set(
      action,
      "screenConfig.components.div.children.applicationSuccessCard.children.body.children.cardContent.children.transferorSummary.children.cardContent.children.header.children.editSection.visible",
      false
    );
    set(
      action,
      "screenConfig.components.div.children.applicationSuccessCard.children.body.children.cardContent.children.transferorInstitutionSummary.children.cardContent.children.header.children.editSection.visible",
      false
    );
    return action;
  }
};
export default screenConfig;
