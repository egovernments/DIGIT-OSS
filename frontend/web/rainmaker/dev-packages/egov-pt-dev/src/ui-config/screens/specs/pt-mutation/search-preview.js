import {
  getCommonCard,
  getCommonContainer,
  getCommonHeader,
  getLabelWithValue
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
import { fetchLocalizationLabel } from "egov-ui-kit/redux/app/actions";
import { getLocale } from "egov-ui-kit/utils/localStorageUtils";
import jp from "jsonpath";
import get from "lodash/get";
import set from "lodash/set";
import { getSearchResults } from "../../../../ui-utils/commons";
import { searchBill } from "../utils/index";
import generatePdf from "../utils/receiptPdf";
import { loadPdfGenerationData } from "../utils/receiptTransformer";
import { citizenFooter } from "./searchResource/citizenFooter";
import {
  transferorSummary,transferorInstitutionSummary
} from "./summaryResource/transferorSummary";
import {
  transfereeSummary,transfereeInstitutionSummary
} from "./summaryResource/transfereeSummary";
import { documentsSummary } from "./summaryResource/documentsSummary";
import { propertySummary } from "./summaryResource/propertySummary";
import {registrationSummary} from'./summaryResource/registrationSummary';
const titlebar = getCommonContainer({
  header: getCommonHeader({
    labelName: "Application Details",
    labelKey: "PT_MUTATION_APPLICATION_DETAILS"
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
  }
  },
  // downloadMenu: {
  //   uiFramework: "custom-atoms",
  //   componentPath: "MenuButton",
  //   props: {
  //     data: {
  //       label: "Download",
  //       leftIcon: "cloud_download",
  //       rightIcon: "arrow_drop_down",
  //       props: { variant: "outlined", style: { marginLeft: 10 } },
  //       menu: []
  //     }
  //   }
  // },
  // printMenu: {
  //   uiFramework: "custom-atoms",
  //   componentPath: "MenuButton",
  //   props: {
  //     data: {
  //       label: "Print",
  //       leftIcon: "print",
  //       rightIcon: "arrow_drop_down",
  //       props: { variant: "outlined", style: { marginLeft: 10 } },
  //       menu: []
  //     }
  //   }
  // }
});

const prepareDocumentsView = async (state, dispatch) => {
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
  dispatch(prepareFinalObject("documentsPreview", documentsPreview));
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
          jsonPath: `FireNOCs[0].fireNOCDetails.buildings[0].uomsMap.${
            item.code
          }`
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

const setDownloadMenu = (state, dispatch) => {
  /** MenuButton data based on status */
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
      generatePdf(state, dispatch, "receipt_download");
    },
    leftIcon: "receipt"
  };
  let receiptPrintObject = {
    label: { labelName: "Receipt", labelKey: "NOC_RECEIPT" },
    link: () => {
      generatePdf(state, dispatch, "receipt_print");
    },
    leftIcon: "receipt"
  };
  let applicationDownloadObject = {
    label: { labelName: "Application", labelKey: "NOC_APPLICATION" },
    link: () => {
      generatePdf(state, dispatch, "application_download");
    },
    leftIcon: "assignment"
  };
  let applicationPrintObject = {
    label: { labelName: "Application", labelKey: "NOC_APPLICATION" },
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
  // dispatch(
  //   handleField(
  //     "search-preview",
  //     "components.div.children.headerDiv.children.header.children.downloadMenu",
  //     "props.data.menu",
  //     downloadMenu
  //   )
  // );
  // dispatch(
  //   handleField(
  //     "search-preview",
  //     "components.div.children.headerDiv.children.header.children.printMenu",
  //     "props.data.menu",
  //     printMenu
  //   )
  // );
  /** END */
};

const setSearchResponse = async (
  state,
  dispatch,
  applicationNumber,
  tenantId
) => {
  const response = await getSearchResults([
    {
      key: "tenantId",
      value: tenantId
    },
    { key: "applicationNumber", value: applicationNumber }
  ]);
  // const response = sampleSingleSearch();
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
  setDownloadMenu(state, dispatch);
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
    dispatch(fetchLocalizationLabel(getLocale(), tenantId, tenantId));
    searchBill(dispatch, applicationNumber, tenantId);

    setSearchResponse(state, dispatch, applicationNumber, tenantId);

    const queryObject = [
      { key: "tenantId", value: tenantId },
      { key: "businessServices", value: "FIRENOC" }
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
      "screenConfig.components.div.children.body.children.cardContent.children.propertySummary.children.cardContent.children.header.children.editSection.visible",
      false
    );
    set(
      action,
      "screenConfig.components.div.children.body.children.cardContent.children.transferorSummary.children.cardContent.children.header.children.editSection.visible",
      false
    );
    set(
      action,
      "screenConfig.components.div.children.body.children.cardContent.children.transferorInstitutionSummary.children.cardContent.children.header.children.editSection.visible",
      false
    );
    // set(
    //   action,
    //   "screenConfig.components.div.children.body.children.cardContent.children.documentsSummary.children.cardContent.children.header.children.editSection.visible",
    //   false
    // );

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
                sm: 10
              },
              ...titlebar
            }
          }
        },
        taskStatus: {
          uiFramework: "custom-containers-local",
          componentPath: "WorkFlowContainer",
          moduleName: "egov-workflow",
          visible: process.env.REACT_APP_NAME === "Citizen" ? false : true,
          props: {
            dataPath: "FireNOCs",
            moduleName: "FIRENOC",
            updateUrl: "/firenoc-services/v1/_update"
          }
        },
        body: getCommonCard({
          propertySummary: propertySummary,
          transferorSummary: transferorSummary,
          // transferorInstitutionSummary:transferorInstitutionSummary,
          transfereeSummary: transfereeSummary,
          // transfereeInstitutionSummary: transfereeInstitutionSummary,
          registrationSummary:registrationSummary,
          documentsSummary: documentsSummary
        }),
        citizenFooter:
          process.env.REACT_APP_NAME === "Citizen" ? citizenFooter : {}
      }
    }
  }
};

export default screenConfig;
