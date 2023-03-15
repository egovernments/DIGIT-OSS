import {
  convertEpochToDate, getCommonCard,
  getCommonContainer,
  getCommonHeader
} from "egov-ui-framework/ui-config/screens/specs/utils";
import {
  handleScreenConfigurationFieldChange as handleField,
  prepareFinalObject
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {
  getFileUrl, getFileUrlFromAPI,

  getQueryArg,
  getTransformedLocale,
  setBusinessServiceDataToLocalStorage
} from "egov-ui-framework/ui-utils/commons";
import { fetchLocalizationLabel } from "egov-ui-kit/redux/app/actions";
import { getLocale, getTenantId, getUserInfo } from "egov-ui-kit/utils/localStorageUtils";
import jp from "jsonpath";
import get from "lodash/get";
import set from "lodash/set";
import { edcrHttpRequest, httpRequest } from "../../../../ui-utils/api";
import { getAppSearchResults, getNocSearchResults, prepareNOCUploadData, nocapplicationUpdate, getStakeHolderRoles } from "../../../../ui-utils/commons";
import "../egov-bpa/applyResource/index.css";
import "../egov-bpa/applyResource/index.scss";
import { permitConditions } from "../egov-bpa/summaryResource/permitConditions";
import { permitListSummary } from "../egov-bpa/summaryResource/permitListSummary";
import {
  downloadFeeReceipt, 
  edcrDetailsToBpaDetails, 
  generateBillForBPA, 
  permitOrderNoDownload, 
  requiredDocumentsData, 
  revocationPdfDownload,
  setProposedBuildingData,
  prepareNocFinalCards,
  compare
} from "../utils/index";
// import { loadPdfGenerationDataForBpa } from "../utils/receiptTransformerForBpa";
import { citizenFooter, updateBpaApplication } from "./searchResource/citizenFooter";
import { applicantSummary } from "./summaryResource/applicantSummary";
import { basicSummary } from "./summaryResource/basicSummary";
import { declarationSummary } from "./summaryResource/declarationSummary";
import { estimateSummary } from "./summaryResource/estimateSummary";
import { fieldinspectionSummary } from "./summaryResource/fieldinspectionSummary";
import { fieldSummary } from "./summaryResource/fieldSummary";
import { previewSummary } from "./summaryResource/previewSummary";
import { scrutinySummary } from "./summaryResource/scrutinySummary";
import { nocDetailsSearch } from "./noc";
import store from "ui-redux/store";
import commonConfig from "config/common.js";
import { getPaymentSearchAPI } from "egov-ui-kit/utils/commons";

export const ifUserRoleExists = role => {
  let userInfo = JSON.parse(getUserInfo());
  const roles = get(userInfo, "roles");
  const roleCodes = roles ? roles.map(role => role.code) : [];
  if (roleCodes.indexOf(role) > -1) {
    return true;
  } else return false;
};

const titlebar = {
  uiFramework: "custom-atoms",
  componentPath: "Div",
  children: {
    leftContainerH: getCommonContainer({
      header: getCommonHeader({
        labelName: "Application details",
        labelKey: "BPA_TASK_DETAILS_HEADER"
      }),
      applicationNumber: {
        uiFramework: "custom-atoms-local",
        moduleName: "egov-bpa",
        componentPath: "ApplicationNoContainer",
        props: {
          number: "NA"
        }
      }
    }),
    rightContainerH: getCommonContainer({
      footNote: {
        uiFramework: "custom-atoms-local",
        moduleName: "egov-bpa",
        componentPath: "NoteAtom",
        props: {
          number: "NA"
        },
        visible: false
      }
    })
  }
}

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
      props: {
        number: "NA"
      },
    },
    rightContainer: getCommonContainer({
      downloadMenu: {
        uiFramework: "custom-molecules",
        componentPath: "DownloadPrintButton",
        props: {
          data: {
            label: { labelName: "DOWNLOAD", labelKey: "BPA_DOWNLOAD" },
            leftIcon: "cloud_download",
            rightIcon: "arrow_drop_down",
            props: { variant: "outlined", style: { height: "60px", color: "#FE7A51", marginRight: 10 }, className: "tl-download-button" },
            menu: []
          }
        }
      },
      printMenu: {
        uiFramework: "custom-molecules",
        componentPath: "DownloadPrintButton",
        props: {
          data: {
            label: { labelName: "PRINT", labelKey: "BPA_PRINT" },
            leftIcon: "print",
            rightIcon: "arrow_drop_down",
            props: { variant: "outlined", style: { height: "60px", color: "#FE7A51" }, className: "tl-download-button" },
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
  let documentDetailsPreview = [], nocDocumentsPreview = [];
  documentsPreview.forEach(doc => {
    if (doc && doc.title) {
      let type = doc.title.split("_")[0];
      if (type === "NOC") {
        nocDocumentsPreview.push(doc);
      } else {
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

const sendToArchDownloadMenu = (action, state, dispatch) => {
  let downloadMenu = [];
  let sendToArchObject = {
    label: { labelName: "SEND TO ARCHITECT", labelKey: "BPA_SEND_TO_ARCHITECT_BUTTON", },
    link: () => {
      updateBpaApplication(state, dispatch, "SEND_TO_ARCHITECT");
    },
  };
  let ApproveObject = {
    label: { labelName: "Approve", labelKey: "BPA_APPROVE_BUTTON" },
    link: () => {
      updateBpaApplication(state, dispatch, "APPROVE");
    },
  };
  downloadMenu = [sendToArchObject, ApproveObject];
  dispatch(
    handleField(
      "search-preview",
      "components.div.children.citizenFooter.children.sendToArch.children.buttons.children.downloadMenu",
      "props.data.menu",
      downloadMenu
    )
  );
}

const setDownloadMenu = async (action, state, dispatch, applicationNumber, tenantId) => {
  /** MenuButton data based on status */
  let status = get(
    state,
    "screenConfiguration.preparedFinalObject.BPA.status"
  );
  let riskType = get(
    state,
    "screenConfiguration.preparedFinalObject.BPA.riskType"
  );

  const service = get(
    state,
    "screenConfiguration.preparedFinalObject.BPA.businessService"
  );
  let downloadMenu = [];
  let printMenu = [];
  let appFeeDownloadObject = {
    label: { labelName: "Payment Receipt", labelKey: "BPA_APP_FEE_RECEIPT" },
    link: () => {
      downloadFeeReceipt(state, dispatch, status, "BPA.NC_APP_FEE", "Download");
    },
    leftIcon: "book"
  };
  let appFeePrintObject = {
    label: { labelName: "Payment Receipt", labelKey: "BPA_APP_FEE_RECEIPT" },
    link: () => {
      downloadFeeReceipt(state, dispatch, status, "BPA.NC_APP_FEE", "Print");
    },
    leftIcon: "book"
  };
  let sanFeeDownloadObject = {
    label: { labelName: "Sanction Fee Receipt", labelKey: "BPA_SAN_FEE_RECEIPT" },
    link: () => {
      downloadFeeReceipt(state, dispatch, status, "BPA.NC_SAN_FEE", "Download");
    },
    leftIcon: "receipt"
  };
  let sanFeePrintObject = {
    label: { labelName: "Sanction Fee Receipt", labelKey: "BPA_SAN_FEE_RECEIPT" },
    link: () => {
      downloadFeeReceipt(state, dispatch, status, "BPA.NC_SAN_FEE", "Print");
    },
    leftIcon: "receipt"
  };
  let permitOrderDownloadObject = {
    label: { labelName: "Permit Order Receipt", labelKey: "BPA_PERMIT_ORDER" },
    link: () => {
      permitOrderNoDownload(action, state, dispatch, "Download");
    },
    leftIcon: "assignment"
  };
  let permitOrderPrintObject = {
    label: { labelName: "Permit Order Receipt", labelKey: "BPA_PERMIT_ORDER" },
    link: () => {
      permitOrderNoDownload(action, state, dispatch, "Print");
    },
    leftIcon: "assignment"
  };
  let lowAppFeeDownloadObject = {
    label: { labelName: "Fee Receipt", labelKey: "BPA_FEE_RECEIPT" },
    link: () => {
      downloadFeeReceipt(state, dispatch, status, "BPA.LOW_RISK_PERMIT_FEE", "Download");
    },
    leftIcon: "book"
  };
  let lowAppFeePrintObject = {
    label: { labelName: "Fee Receipt", labelKey: "BPA_FEE_RECEIPT" },
    link: () => {
      downloadFeeReceipt(state, dispatch, status, "BPA.LOW_RISK_PERMIT_FEE", "Print");
    },
    leftIcon: "book"
  };
  let revocationPdfDownlaodObject = {
    label: { labelName: "Revocation Letter", labelKey: "BPA_REVOCATION_PDF_LABEL" },
    link: () => {
      revocationPdfDownload(action, state, dispatch, "Download");
    },
    leftIcon: "assignment"
  };
  let revocationPdfPrintObject = {
    label: { labelName: "Revocation Letter", labelKey: "BPA_REVOCATION_PDF_LABEL" },
    link: () => {
      revocationPdfDownload(action, state, dispatch, "Print");
    },
    leftIcon: "assignment"
  };

  let queryObject = [
    {
      key: "tenantId",
      value: tenantId
    },
    {
      key: "consumerCodes",
      value: applicationNumber
    }
  ];
  
  let paymentPayload = {}; 
  paymentPayload.Payments = [];
  if(riskType === "LOW") {
    let lowAppPaymentPayload = await httpRequest(
      "post",
      getPaymentSearchAPI("BPA.LOW_RISK_PERMIT_FEE", true),
      "",
      queryObject
    );
    if(lowAppPaymentPayload && lowAppPaymentPayload.Payments && lowAppPaymentPayload.Payments.length > 0) paymentPayload.Payments.push(lowAppPaymentPayload.Payments[0]);
  } else {
    let businessServicesList = ["BPA.NC_APP_FEE", "BPA.NC_SAN_FEE" ];
    for(let fee = 0; fee < businessServicesList.length; fee++ ) {
      let lowAppPaymentPayload = await httpRequest(
        "post",
        getPaymentSearchAPI(businessServicesList[fee], true),
        "",
        queryObject
      );
      if(lowAppPaymentPayload && lowAppPaymentPayload.Payments) paymentPayload.Payments.push(lowAppPaymentPayload.Payments[0]);
    }
  }

  if (riskType === "LOW") {
    if (paymentPayload && paymentPayload.Payments.length == 1) {
      downloadMenu.push(lowAppFeeDownloadObject);
      printMenu.push(lowAppFeePrintObject);
    }
    switch (status) {
      case "DOC_VERIFICATION_INPROGRESS":
      case "FIELDINSPECTION_INPROGRESS":
      case "NOC_VERIFICATION_INPROGRESS":
      case "APPROVAL_INPROGRESS":
      case "APPROVED":
        downloadMenu.push(permitOrderDownloadObject);
        printMenu.push(permitOrderDownloadObject);
        downloadMenu = downloadMenu;
        printMenu = printMenu;
        break;
      case "PERMIT REVOCATION":
        downloadMenu.push(revocationPdfDownlaodObject);
        printMenu.push(revocationPdfPrintObject);
        downloadMenu = downloadMenu;
        printMenu = printMenu;
        break;
      default:
        downloadMenu = [];
        printMenu = [];
        break;
    }
  } else {

    if (paymentPayload && paymentPayload.Payments.length == 1) {
      if (get(paymentPayload, "Payments[0].paymentDetails[0].businessService") === "BPA.NC_APP_FEE") {
        downloadMenu.push(appFeeDownloadObject);
        printMenu.push(appFeePrintObject);
      } else if (get(paymentPayload, "Payments[0].paymentDetails[0].businessService") === "BPA.NC_SAN_FEE") {
        downloadMenu.push(sanFeeDownloadObject);
        printMenu.push(sanFeePrintObject);
      }
    } else if (paymentPayload && paymentPayload.Payments.length == 2) {
      downloadMenu.push(appFeeDownloadObject);
      downloadMenu.push(sanFeeDownloadObject);
      printMenu.push(appFeePrintObject);
      printMenu.push(sanFeePrintObject);
    }
    switch (status) {
      case "DOC_VERIFICATION_INPROGRESS":
      case "FIELDINSPECTION_INPROGRESS":
      case "NOC_VERIFICATION_INPROGRESS":
      case "APPROVAL_INPROGRESS":
      case "PENDING_SANC_FEE_PAYMENT":
      case "REJECTED":
        downloadMenu = downloadMenu
        printMenu = printMenu
        break;
      case "APPROVED":
        downloadMenu.push(permitOrderDownloadObject);
        printMenu.push(permitOrderPrintObject);
        break;
      default:
        downloadMenu = [];
        printMenu = [];
        break;
    }
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

const stakeholerRoles = getStakeHolderRoles();

const getRequiredMdmsDetails = async (state, dispatch) => {
  let mdmsBody = {
    MdmsCriteria: {
      tenantId: commonConfig.tenantId,
      moduleDetails: [
        {
          moduleName: "common-masters",
          masterDetails: [
            {
              name: "DocumentType"
            }
          ]
        },
        {
          moduleName: "BPA",
          masterDetails: [
            {
              name: "DocTypeMapping"
            },
            {
              name: "CheckList"
            },
            {
              name: "RiskTypeComputation"
            }
          ]
        },
        {
          moduleName: "NOC",
          masterDetails: [
            {
              name: "DocumentTypeMapping"
            },
          ]
        }
      ]
    }
  };
  let payload = await httpRequest(
    "post",
    "/egov-mdms-service/v1/_search",
    "_search",
    [],
    mdmsBody
  );
  dispatch(prepareFinalObject("applyScreenMdmsData", payload.MdmsRes));
}

const setSearchResponse = async (
  state,
  dispatch,
  applicationNumber,
  tenantId, action
) => {
  await getRequiredMdmsDetails(state, dispatch);
  const response = await getAppSearchResults([
    {
      key: "tenantId",
      value: tenantId
    },
    { key: "applicationNo", value: applicationNumber }
  ]);
  const payload = await getNocSearchResults([
    {
      key: "tenantId",
      value: tenantId
    },
    { key: "sourceRefId", value: applicationNumber }
  ], state);
  dispatch(prepareFinalObject("Noc", payload.Noc));
  payload.Noc.sort(compare);
  // await prepareNOCUploadData(state, dispatch);
  // prepareNocFinalCards(state, dispatch);

  let type = getQueryArg(
    window.location.href,
    "type", ""
  );

  if (!type) {
    let businessService = get(response, "BPA[0].businessService");
    const queryObject = [
      { key: "tenantId", value: tenantId },
      { key: "businessServices", value: businessService }
    ];
    setBusinessServiceDataToLocalStorage(queryObject, dispatch);
  }

  const edcrNumber = get(response, "BPA[0].edcrNumber");
  const status = get(response, "BPA[0].status");
  dispatch(prepareFinalObject("BPA", response.BPA[0]));
  if (get(response, "BPA[0].status") == "CITIZEN_APPROVAL_INPROCESS") {
    // TODO if required to show for architect before apply, 
    //this condition should extend to OR with status INPROGRESS
    let businessService = "BPA.NC_APP_FEE";
    if (get(response, "BPA[0].businessService") == "BPA_LOW") {
      businessService = "BPA.LOW_RISK_PERMIT_FEE"
    }
    generateBillForBPA(dispatch, applicationNumber, tenantId, businessService);
    dispatch(
      handleField(
        "search-preview",
        "components.div.children.citizenFooter.children.sendToArch",
        "visible",
        true
      )
    );
  }
  set(
    action,
    "screenConfig.components.div.children.body.children.cardContent.children.estimateSummary.visible",
    (get(response, "BPA[0].status") == "CITIZEN_APPROVAL_INPROCESS")
  );
  let edcrRes = await edcrHttpRequest(
    "post",
    "/edcr/rest/dcr/scrutinydetails?edcrNumber=" + edcrNumber + "&tenantId=" + tenantId,
    "search", []
  );

  dispatch(prepareFinalObject(`scrutinyDetails`, edcrRes.edcrDetail[0]));

  await edcrDetailsToBpaDetails(state, dispatch);
  let isCitizen = process.env.REACT_APP_NAME === "Citizen" ? true : false;

  if (status && status == "INPROGRESS") {
    let userInfo = JSON.parse(getUserInfo()), roles = get(userInfo, "roles"), isArchitect = false;
    if (roles && roles.length > 0) {
      roles.forEach(role => {
        if (stakeholerRoles.includes(role.code)) {
          isArchitect = true;
        }
      })
    }
    if (isArchitect && isCitizen) {
      dispatch(
        handleField(
          "search-preview",
          "components.div.children.body.children.cardContent.children.declarationSummary.children.headers",
          "visible",
          true
        )
      );
      dispatch(
        handleField(
          "search-preview",
          "components.div.children.body.children.cardContent.children.declarationSummary.children.header.children.body.children.firstStakeholder",
          "visible",
          true
        )
      );
    }
  }

  if (status && status === "CITIZEN_APPROVAL_INPROCESS" && isCitizen) {
    let userInfo = JSON.parse(getUserInfo()),
      roles = get(userInfo, "roles"),
      owners = get(response.BPA["0"].landInfo, "owners"),
      isTrue = false, isOwner = true;
    if (roles && roles.length > 0) {
      roles.forEach(role => {
        if (stakeholerRoles.includes(role.code)) {
          isTrue = true;
        }
      })
    }

    if (isTrue && owners && owners.length > 0) {
      owners.forEach(owner => {
        if (owner.mobileNumber === userInfo.mobileNumber) { //owner.uuid === userInfo.uuid
          if (owner.roles && owner.roles.length > 0) {
            owner.roles.forEach(owrRole => {
              if (stakeholerRoles.includes(owrRole.code)) {
                isOwner = false;
              }
            })
          }
        }
      })
    }
    if (isTrue && isOwner) {
      dispatch(
        handleField(
          "search-preview",
          "components.div.children.citizenFooter",
          "visible",
          false
        )
      )
    } else {
      dispatch(
        handleField(
          "search-preview",
          "components.div.children.body.children.cardContent.children.declarationSummary.children.headers",
          "visible",
          true
        )
      );
      dispatch(
        handleField(
          "search-preview",
          "components.div.children.body.children.cardContent.children.declarationSummary.children.header.children.body.children.citizen",
          "visible",
          true
        )
      )
    }
  }


  if (response && response.BPA["0"] && response.BPA["0"].documents) {
    dispatch(prepareFinalObject("documentsTemp", response.BPA["0"].documents));
  }

  if (response && get(response, "BPA[0].approvalNo")) {
    dispatch(
      handleField(
        "search-preview",
        "components.div.children.headerDiv.children.header2.children.titlebar2.children.permitNumber",
        "props.number",
        get(response, "BPA[0].approvalNo")
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

  dispatch(
    handleField(
      "search-preview",
      "components.div.children.headerDiv.children.header.children.leftContainerH.children.applicationNumber",
      "props.number",
      applicationNumber
    )
  );

  // Set Institution/Applicant info card visibility
  if (
    get(
      response,
      "BPA.landInfo.ownershipCategory",
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

  setProposedBuildingData(state, dispatch);

  if (get(response, "BPA[0].additionalDetails.validityDate")) {
    dispatch(
      handleField(
        "search-preview",
        "components.div.children.headerDiv.children.header.children.rightContainerH.children.footNote",
        "props.number",
        convertEpochToDate(get(response, "BPA[0].additionalDetails.validityDate"))
      )
    );

    dispatch(
      handleField(
        "search-preview",
        "components.div.children.headerDiv.children.header.children.rightContainerH.children.footNote.visible",
        true
      )
    );
  }

  dispatch(prepareFinalObject("documentDetailsPreview", {}));
  requiredDocumentsData(state, dispatch, action);
  await setDownloadMenu(action, state, dispatch, applicationNumber, tenantId);
  sendToArchDownloadMenu(action, state, dispatch);
  dispatch(fetchLocalizationLabel(getLocale(), tenantId, tenantId));
};

export const beforeSubmitHook = async () => {
  let state = store.getState();
  let bpaDetails = get(state, "screenConfiguration.preparedFinalObject.BPA", {});
  let isNocTrue = get(state, "screenConfiguration.preparedFinalObject.BPA.isNocTrue", false);
  if(!isNocTrue) {
    const Noc = get(state, "screenConfiguration.preparedFinalObject.Noc", []);
    let nocDocuments = get(state, "screenConfiguration.preparedFinalObject.nocFinalCardsforPreview", []);
    if (Noc.length > 0) {
      let count = 0;
      for (let data = 0; data < Noc.length; data++) {
        let documents = get(nocDocuments[data], "documents", null);
        set(Noc[data], "documents", documents);
        let response = await httpRequest(
          "post",
          "/noc-services/v1/noc/_update",
          "",
          [],
          { Noc: Noc[data] }
        );
        if(get(response, "ResponseInfo.status") == "successful") {
          count++;
          if(Noc.length == count) {
            store.dispatch(prepareFinalObject("BPA.isNocTrue", true));
            return bpaDetails;
          }
        }
      }
    }
  } else {
    return bpaDetails;
  }
}

const screenConfig = {
  uiFramework: "material-ui",
  name: "search-preview",
  beforeInitScreen: (action, state, dispatch) => {
    let type = getQueryArg(
      window.location.href,
      "type", ""
    );
    const applicationNumber = getQueryArg(
      window.location.href,
      "applicationNumber"
    );
    const tenantId = getQueryArg(window.location.href, "tenantId");
    let businessServicesValue = "BPA";
    if (type) {
      if (type === "LOW") {
        businessServicesValue = "BPA_LOW";
      }
      const queryObject = [
        { key: "tenantId", value: tenantId },
        { key: "businessServices", value: businessServicesValue }
      ];
      setBusinessServiceDataToLocalStorage(queryObject, dispatch);
    }

    setSearchResponse(state, dispatch, applicationNumber, tenantId, action);


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
      "screenConfig.components.div.children.body.children.cardContent.children.previewSummary.children.cardContent.children.header.children.editSection.visible",
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
    set(
      action,
      "screenConfig.components.div.children.body.children.cardContent.children.nocSummary.children.cardContent.children.uploadedNocDocumentDetailsCard.visible",
      false
    );
    set(
      action,
      "screenConfig.components.div.children.body.children.cardContent.children.fieldSummary.visible",
      false
    );
    set(
      action,
      "screenConfig.components.div.children.body.children.cardContent.children.fieldinspectionSummary.visible",
      false
    );
    set(
      action,
      "screenConfig.components.div.children.body.children.cardContent.children.permitConditions.visible",
      false
    );
    set(
      action,
      "screenConfig.components.div.children.body.children.cardContent.children.permitListSummary.visible",
      false
    );
    set(
      action,
      "screenConfig.components.div.children.body.children.cardContent.children.declarationSummary.children.headers.visible",
      false
    );
    set(
      action,
      "components.div.children.body.children.cardContent.children.nocDetailsApply.visible",
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
                sm: 6,
                md: 6
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
                sm: 6,
                md: 6,
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
            updateUrl: "/bpa-services/v1/bpa/_update",
            beforeSubmitHook: beforeSubmitHook
          }
        },
        sendToArchPickerDialog: {
          componentPath: "Dialog",
          props: {
            open: false,
            maxWidth: "md"
          },
          children: {
            dialogContent: {
              componentPath: "DialogContent",
              props: {
                classes: {
                  root: "city-picker-dialog-style"
                }
              },
              children: {
                popup: getCommonContainer({
                  header: getCommonHeader({
                    labelName: "Forward Application",
                    labelKey: "BPA_FORWARD_APPLICATION_HEADER"
                  }),
                  cityPicker: getCommonContainer({
                    cityDropdown: {
                      uiFramework: "custom-molecules-local",
                      moduleName: "egov-bpa",
                      componentPath: "ActionDialog",
                      required: true,
                      gridDefination: {
                        xs: 12,
                        sm: 12
                      },
                      props: {}
                    },
                  })
                })
              }
            }
          }
        },
        body: getCommonCard({
          estimateSummary: estimateSummary,
          fieldSummary: fieldSummary,
          fieldinspectionSummary: fieldinspectionSummary,
          basicSummary: basicSummary,
          scrutinySummary: scrutinySummary,
          applicantSummary: applicantSummary,
          previewSummary: previewSummary,
          nocDetailsApply: nocDetailsSearch,
          declarationSummary: declarationSummary,
          permitConditions: permitConditions,
          permitListSummary: permitListSummary
        }),
        citizenFooter: process.env.REACT_APP_NAME === "Citizen" ? citizenFooter : {}
      }
    }
  }
};

export default screenConfig;
