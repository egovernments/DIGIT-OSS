import {
  getCommonCard,
  getCommonContainer,
  getCommonHeader,
  convertEpochToDate
} from "egov-ui-framework/ui-config/screens/specs/utils";
import {
  handleScreenConfigurationFieldChange as handleField,
  prepareFinalObject
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {
  getFileUrlFromAPI,
  getFileUrl,
  getQueryArg,
  getTransformedLocale,
  setBusinessServiceDataToLocalStorage
} from "egov-ui-framework/ui-utils/commons";
import { getLocale } from "egov-ui-kit/utils/localStorageUtils";
import jp from "jsonpath";
import get from "lodash/get";
import set from "lodash/set";
import { getAppSearchResults } from "../../../../ui-utils/commons";
import { 
  requiredDocumentsData, 
  edcrDetailsToBpaDetails,
  applicantNameAppliedByMaping
} from "../utils/index";
import { citizenFooter } from "./searchResource/citizenFooter";
import { scrutinySummary } from "./summaryResource/scrutinySummary";
import { documentAndNocSummary } from "./summaryResource/documentAndNocSummary";
import { fieldinspectionSummary } from "./summaryResource/fieldinspectionSummary";
import { fieldSummary } from "./summaryResource/fieldSummary";
import { permitListSummary } from "./summaryResource/permitListSummary";
import { permitConditions } from "./summaryResource/permitConditions";
import { httpRequest, edcrHttpRequest } from "../../../../ui-utils/api";
import { permitOrderNoDownload, downloadFeeReceipt, revocationPdfDownload, setProposedBuildingData } from "../utils/index";
import { getUserInfo, getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import { fetchLocalizationLabel } from "egov-ui-kit/redux/app/actions";
import "../egov-bpa/applyResource/index.scss";
import "../egov-bpa/applyResource/index.css";

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

const setDownloadMenu = (action, state, dispatch) => {
  /** MenuButton data based on status */
  let status = get(
    state,
    "screenConfiguration.preparedFinalObject.BPA.status"
  );
  let riskType = get(
    state,
    "screenConfiguration.preparedFinalObject.BPA.riskType"
  );
  let comparisonDetails = get(
    state,
    "screenConfiguration.preparedFinalObject.comparisonDetails"
  );
  let comparisonReport = false;
  if(comparisonDetails){
    comparisonReport = get(comparisonDetails, "report");
  }
  let downloadMenu = [];
  let printMenu = [];
  let certificateDownloadObject = {
    label: { labelName: "Payment Receipt", labelKey: "BPA_APP_FEE_RECEIPT" },
    link: () => {
      downloadFeeReceipt(state, dispatch, status, "BPA.NC_OC_APP_FEE");
    },
    leftIcon: "book"
  };

  let receiptDownloadObject = {
    label: { labelName: "Deviation Penality Receipt", labelKey: "BPA_OC_DEV_PEN_RECEIPT" },
    link: () => {
      downloadFeeReceipt(state, dispatch, status, "BPA.NC_OC_SAN_FEE");
    },
    leftIcon: "receipt"
  };

  let applicationDownloadObject = {
    label: { labelName: "Occupancy Certificate", labelKey: "BPA_OC_CERTIFICATE" },
    link: () => {
      permitOrderNoDownload(action, state, dispatch);
    },
    leftIcon: "assignment"
  };

  let paymentReceiptDownload = {
    label: { labelName: "Fee Receipt", labelKey: "BPA_FEE_RECEIPT" },
    link: () => {
      downloadFeeReceipt(state, dispatch, status, "BPA.LOW_RISK_PERMIT_FEE");
    },
    leftIcon: "book"
  };
  let revocationPdfDownlaod = {
    label: { labelName: "Revocation Letter", labelKey: "BPA_REVOCATION_PDF_LABEL" },
    link: () => {
      revocationPdfDownload(action, state, dispatch);
    },
    leftIcon: "assignment"
  };
  let comparisonReportDownloadObject = {}
  if(comparisonReport){
    comparisonReportDownloadObject = {
      label: { labelName: "Comparison Report", labelKey: "BPA_COMPARISON_REPORT_LABEL" },
      link: () => {
        window.open(comparisonReport);
      },
      leftIcon: "assignment"
    }
  }
  

  // if (riskType === "LOW") {
  //   switch (status) {
  //     case "REVOCATED":
  //       downloadMenu = [paymentReceiptDownload, revocationPdfDownlaod];
  //       break;
  //     case "APPROVED":
  //     case "DOC_VERIFICATION_INPROGRESS":
  //     case "FIELDINSPECTION_INPROGRESS":
  //     case "NOC_VERIFICATION_INPROGRESS":
  //     case "APPROVAL_INPROGRESS":
  //       downloadMenu = [paymentReceiptDownload, applicationDownloadObject];
  //       break;
  //     default:
  //       break;
  //   }
  // } else {
    switch (status) {
      case "APPROVED":
        downloadMenu = [
          certificateDownloadObject,
          receiptDownloadObject,
          applicationDownloadObject
        ];
        printMenu = [];
        break;
      case "DOC_VERIFICATION_INPROGRESS":
      case "FIELDINSPECTION_INPROGRESS":
      case "NOC_VERIFICATION_INPROGRESS":
      case "APPROVAL_INPROGRESS":
      case "PENDING_SANC_FEE_PAYMENT":
      case "PENDINGAPPROVAL":
      case "REJECTED":
        downloadMenu = [certificateDownloadObject];
        printMenu = [];
        break;
      default:
        break;
    }
  // }

  if(comparisonReport){
    downloadMenu.push(comparisonReportDownloadObject);
    printMenu.push(comparisonReportDownloadObject);
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

const getRequiredMdmsDetails = async (state, dispatch) => {
  let mdmsBody = {
    MdmsCriteria: {
      tenantId: getTenantId(),
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

  const edcrNumber = get(response, "Bpa[0].edcrNumber");
  const status = get(response, "Bpa[0].status");
  dispatch(prepareFinalObject("BPA", response.Bpa[0]));

  let edcrRes = await edcrHttpRequest(
    "post",
    "/edcr/rest/dcr/scrutinydetails?edcrNumber=" + edcrNumber + "&tenantId=" + tenantId,
    "search", []
  );

  dispatch(prepareFinalObject(`ocScrutinyDetails`, edcrRes.edcrDetail[0]));
  await edcrDetailsToBpaDetails(state, dispatch);
  await applicantNameAppliedByMaping(state, dispatch, get(response, "Bpa[0]"), get(edcrRes, "edcrDetail[0]"));
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
        if (role.code === "BPA_ARCHITECT") {
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

  if (status && status === "CITIZEN_APPROVAL_INPROCESS") {
    let userInfo = JSON.parse(getUserInfo()),
      roles = get(userInfo, "roles"),
      owners = get(response.Bpa["0"].landInfo, "owners"),
      archtect = "BPA_ARCHITECT",
      isTrue = false, isOwner = true;
    if (roles && roles.length > 0) {
      roles.forEach(role => {
        if (role.code === archtect) {
          isTrue = true;
        }
      })
    }

    if (isTrue && owners && owners.length > 0) {
      owners.forEach(owner => {
        if (owner.mobileNumber === userInfo.mobileNumber) {
          if (owner.roles && owner.roles.length > 0) {
            owner.roles.forEach(owrRole => {
              if (owrRole.code === archtect) {
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


  if (response && response.Bpa["0"] && response.Bpa["0"].documents) {
    dispatch(prepareFinalObject("documentsTemp", response.Bpa["0"].documents));
  }

  if (response && get(response, "Bpa[0].approvalNo")) {
    dispatch(
      handleField(
        "search-preview",
        "components.div.children.headerDiv.children.header2.children.titlebar2.children.permitNumber",
        "props.number",
        get(response, "Bpa[0].approvalNo")
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

  if (get(response, "Bpa[0].additionalDetails.validityDate")) {
    dispatch(
      handleField(
        "search-preview",
        "components.div.children.headerDiv.children.header.children.rightContainerH.children.footNote",
        "props.number",
        convertEpochToDate(get(response, "Bpa[0].additionalDetails.validityDate"))
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
  setDownloadMenu(action, state, dispatch);
  dispatch(fetchLocalizationLabel(getLocale(), tenantId, tenantId));
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
    let businessServicesValue = "BPA_OC";
    const queryObject = [
      { key: "tenantId", value: tenantId },
      { key: "businessServices", value: businessServicesValue }
    ];
    setBusinessServiceDataToLocalStorage(queryObject, dispatch);
    setSearchResponse(state, dispatch, applicationNumber, tenantId, action);

    // const queryObject = [
    //   { key: "tenantId", value: tenantId },
    //   { key: "businessServices", value: "BPA_OC" }
    // ];
    // setBusinessServiceDataToLocalStorage(queryObject, dispatch);


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
            updateUrl: "/bpa-services/v1/bpa/_update"
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
          fieldinspectionSummary: fieldinspectionSummary,
          fieldSummary: fieldSummary,
          scrutinySummary: scrutinySummary,
          documentAndNocSummary: documentAndNocSummary,
          permitConditions: permitConditions,
          permitListSummary: permitListSummary
        }),
        citizenFooter: process.env.REACT_APP_NAME === "Citizen" ? citizenFooter : {}
      }
    }
  }
};

export default screenConfig;
