import { download } from "egov-common/ui-utils/commons";
import { getCommonCard, getCommonContainer, getCommonHeader, getLabelWithValue } from "egov-ui-framework/ui-config/screens/specs/utils";
import { handleScreenConfigurationFieldChange as handleField, prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getFileUrl, getFileUrlFromAPI, getQueryArg, getTransformedLocale, setBusinessServiceDataToLocalStorage } from "egov-ui-framework/ui-utils/commons";
import { generateNOCAcknowledgement } from "egov-ui-kit/utils/pdfUtils/generateNOCAcknowledgement";
import { loadUlbLogo } from "egov-ui-kit/utils/pdfUtils/generatePDF";
import jp from "jsonpath";
import { uniqBy } from "lodash";
import get from "lodash/get";
import set from "lodash/set";
import { getSearchResults } from "../../../../ui-utils/commons";
import { checkValueForNA, generateBill } from "../utils/index";
import generatePdf from "../utils/receiptPdf";
import { loadPdfGenerationData } from "../utils/receiptTransformer";
import "./index.css";
import { applicantSummary, institutionSummary } from "./summaryResource/applicantSummary";
import { documentsSummary } from "./summaryResource/documentsSummary";
import { estimateSummary } from "./summaryResource/estimateSummary";
import { nocSummary } from "./summaryResource/nocSummary";
import { propertySummary } from "./summaryResource/propertySummary";

const titlebar = getCommonContainer({
  header: getCommonHeader({
    labelName: "Task Details",
    labelKey: "NOC_TASK_DETAILS_HEADER"
  }),
  applicationNumber: {
    uiFramework: "custom-atoms-local",
    moduleName: "egov-firenoc",
    componentPath: "ApplicationNoContainer",
    props: {
      number: getQueryArg(window.location.href, "applicationNumber")
    }
  },
});
export const downloadPrintContainer = (
  state,
  dispatch
) => {
  /** MenuButton data based on status */

  let preparedFinalObject = get(
    state,
    "screenConfiguration.preparedFinalObject", {});
  let status = get(
    state,
    "screenConfiguration.preparedFinalObject.FireNOCs[0].fireNOCDetails.status"
  );
  let downloadMenu = [];
  let printMenu = [];
  let certificateDownloadObject = {
    label: { labelName: "NOC Certificate", labelKey: "NOC_CERTIFICATE" },
    link: () => {
      generatePdf(state, dispatch, "certificate_download");
    },
    leftIcon: "book"
  };
  let certificatePrintObject = {
    label: { labelName: "NOC Certificate", labelKey: "NOC_CERTIFICATE" },
    link: () => {
      generatePdf(state, dispatch, "certificate_print");
    },
    leftIcon: "book"
  };
  let receiptDownloadObject = {
    label: { labelName: "Receipt", labelKey: "NOC_RECEIPT" },
    link: () => {
      const receiptQueryString = [
        { key: "consumerCodes", value: get(state.screenConfiguration.preparedFinalObject.FireNOCs[0].fireNOCDetails, "applicationNumber") },
        { key: "tenantId", value: get(state.screenConfiguration.preparedFinalObject.FireNOCs[0], "tenantId") },
        { key: "businessService", value: 'FIRENOC' }
      ]
      download(receiptQueryString, "download", "consolidatedreceipt", 'PAYMENT', state);
    },
    leftIcon: "receipt"
  };
  let receiptPrintObject = {
    label: { labelName: "Receipt", labelKey: "NOC_RECEIPT" },
    link: () => {
      const receiptQueryString = [
        { key: "consumerCodes", value: get(state.screenConfiguration.preparedFinalObject.FireNOCs[0].fireNOCDetails, "applicationNumber") },
        { key: "tenantId", value: get(state.screenConfiguration.preparedFinalObject.FireNOCs[0], "tenantId") },
        { key: "businessService", value: 'FIRENOC' }
      ]
      download(receiptQueryString, "print", "consolidatedreceipt", 'PAYMENT', state);
    },
    leftIcon: "receipt"
  };
  let applicationDownloadObject = {
    label: { labelName: "Application", labelKey: "NOC_APPLICATION" },
    link: () => {
      generateNOCAcknowledgement(preparedFinalObject, `noc-acknowledgement-${get(preparedFinalObject, 'FireNOCs[0].fireNOCDetails.applicationNumber', '')}`);
      // generatePdf(state, dispatch, "application_download");
    },
    leftIcon: "assignment"
  };
  let applicationPrintObject = {
    label: { labelName: "Application", labelKey: "NOC_APPLICATION" },
    link: () => {
      generateNOCAcknowledgement(preparedFinalObject, 'print');
      // generatePdf(state, dispatch, "application_print");
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
      printMenu = [
        certificatePrintObject,
        receiptPrintObject,
        applicationPrintObject
      ];
      break;
    case "DOCUMENTVERIFY":
    case "FIELDINSPECTION":
    case "PENDINGAPPROVAL":
    case "REJECTED":
      downloadMenu = [receiptDownloadObject, applicationDownloadObject];
      printMenu = [receiptPrintObject, applicationPrintObject];
      break;
    case "CANCELLED":
    case "PENDINGPAYMENT":
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
          uiFramework: "custom-molecules",
          componentPath: "DownloadPrintButton",
          props: {
            data: {
              label: { labelName: "DOWNLOAD", labelKey: "TL_DOWNLOAD" },
              leftIcon: "cloud_download",
              rightIcon: "arrow_drop_down",
              props: { variant: "outlined", style: { height: "60px", color: "#FE7A51", marginRight: "5px" }, className: "tl-download-button" },
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
      // gridDefination: {
      //   xs: 12,
      //   sm: 6
      // }
    }
  }
};
export const prepareDocumentsView = async (state, dispatch) => {
  let documentsPreview = [];

  // Get all documents from response
  let firenoc = get(
    state,
    "screenConfiguration.preparedFinalObject.FireNOCs[0]",
    {}
  );
  let buildingDocuments = jp.query(
    firenoc,
    "$.fireNOCDetails.buildings.*.applicationDocuments.*"
  );
  let applicantDocuments = jp.query(
    firenoc,
    "$.fireNOCDetails.applicantDetails.additionalDetail.documents.*"
  );
  let otherDocuments = jp.query(
    firenoc,
    "$.fireNOCDetails.additionalDetail.documents.*"
  );
  let allDocuments = [
    ...buildingDocuments,
    ...applicantDocuments,
    ...otherDocuments
  ];

  allDocuments.forEach(doc => {
    documentsPreview.push({
      title: getTransformedLocale(doc.documentType),
      fileStoreId: doc.fileStoreId,
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
        getFileUrl(fileUrls[doc.fileStoreId])) ||
      "";
    doc["name"] =
      (fileUrls[doc.fileStoreId] &&
        decodeURIComponent(
          getFileUrl(fileUrls[doc.fileStoreId])
            .split("?")[0]
            .split("/")
            .pop()
            .slice(13)
        )) ||
      `Document - ${index + 1}`;
    return doc;
  });
  documentsPreview = uniqBy(documentsPreview, "fileStoreId");
  dispatch(prepareFinalObject("documentsPreview", documentsPreview));
  dispatch(prepareFinalObject("FireNOCs[0].fireNOCDetails.additionalDetail.documents", documentsPreview));

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
          jsonPath: `FireNOCs[0].fireNOCDetails.buildings[0].uomsMap.${item.code
            }`,
          callBack: checkValueForNA,
        }
      );

      dispatch(
        handleField(
          "search-preview",
          "components.div.children.body.children.cardContent.children.propertySummary.children.cardContent.children.cardOne.props.scheama.children.cardContent.children.propertyContainer.children",
          item.code,
          labelElement
        )
      );
    });
  });
};

// const prepareDocumentsUploadRedux = (state, dispatch) => {
//   dispatch(prepareFinalObject("documentsUploadRedux", documentsUploadRedux));
// };

const setSearchResponse = async (
  action,
  state,
  dispatch,
  applicationNumber,
  tenantId
) => {
  let edited = getQueryArg(window.location.href, "edited")

  const response = edited ? { FireNOCs: get(state.screenConfiguration.preparedFinalObject, 'FireNOCs') } : await getSearchResults([
    {
      key: "tenantId",
      value: tenantId
    },
    { key: "applicationNumber", value: applicationNumber }
  ]);
  // const response = sampleSingleSearch();
  set(response, 'FireNOCs[0].fireNOCDetails.additionalDetail.assignee[0]', '');
  set(response, 'FireNOCs[0].fireNOCDetails.additionalDetail.comment', '');
  set(response, 'FireNOCs[0].fireNOCDetails.additionalDetail.wfDocuments', []);
  dispatch(prepareFinalObject("FireNOCs", get(response, "FireNOCs", [])));

  // Set Institution/Applicant info card visibility
  if (
    get(
      response,
      "FireNOCs[0].fireNOCDetails.applicantDetails.ownerShipType",
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
  } else {
    dispatch(
      handleField(
        "search-preview",
        "components.div.children.body.children.cardContent.children.institutionSummary",
        "visible",
        false
      )
    );
  }

  prepareDocumentsView(state, dispatch);
  prepareUoms(state, dispatch);
  await loadPdfGenerationData(applicationNumber, tenantId);
  let status = get(
    state,
    "screenConfiguration.preparedFinalObject.FireNOCs[0].fireNOCDetails.status"
  );
  const printCont = downloadPrintContainer(
    state,
    dispatch
  );
  if (status !== "INITIATED") {

    set(
      action,
      "screenConfig.components.div.children.headerDiv.children.helpSection.children",
      printCont
    )
  }
  if (status) {
    generateBill(dispatch, applicationNumber, tenantId, status);
  }
};

const screenConfig = {
  uiFramework: "material-ui",
  name: "search-preview",
  beforeInitScreen: (action, state, dispatch) => {
    let applicationNumber =
      getQueryArg(window.location.href, "applicationNumber") ||
      get(
        state.screenConfiguration.preparedFinalObject,
        "FireNOCs[0].fireNOCDetails.applicationNumber"
      );
    const tenantId = getQueryArg(window.location.href, "tenantId");
    loadUlbLogo(tenantId);
    const queryObject = [
      { key: "tenantId", value: tenantId },
      { key: "businessServices", value: "FIRENOC" }
    ];
    setBusinessServiceDataToLocalStorage(queryObject, dispatch);

    setSearchResponse(action, state, dispatch, applicationNumber, tenantId);
    // Hide edit buttons
    set(
      action,
      "screenConfig.components.div.children.body.children.cardContent.children.nocSummary.children.cardContent.children.header.children.editSection.visible",
      false
    );
    set(
      action,
      "screenConfig.components.div.children.body.children.cardContent.children.propertySummary.children.cardContent.children.header.children.editSection.visible",
      false
    );
    set(
      action,
      "screenConfig.components.div.children.body.children.cardContent.children.applicantSummary.children.cardContent.children.header.children.editSection.visible",
      false
    );
    set(
      action,
      "screenConfig.components.div.children.body.children.cardContent.children.institutionSummary.children.cardContent.children.header.children.editSection.visible",
      false
    );
    set(
      action,
      "screenConfig.components.div.children.body.children.cardContent.children.documentsSummary.children.cardContent.children.header.children.editSection.visible",
      false
    );
    set(
      action,
      "screenConfig.components.div.children.headerDiv.children.header.children.applicationNumber.props.number",
      applicationNumber
    );
    return action;
  },
  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      props: {
        className: "common-div-css"
      },
      children: {
        headerDiv: {
          uiFramework: "custom-atoms",
          componentPath: "Container",
          children: {
            header: {
              gridDefination: {
                xs: 12,
                sm: 8
              },
              ...titlebar
            },
            helpSection: {
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
              }
            }

          }
        },
        taskStatus: {
          uiFramework: "custom-containers-local",
          componentPath: "WorkFlowContainer",
          moduleName: "egov-workflow",
          props: {
            dataPath: "FireNOCs",
            moduleName: "FIRENOC",
            updateUrl: "/firenoc-services/v1/_update"
          }
        },
        body: getCommonCard({
          estimateSummary: estimateSummary,
          nocSummary: nocSummary,
          propertySummary: propertySummary,
          applicantSummary: applicantSummary,
          institutionSummary: institutionSummary,
          documentsSummary: documentsSummary
        }),
        citizenFooter:
          process.env.REACT_APP_NAME === "Citizen" ? {} : {}
      }
    }
  }
};

export default screenConfig;
