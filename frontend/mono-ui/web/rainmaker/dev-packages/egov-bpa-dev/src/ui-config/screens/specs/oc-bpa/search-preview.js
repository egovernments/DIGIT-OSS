import {
  getCommonCard,
  getCommonContainer,
  getCommonHeader
} from "egov-ui-framework/ui-config/screens/specs/utils";
import {
  handleScreenConfigurationFieldChange as handleField,
  prepareFinalObject
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {
  getQueryArg,

  setBusinessServiceDataToLocalStorage
} from "egov-ui-framework/ui-utils/commons";
import { fetchLocalizationLabel } from "egov-ui-kit/redux/app/actions";
import { printPdf } from "egov-ui-kit/utils/commons";
import { getLocale, getTenantId, getUserInfo } from "egov-ui-kit/utils/localStorageUtils";
import get from "lodash/get";
import set from "lodash/set";
import { edcrHttpRequest, httpRequest } from "../../../../ui-utils/api";
import { 
  getAppSearchResults,
  getNocSearchResults,
  prepareNOCUploadData,
  nocapplicationUpdate,
  getStakeHolderRoles
} from "../../../../ui-utils/commons";
import "../egov-bpa/applyResource/index.css";
import "../egov-bpa/applyResource/index.scss";
import { estimateSummary } from "../egov-bpa/summaryResource/estimateSummary";
import {
  applicantNameAppliedByMaping, 
  downloadFeeReceipt, 
  edcrDetailsToBpaDetails,
  generateBillForBPA, 
  permitOrderNoDownload, 
  requiredDocumentsData, 
  setProposedBuildingData,
  prepareNocFinalCards,
  compare
} from "../utils/index";
import { citizenFooter, updateBpaApplication } from "./searchResource/citizenFooter";
import { declarations } from "./summaryResource/declarations";
import { documentAndNocSummary } from "./summaryResource/documentAndNocSummary";
import { fieldinspectionSummary } from "./summaryResource/fieldinspectionSummary";
import { fieldSummary } from "./summaryResource/fieldSummary";
import { permitConditions } from "./summaryResource/permitConditions";
import { permitListSummary } from "./summaryResource/permitListSummary";
import { scrutinySummary } from "./summaryResource/scrutinySummary";
import { nocDetailsSearch } from "../egov-bpa/noc";
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
  props: {
    style: { textAlign: "right", display: "flex" }
  },
  children: {
    permitNumber: {
      uiFramework: "custom-atoms-local",
      moduleName: "egov-bpa",
      componentPath: "ocPermitNumber",
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

  let comparisonDetails = get(
    state,
    "screenConfiguration.preparedFinalObject.comparisonDetails"
  );
  let comparisonReport = false;
  if (comparisonDetails) {
    comparisonReport = get(comparisonDetails, "report");
  }
  let downloadMenu = [];
  let printMenu = [];
  let appFeeDownloadObject = {
    label: { labelName: "Payment Receipt", labelKey: "BPA_APP_FEE_RECEIPT" },
    link: () => {
      downloadFeeReceipt(state, dispatch, status, "BPA.NC_OC_APP_FEE", "Download");
    },
    leftIcon: "book"
  };
  let appFeePrintObject = {
    label: { labelName: "Payment Receipt", labelKey: "BPA_APP_FEE_RECEIPT" },
    link: () => {
      downloadFeeReceipt(state, dispatch, status, "BPA.NC_OC_APP_FEE", "Print");
    },
    leftIcon: "book"
  };

  let sanFeeDownloadObject = {
    label: { labelName: "Deviation Penality Receipt", labelKey: "BPA_OC_DEV_PEN_RECEIPT" },
    link: () => {
      downloadFeeReceipt(state, dispatch, status, "BPA.NC_OC_SAN_FEE", "Download");
    },
    leftIcon: "receipt"
  };

  let sanFeePrintObject = {
    label: { labelName: "Deviation Penality Receipt", labelKey: "BPA_OC_DEV_PEN_RECEIPT" },
    link: () => {
      downloadFeeReceipt(state, dispatch, status, "BPA.NC_OC_SAN_FEE", "Print");
    },
    leftIcon: "receipt"
  };

  let occupancyCertificateDownloadObject = {
    label: { labelName: "Occupancy Certificate", labelKey: "BPA_OC_CERTIFICATE" },
    link: () => {
      permitOrderNoDownload(action, state, dispatch, "Download");
    },
    leftIcon: "assignment"
  };
  let occupancyCertificatePrintObject = {
    label: { labelName: "Occupancy Certificate", labelKey: "BPA_OC_CERTIFICATE" },
    link: () => {
      permitOrderNoDownload(action, state, dispatch, "Print");
    },
    leftIcon: "receipt"
  };

  let comparisonReportDownloadObject = {};
  let comparisonReportPrintObject = {};
  if(comparisonReport){
    comparisonReportDownloadObject = {
      label: { labelName: "Comparison Report", labelKey: "BPA_COMPARISON_REPORT_LABEL" },
      link: () => {
        window.open(comparisonReport);
      },
      leftIcon: "assignment"
    }
    comparisonReportPrintObject = {
      label: { labelName: "Comparison Report", labelKey: "BPA_COMPARISON_REPORT_LABEL" },
      link: () => {
        let comparisonReports;
        if(!comparisonReport.includes("https") && window.location.href.includes("https")) {
          comparisonReports = comparisonReport.replace(/http/g, "https");
        }
        let downloadLink = comparisonReports ? comparisonReports : comparisonReport;
        printPdf(downloadLink);
      },
      leftIcon: "assignment"
    }
  }

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
  let businessServicesList = ["BPA.NC_OC_APP_FEE", "BPA.NC_OC_SAN_FEE" ];
    for(let fee = 0; fee < businessServicesList.length; fee++ ) {
      let lowAppPaymentPayload = await httpRequest(
        "post",
        getPaymentSearchAPI(businessServicesList[fee], true),
        "",
        queryObject
      );
      if(lowAppPaymentPayload && lowAppPaymentPayload.Payments && lowAppPaymentPayload.Payments.length > 0) paymentPayload.Payments.push(lowAppPaymentPayload.Payments[0]);
    }

  if (paymentPayload && paymentPayload.Payments.length == 1) {
    if (get(paymentPayload, "Payments[0].paymentDetails[0].businessService") === "BPA.NC_OC_APP_FEE") {
      downloadMenu.push(appFeeDownloadObject);
      printMenu.push(appFeePrintObject);
    } else if (get(paymentPayload, "Payments[0].paymentDetails[0].businessService") === "BPA.NC_OC_SAN_FEE") {
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
    case "APPROVED":
      downloadMenu.push(occupancyCertificateDownloadObject);
      printMenu.push(occupancyCertificatePrintObject);
      break;
    case "DOC_VERIFICATION_INPROGRESS":
    case "FIELDINSPECTION_INPROGRESS":
    case "NOC_VERIFICATION_INPROGRESS":
    case "APPROVAL_INPROGRESS":
    case "PENDING_SANC_FEE_PAYMENT":
    case "PENDINGAPPROVAL":
    case "REJECTED":
      downloadMenu = downloadMenu;
      printMenu = printMenu;
      break;
    default:
      downloadMenu = [];
      printMenu = [];
      break;
  }

  if (comparisonReport) {
    downloadMenu.push(comparisonReportDownloadObject);
    printMenu.push(comparisonReportPrintObject);
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
  let isCitizen = process.env.REACT_APP_NAME === "Citizen" ? true : false;
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

  const edcrNumber = get(response, "BPA[0].edcrNumber");
  const status = get(response, "BPA[0].status");
  dispatch(prepareFinalObject("BPA", response.BPA[0]));
  if (get(response, "BPA[0].status") == "CITIZEN_APPROVAL_INPROCESS") {
    // TODO if required to show for architect before apply, 
    //this condition should extend to OR with status INPROGRESS
    generateBillForBPA(dispatch, applicationNumber, tenantId, "BPA.NC_OC_APP_FEE");
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

  dispatch(prepareFinalObject(`ocScrutinyDetails`, edcrRes.edcrDetail[0]));
  await edcrDetailsToBpaDetails(state, dispatch);
  await applicantNameAppliedByMaping(state, dispatch, get(response, "BPA[0]"), get(edcrRes, "edcrDetail[0]"));
  await setProposedBuildingData(state, dispatch, "ocApply", "ocApply");

  // let businessServicesValue = "BPA_OC";
  // const queryObject = [
  //   { key: "tenantId", value: tenantId },
  //   { key: "businessServices", value: businessServicesValue }
  // ];
  // setBusinessServiceDataToLocalStorage(queryObject, dispatch);

  if (status && status == "INPROGRESS") {
    let userInfo = JSON.parse(getUserInfo()), roles = get(userInfo, "roles"), isArchitect = false;
    if (roles && roles.length > 0) {
      roles.forEach(role => {
        if (stakeholerRoles.includes(role.code)) {
          isArchitect = true;
        }
      })
    }
    if (isArchitect) {
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
        if (owner.mobileNumber === userInfo.mobileNumber) {
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
          "components.div.children.body.children.cardContent.children.declarations.children.headers",
          "visible",
          true
        )
      );
      dispatch(
        handleField(
          "search-preview",
          "components.div.children.body.children.cardContent.children.declarations.children.header.children.body.children.citizenApproval",
          "visible",
          true
        )
      )
    }
  } else {
    dispatch(
      handleField(
        "search-preview",
        "components.div.children.body.children.cardContent.children.declarations.children.headers",
        "visible",
        false
      )
    );
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

  // if (get(response, "Bpa[0].additionalDetails.validityDate")) {
  //   dispatch(
  //     handleField(
  //       "search-preview",
  //       "components.div.children.headerDiv.children.header.children.rightContainerH.children.footNote",
  //       "props.number",
  //       convertEpochToDate(get(response, "Bpa[0].additionalDetails.validityDate"))
  //     )
  //   );

  //   dispatch(
  //     handleField(
  //       "search-preview",
  //       "components.div.children.headerDiv.children.header.children.rightContainerH.children.footNote.visible",
  //       true
  //     )
  //   );
  // }

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
    const applicationNumber = getQueryArg(
      window.location.href,
      "applicationNumber"
    );
    const tenantId = getQueryArg(window.location.href, "tenantId");
    let businessServicesValue = "BPA_OC";
    const queryObject = [
      { key: "tenantId", value: tenantId },
      { key: "businessServices", value: businessServicesValue }
    ];
    setBusinessServiceDataToLocalStorage(queryObject, dispatch);
    setSearchResponse(state, dispatch, applicationNumber, tenantId, action);


    set(
      action,
      "screenConfig.components.div.children.body.children.cardContent.children.scrutinySummary.children.cardContent.children.header.children.editSection.visible",
      false
    );
    set(
      action,
      "screenConfig.components.div.children.body.children.cardContent.children.documentAndNocSummary.children.cardContent.children.header.children.editSection.visible",
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
      "screenConfig.components.div.children.body.children.cardContent.children.declarations.children.headers.visible",
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
            moduleName: "BPA_OC",
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
          fieldinspectionSummary: fieldinspectionSummary,
          fieldSummary: fieldSummary,
          scrutinySummary: scrutinySummary,
          documentAndNocSummary: documentAndNocSummary,
          nocDetailsApply: nocDetailsSearch,
          permitConditions: permitConditions,
          permitListSummary: permitListSummary,
          declarations: declarations
        }),
        citizenFooter: process.env.REACT_APP_NAME === "Citizen" ? citizenFooter : {}
      }
    }
  }
};

export default screenConfig;
