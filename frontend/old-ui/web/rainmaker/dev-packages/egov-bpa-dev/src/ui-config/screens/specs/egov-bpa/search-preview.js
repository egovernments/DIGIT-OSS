import {
  getCommonCard,
  getCommonContainer,
  getCommonHeader,
  getLabelWithValue,
  getCommonTitle
} from "egov-ui-framework/ui-config/screens/specs/utils";
import {
  handleScreenConfigurationFieldChange as handleField,
  prepareFinalObject
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {
  getFileUrlFromAPI,
  getQueryArg,
  getTransformedLocale,
  setBusinessServiceDataToLocalStorage
} from "egov-ui-framework/ui-utils/commons";
// import { fetchLocalizationLabel } from "egov-ui-kit/redux/app/actions";
// import { getLocale } from "egov-ui-kit/utils/localStorageUtils";
import jp from "jsonpath";
import get from "lodash/get";
import set from "lodash/set";
import { getAppSearchResults } from "../../../../ui-utils/commons";
import { searchBill , requiredDocumentsData, setNocDocuments } from "../utils/index";
import generatePdf from "../utils/generatePdfForBpa";
// import { loadPdfGenerationDataForBpa } from "../utils/receiptTransformerForBpa";
import { citizenFooter } from "./searchResource/citizenFooter";
import { applicantSummary } from "./summaryResource/applicantSummary";
import { basicSummary } from "./summaryResource/basicSummary"
import { documentsSummary } from "./summaryResource/documentsSummary";
import { scrutinySummary } from "./summaryResource/scrutinySummary";
import { nocSummary } from "./summaryResource/nocSummary";
import { plotAndBoundaryInfoSummary } from "./summaryResource/plotAndBoundaryInfoSummary";
import { httpRequest, edcrHttpRequest } from "../../../../ui-utils/api";
import { statusOfNocDetails } from "../egov-bpa/applyResource/updateNocDetails";
import { nocVerificationDetails } from "../egov-bpa/nocVerificationDetails";
import { permitOrderNoDownload, downloadFeeReceipt } from "../utils/index";
import "../egov-bpa/applyResource/index.css";
import "../egov-bpa/applyResource/index.scss"

const titlebar = getCommonContainer({
    header: getCommonHeader({
      labelName: "Task Details",
      labelKey: "NOC_TASK_DETAILS_HEADER"
    }),
    applicationNumber: {
      uiFramework: "custom-atoms-local",
      moduleName: "egov-bpa",
      componentPath: "ApplicationNoContainer",
      props: {
        number: getQueryArg(window.location.href, "applicationNumber")
      }
    },
});
const titlebar2 = {
  uiFramework: "custom-atoms",
  componentPath: "Div",
  // visible: false,
  props: {
    style: { textAlign: "right", display: "flex" }
  },
  children: {
    permitNumber: {
      uiFramework: "custom-atoms-local",
      moduleName: "egov-bpa",
      componentPath: "PermitNumber",
      gridDefination: {},
      props: {}
    },
    rightContainer:getCommonContainer({
      downloadMenu: {
        uiFramework: "custom-atoms",
        componentPath: "MenuButton",
        props: {
          data: {
            label: "Download",
            leftIcon: "cloud_download",
            rightIcon: "arrow_drop_down",
            props: { variant: "outlined", style: { marginLeft: 10 } },
            menu: []
          }
        }
      },
      printMenu: {
        uiFramework: "custom-atoms",
        componentPath: "MenuButton",
        props: {
          data: {
            label: "Print",
            leftIcon: "print",
            rightIcon: "arrow_drop_down",
            props: { variant: "outlined", style: { marginLeft: 10 } },
            menu: []
          }
        }
      }
    })
  }
}

const prepareDocumentsView = async (state, dispatch) => {
  let documentsPreview = [];

  // Get all documents from response
  let BPA = get(
    state,
    "screenConfiguration.preparedFinalObject.BPA",
    {}
  );
  let applicantDocuments = jp.query(
    BPA,
    "$.documents.*"
  );

  let otherDocuments = jp.query(
    BPA,
    "$.additionalDetail.documents.*"
  );
  let allDocuments = [
    ...applicantDocuments,
    ...otherDocuments
  ];

  allDocuments.forEach(doc => {
    
    documentsPreview.push({
      title: getTransformedLocale(doc.documentType),
      //title: doc.documentType,
      fileStoreId: doc.fileStore,
      linkText: "View"
    });
  });
  let fileStoreIds = jp.query(documentsPreview, "$.*.fileStoreId");
  let fileUrls =
    fileStoreIds.length > 0 ? await getFileUrlFromAPI(fileStoreIds) : {};
  documentsPreview = documentsPreview.map((doc, index) => {
    doc["link"] =
      (fileUrls &&
        fileUrls[doc.fileStoreId] &&
        fileUrls[doc.fileStoreId].split(",")[0]) ||
      "";
    doc["name"] =
      (fileUrls[doc.fileStoreId] &&
        decodeURIComponent(
          fileUrls[doc.fileStoreId]
            .split(",")[0]
            .split("?")[0]
            .split("/")
            .pop()
            .slice(13)
        )) ||
      `Document - ${index + 1}`;
      return doc;
    
  });
  let documentDetailsPreview = [], nocDocumentsPreview = [];
  documentsPreview.forEach(doc => {
    if(doc && doc.title) {
      let type = doc.title.split("_")[0];
      if(type === "NOC") {
        nocDocumentsPreview.push(doc);
      }else {
        documentDetailsPreview.push(doc)
      }
    }
  })
  dispatch(prepareFinalObject("documentDetailsPreview", documentDetailsPreview));
  dispatch(prepareFinalObject("nocDocumentsPreview", nocDocumentsPreview));
};

// const prepareDocumentsUploadRedux = (state, dispatch) => {
//   dispatch(prepareFinalObject("documentsUploadRedux", documentsUploadRedux));
// };

const setDownloadMenu = (action, state, dispatch) => {
  /** MenuButton data based on status */
  let status = get(
    state,
    "screenConfiguration.preparedFinalObject.BPA.status"
  );
  let downloadMenu = [];
  let printMenu = [];
  let certificateDownloadObject = {
    label: { labelName: "Payment Receipt", labelKey: "BPA_APP_FEE_RECEIPT" },
    link: () => {
      downloadFeeReceipt(state, dispatch, status, "BPA.NC_APP_FEE");
    },
    leftIcon: "book"
  };
  let certificatePrintObject = {
    label: { labelName: "Payment Receipt", labelKey: "BPA_APP_FEE_RECEIPT" },
    link: () => {
      generatePdf(state, dispatch, "certificate_print");
    },
    leftIcon: "book"
  };
  let receiptDownloadObject = {
    label: { labelName: "Sanction Fee Receipt", labelKey: "BPA_SAN_FEE_RECEIPT" },
    link: () => {
      downloadFeeReceipt(state, dispatch, status, "BPA.NC_SAN_FEE");
    },
    leftIcon: "receipt"
  };
  let receiptPrintObject = {
    label: { labelName: "Sanction Fee Receipt", labelKey: "BPA_SAN_FEE_RECEIPT" },
    link: () => {
      generatePdf(state, dispatch, "receipt_print");
    },
    leftIcon: "receipt"
  };
  let applicationDownloadObject = {
    label: { labelName: "Permit Order Receipt", labelKey: "BPA_PERMIT_ORDER" },
    link: () => {
      permitOrderNoDownload(action, state, dispatch);
      generatePdf(state, dispatch, "application_download");
    },
    leftIcon: "assignment"
  };
  let applicationPrintObject = {
    label: { labelName: "Permit Order Receipt", labelKey: "BPA_PERMIT_ORDER" },
    link: () => {
      generatePdf(state, dispatch, "application_print");
    },
    leftIcon: "assignment"
  };
  switch (status) {
    case "APPROVED":
      downloadMenu = [
        certificateDownloadObject,
        receiptDownloadObject,
        applicationDownloadObject
      ];
      printMenu = [];
      break;
    case "DOC_VERIFICATION_INPROGRESS" :
    downloadMenu = [certificateDownloadObject];
      break;
    case "FIELDINSPECTION_INPROGRESS" :
    downloadMenu = [certificateDownloadObject];
      break;
    case "NOC_VERIFICATION_INPROGRESS" :
    downloadMenu = [certificateDownloadObject];
      break;
    case "APPROVAL_INPROGRESS" : 
    downloadMenu = [certificateDownloadObject];
     break;
    case "PENDING_SANC_FEE_PAYMENT" :
    downloadMenu = [certificateDownloadObject];
    break;
    printMenu = [];
    case "DOCUMENTVERIFY":
    case "FIELDINSPECTION":
    case "PENDINGAPPROVAL":
    case "REJECTED":
      downloadMenu = [receiptDownloadObject, applicationDownloadObject];
      printMenu = [];
      break;
    case "CANCELLED":
    case "PENDINGPAYMENT":
      downloadMenu = [applicationDownloadObject];
      printMenu = [];
      break;
    default:
      break;
  }
  dispatch(
    handleField(
      "search-preview",
      "components.div.children.headerDiv.children.header2.children.titlebar2.children.rightContainer.children.downloadMenu",
      "props.data.menu",
      downloadMenu
    )
  );
  dispatch(
    handleField(
      "search-preview",
      "components.div.children.headerDiv.children.header2.children.titlebar2.children.rightContainer.children.printMenu",
      "props.data.menu",
      printMenu
    )
  );
  /** END */
};

const setSearchResponse = async (
  state,
  dispatch,
  applicationNumber,
  tenantId, action
) => {
  const response = await getAppSearchResults([
    {
      key: "tenantId",
      value: tenantId
    },
    { key: "applicationNos", value: applicationNumber }
  ]);

  const edcrNumber = response.Bpa["0"].edcrNumber;

  dispatch(prepareFinalObject("BPA", response.Bpa[0]));
  let edcrRes = await edcrHttpRequest(
    "post",
    "/edcr/rest/dcr/scrutinydetails?edcrNumber=" + edcrNumber + "&tenantId=" + tenantId,
    "search", []
    );
 
  dispatch(
    prepareFinalObject(
      `scrutinyDetails`,
      edcrRes.edcrDetail[0]
    )
  );
  if(response && response.Bpa["0"] && response.Bpa["0"].status !== "NOC_VERIFICATION_INPROGRESS") {
    set(
      action,
      "screenConfig.components.div.children.body.children.cardContent.children.nocVerificationDetails.visible",
      false
    );
  }
  if ( response && response.Bpa["0"] && response.Bpa["0"].permitOrderNo ) {
    dispatch(
      handleField(
        "search-preview",
        "components.div.children.headerDiv.children.header2.children.titlebar2.children.permitNumber",
        "props.number",
        response.Bpa["0"].permitOrderNo
      )
    );
  } else {

    dispatch(
      handleField(
      "search-preview",
      "components.div.children.headerDiv.children.header2.children.titlebar2.children.permitNumber",
      "visible",
      false
    )
  )
  }

  // Set Institution/Applicant info card visibility
  if (
    get(
      response,
      "BPA.ownershipCategory",
      ""
    ).startsWith("INSTITUTION")
  ) {
    dispatch(
      handleField(
        "search-preview",
        "components.div.children.body.children.cardContent.children.applicantSummary",
        "visible",
        false
      )
    );
  };

  // prepareDocumentsView(state, dispatch);
  await requiredDocumentsData(state, dispatch);
     
  // await loadPdfGenerationDataForBpa(applicationNumber, tenantId);
  setDownloadMenu(action, state, dispatch);
};

const screenConfig = {
  uiFramework: "material-ui",
  name: "search-preview",
  beforeInitScreen: (action, state, dispatch) => {
    const applicationNumber = getQueryArg(
      window.location.href,
      "applicationNumber"
    );
    const tenantId = getQueryArg(window.location.href, "tenantId");
    // dispatch(fetchLocalizationLabel(getLocale(), tenantId, tenantId));
    searchBill(dispatch, applicationNumber, tenantId);

    setSearchResponse(state, dispatch, applicationNumber, tenantId, action);

    const queryObject = [
      { key: "tenantId", value: tenantId },
      { key: "businessServices", value: "BPA" }
    ];
    setBusinessServiceDataToLocalStorage(queryObject, dispatch);
    // Hide edit buttons

    set(
      action,
      "screenConfig.components.div.children.body.children.cardContent.children.nocSummary.children.cardContent.children.header.children.editSection.visible",
      false
    );
    set(
      action,
      "screenConfig.components.div.children.body.children.cardContent.children.applicantSummary.children.cardContent.children.header.children.editSection.visible",
      false
    );
    set(
      action,
      "screenConfig.components.div.children.body.children.cardContent.children.documentsSummary.children.cardContent.children.header.children.editSection.visible",
      false
    );
    set(
      action,
      "screenConfig.components.div.children.body.children.cardContent.children.basicSummary.children.cardContent.children.header.children.editSection.visible",
      false
    );
    set(
      action,
      "screenConfig.components.div.children.body.children.cardContent.children.scrutinySummary.children.cardContent.children.header.children.editSection.visible",
      false
    );
    set(
      action,
      "screenConfig.components.div.children.body.children.cardContent.children.plotAndBoundaryInfoSummary.children.cardContent.children.header.children.editSection.visible",
      false
    );

    return action;
  },
  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      props: {
        className: "common-div-css bpa-searchpview"
      },
      children: {
        headerDiv: {
          uiFramework: "custom-atoms",
          componentPath: "Container",
          children: {
            header: {
              gridDefination: {
                xs: 12,
                sm: 8,
              },
              ...titlebar
            },
            header2: {
              uiFramework: "custom-atoms",
              componentPath: "Container",
              props: {
                color: "primary",
                style: { justifyContent: "flex-end" }
              },
              gridDefination: {
                xs: 12,
                sm: 4,
                align: "right"
              },
              children: {
                  titlebar2
                    }
            }
          }
        },
        
        taskStatus: {
          uiFramework: "custom-containers-local",
          componentPath: "WorkFlowContainer",
          moduleName: "egov-workflow",
          visible: true,
          props: {
            dataPath: "BPA",
            moduleName: "BPA",
            updateUrl: "/bpa-services/bpa/appl/_update"
          }
        },
        body: getCommonCard({
          // estimateSummary: estimateSummary,
          basicSummary: basicSummary,
          scrutinySummary:scrutinySummary,
          applicantSummary: applicantSummary,
          plotAndBoundaryInfoSummary: plotAndBoundaryInfoSummary,
          documentsSummary: documentsSummary,
          nocSummary: nocSummary,
          nocVerificationDetails : nocVerificationDetails

        }),
        citizenFooter:
          process.env.REACT_APP_NAME === "Citizen" ? citizenFooter : {}
      }
    }
  }
};

export default screenConfig;
