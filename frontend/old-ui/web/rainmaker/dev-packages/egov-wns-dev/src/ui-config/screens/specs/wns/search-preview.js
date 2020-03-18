import {
  getCommonHeader,
  getCommonCard,
  getCommonTitle,
  getCommonGrayCard,
  getCommonContainer,
  getCommonSubHeader,
  getLabel
} from "egov-ui-framework/ui-config/screens/specs/utils";
import get from "lodash/get";
import set from "lodash/set";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getQueryArg, setDocuments, setBusinessServiceDataToLocalStorage, getFileUrlFromAPI } from "egov-ui-framework/ui-utils/commons";
import { prepareFinalObject, preparedFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getSearchResults, getSearchResultsForSewerage, waterEstimateCalculation, getDescriptionFromMDMS, findAndReplace, swEstimateCalculation, setWSDocuments } from "../../../../ui-utils/commons";
import {
  createEstimateData,
  setMultiOwnerForSV,
  setValidToFromVisibilityForSV,
  getDialogButton,
  convertDateToEpoch,
  showHideAdhocPopup
} from "../utils";
import { footerReview } from "./applyResource/footer";
import { downloadPrintContainer } from "../wns/acknowledgement";
import {
  getFeesEstimateOverviewCard,
  getHeaderSideText,
  getTransformedStatus
} from "../utils";
import { getReviewConnectionDetails } from "./applyResource/review-trade";
import { getReviewOwner } from "./applyResource/review-owner";
import { getReviewDocuments } from "./applyResource/review-documents";
import { loadReceiptGenerationData } from "../utils/receiptTransformer";
import { adhocPopup } from "./applyResource/adhocPopup";

const tenantId = getQueryArg(window.location.href, "tenantId");
let applicationNumber = getQueryArg(window.location.href, "applicationNumber");
let service = getQueryArg(window.location.href, "service");
let headerSideText = { word1: "", word2: "" };

const serviceModuleName = service === "WATER" ? "NewWS1" : "NewSW1";
const serviceUrl = serviceModuleName === "NewWS1" ? "/ws-services/wc/_update" : "/sw-services/swc/_update";

const beforeInitFn = async (action, state, dispatch, applicationNumber) => {
  //Search details for given application Number
  if (applicationNumber) {
    let estimate;
    if (!getQueryArg(window.location.href, "edited")) {
      (await searchResults(action, state, dispatch, applicationNumber));
    } else {
      let applyScreenObject = get(state.screenConfiguration.preparedFinalObject, "applyScreen");
      applyScreenObject.applicationNo.includes("WS")?applyScreenObject.service="WATER":applyScreenObject.service="SEWERAGE";
      let parsedObject = parserFunction(findAndReplace(applyScreenObject, "NA", null));
      dispatch(prepareFinalObject("WaterConnection[0]", parsedObject));
      if(parsedObject.applicationStatus==="PENDING_FOR_FIELD_INSPECTION"){
        let queryObjectForEst = [{
          applicationNo: applicationNumber,
          tenantId: tenantId,
          waterConnection: parsedObject
        }]
        if (parsedObject.applicationNo.includes("WS")) {
          estimate = await waterEstimateCalculation(queryObjectForEst, dispatch);
          let viewBillTooltip = [];
          if (estimate !== null && estimate !== undefined) {
            if (estimate.Calculation.length > 0) {
              await processBills(estimate, viewBillTooltip, dispatch);
  
              // viewBreakUp 
              estimate.Calculation[0].billSlabData = _.groupBy(estimate.Calculation[0].taxHeadEstimates, 'category')
  
              dispatch(prepareFinalObject("dataCalculation", estimate.Calculation[0]));
            }
          } else {
            estimate = await swEstimateCalculation(queryObjectForEst, dispatch);
            let viewBillTooltip = []
            if (estimate !== null && estimate !== undefined) {
              if (estimate.Calculation !== undefined && estimate.Calculation.length > 0) {
                await processBills(estimate, viewBillTooltip, dispatch);
                // viewBreakUp 
                estimate.Calculation[0].billSlabData = _.groupBy(estimate.Calculation[0].taxHeadEstimates, 'category')
                dispatch(prepareFinalObject("dataCalculation", estimate.Calculation[0]));
              }
            }
          }
        }
        if (estimate !== null && estimate !== undefined) {
          createEstimateData(estimate.Calculation[0].taxHeadEstimates, "taxHeadEstimates", dispatch, {}, {});
        }
      }
      
      
    }


    let connectionType = get(state, "screenConfiguration.preparedFinalObject.WaterConnection[0].connectionType");
    if (connectionType === "Metered") {
      set(
        action.screenConfig,
        "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewTwelve.children.reviewMeterId.visible",
        true
      );
      set(
        action.screenConfig,
        "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewTwelve.children.reviewMeterInstallationDate.visible",
        true
      );
      set(
        action.screenConfig,
        "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewTwelve.children.reviewInitialMeterReading.visible",
        true
      );
    } else {
      set(
        action.screenConfig,
        "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewTwelve.children.reviewMeterId.visible",
        false
      );
      set(
        action.screenConfig,
        "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewTwelve.children.reviewMeterInstallationDate.visible",
        false
      );
      set(
        action.screenConfig,
        "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewTwelve.children.reviewInitialMeterReading.visible",
        false
      );
    }
    const status = getTransformedStatus(
      get(state, "screenConfiguration.preparedFinalObject.WaterConnection[0].applicationStatus")
    );

    const appStatus = get(
      state,
      "screenConfiguration.preparedFinalObject.WaterConnection[0].applicationStatus"
    );

    const printCont = downloadPrintContainer(
      action,
      state,
      dispatch,
      appStatus,
      applicationNumber,
      tenantId
    );
    set(
      action,
      "screenConfig.components.div.children.headerDiv.children.helpSection.children",
      printCont
    );

    let data = get(state, "screenConfiguration.preparedFinalObject");

    const obj = setStatusBasedValue(status);

    // Get approval details based on status and set it in screenconfig

    if (
      status === "APPROVED" ||
      status === "REJECTED" ||
      status === "CANCELLED"
    ) {
      set(
        action,
        "screenConfig.components.div.children.taskDetails.children.cardContent.children.approvalDetails.visible",
        true
      );

      if (get(data, "WaterConnection[0].documents")) {
        await setDocuments(
          data,
          "WaterConnection[0].documents",
          "LicensesTemp[0].verifyDocData",
          dispatch, 'NewWS1'
        );
      } else {
        dispatch(
          handleField(
            "search-preview",
            "components.div.children.taskDetails.children.cardContent.children.approvalDetails.children.cardContent.children.viewTow.children.lbl",
            "visible",
            false
          )
        );
      }
    } else {
      set(
        action,
        "screenConfig.components.div.children.taskDetails.children.cardContent.children.approvalDetails.visible",
        false
      );
    }

    if (status === "cancelled")
      set(
        action,
        "screenConfig.components.div.children.headerDiv.children.helpSection.children.cancelledLabel.visible",
        true
      );

    setActionItems(action, obj);
    loadReceiptGenerationData(applicationNumber, tenantId);
  }


};

let titleText = "";

const setStatusBasedValue = status => {
  switch (status) {
    case "approved":
      return {
        titleText: "Review the Trade License",
        titleKey: "WS_REVIEW_TRADE_LICENSE",
        titleVisibility: true,
        roleDefination: {
          rolePath: "user-info.roles",
          roles: ["WS_APPROVER"]
        }
      };
    case "pending_payment":
      return {
        titleText: "Review the Application and Proceed",
        titleKey: "WS_REVIEW_APPLICATION_AND_PROCEED",
        titleVisibility: true,
        roleDefination: {
          rolePath: "user-info.roles",
          roles: ["WS_CEMP"]
        }
      };
    case "pending_approval":
      return {
        titleText: "Review the Application and Proceed",
        titleKey: "WS_REVIEW_APPLICATION_AND_PROCEED",
        titleVisibility: true,
        roleDefination: {
          rolePath: "user-info.roles",
          roles: ["WS_APPROVER"]
        }
      };
    case "cancelled":
      return {
        titleText: "",
        titleVisibility: false,
        roleDefination: {}
      };
    case "rejected":
      return {
        titleText: "",
        titleVisibility: false,
        roleDefination: {}
      };

    default:
      return {
        titleText: "",
        titleVisibility: false,
        roleDefination: {}
      };
  }
};

const headerrow = getCommonContainer({
  header: getCommonHeader({
    labelKey: "WS_TASK_DETAILS"
  }),
  application: getCommonContainer({
    applicationNumber: {
      uiFramework: "custom-atoms-local",
      moduleName: "egov-wns",
      componentPath: "ApplicationNoContainer",
      props: {
        number: applicationNumber
      }
    }
  })
});

const estimate = getCommonGrayCard({
  header: getCommonSubHeader({ labelKey: "WS_TASK_DETAILS_FEE_ESTIMATE" }),
  estimateSection: getFeesEstimateOverviewCard({
    sourceJsonPath: "dataCalculation",
    // isCardrequired: true
  }),
  buttonView: getDialogButton(
    "VIEW BREAKUP",
    "WS_PAYMENT_VIEW_BREAKUP",
    "search-preview"
  ),
  addPenaltyRebateButton: {
    componentPath: "Button",
    props: {
      color: "primary",
      style: {}
    },
    children: {
      previousButtonLabel: getLabel({
        labelKey: "WS_PAYMENT_ADD_REBATE_PENALTY"
      })
    },
    onClickDefination: {
      action: "condition",
      callBack: showHideAdhocPopup
    }
  },
});

export const reviewConnectionDetails = getReviewConnectionDetails(false);

export const reviewOwnerDetails = getReviewOwner(false);

export const reviewDocumentDetails = getReviewDocuments(false);

// let approvalDetails = getApprovalDetails(status);
let title = getCommonTitle({ labelName: titleText });

const setActionItems = (action, object) => {
  set(
    action,
    "screenConfig.components.div.children.taskDetails.children.cardContent.children.title",
    getCommonTitle({
      labelName: get(object, "titleText"),
      labelKey: get(object, "titleKey")
    })
  );
  set(
    action,
    "screenConfig.components.div.children.taskDetails.children.cardContent.children.title.visible",
    get(object, "titleVisibility")
  );
  set(
    action,
    "screenConfig.components.div.children.taskDetails.children.cardContent.children.title.roleDefination",
    get(object, "roleDefination")
  );
};

export const taskDetails = getCommonCard({
  title,
  estimate,
  reviewConnectionDetails,
  reviewDocumentDetails,
  reviewOwnerDetails
});

export const summaryScreen = getCommonCard({
  reviewConnectionDetails,
  reviewDocumentDetails,
  reviewOwnerDetails
})

const screenConfig = {
  uiFramework: "material-ui",
  name: "search-preview",
  beforeInitScreen: (action, state, dispatch) => {
    const status = getQueryArg(window.location.href, "status");
    const tenantId = getQueryArg(window.location.href, "tenantId");
    let applicationNumber = getQueryArg(window.location.href, "applicationNumber");
    //To set the application no. at the  top
    set(action.screenConfig, "components.div.children.headerDiv.children.header1.children.applicationNumber.props.number", applicationNumber);
    // if (status !== "pending_payment") {
    //   set(action.screenConfig, "components.div.children.taskDetails.children.cardContent.children.viewBreakupButton.visible", false);
    // }
    const queryObject = [
      { key: "tenantId", value: tenantId },
      { key: "businessServices", value: serviceModuleName }
    ];

    setBusinessServiceDataToLocalStorage(queryObject, dispatch)
    beforeInitFn(action, state, dispatch, applicationNumber);
    return action;
  },

  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      props: {
        className: "common-div-css search-preview"
      },
      children: {
        headerDiv: {
          uiFramework: "custom-atoms",
          componentPath: "Container",
          children: {
            header1: {
              gridDefination: {
                xs: 12,
                sm: 8
              },
              ...headerrow
            },
            helpSection: {
              uiFramework: "custom-atoms",
              componentPath: "Container",
              props: {
                color: "primary",
                style: { justifyContent: "flex-end" } //, dsplay: "block"
              },
              gridDefination: {
                xs: 12,
                sm: 4,
                align: "right"
              },
            }
          }
        },
        taskStatus: {
          uiFramework: "custom-containers-local",
          componentPath: "WorkFlowContainer",
          moduleName: "egov-workflow",
          // visible: process.env.REACT_APP_NAME === "Citizen" ? false : true,
          props: {
            dataPath: "WaterConnection",
            moduleName: serviceModuleName,
            updateUrl: serviceUrl
          }
        },
        actionDialog: {
          uiFramework: "custom-containers-local",
          componentPath: "ResubmitActionContainer",
          moduleName: "egov-wns",
          visible: process.env.REACT_APP_NAME === "Citizen" ? true : false,
          props: {
            open: true,
            dataPath: "WaterConnection",
            moduleName: serviceModuleName,
            updateUrl: serviceUrl,
            data: {
              buttonLabel: "RESUBMIT",
              moduleName: serviceModuleName,
              isLast: false,
              dialogHeader: {
                labelName: "RESUBMIT Application",
                labelKey: "WF_RESUBMIT_APPLICATION"

              },
              showEmployeeList: false,
              roles: "CITIZEN",
              isDocRequired: false
            }
          }
        },
        taskDetails,
      }
    },
    breakUpDialog: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-wns",
      componentPath: "ViewBreakupContainer",
      props: {
        open: false,
        maxWidth: "md",
        screenKey: "search-preview",
      }
    },
    adhocDialog: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-wns",
      componentPath: "DialogContainer",
      props: {
        open: false,
        maxWidth: "sm",
        screenKey: "pay"
      },
      children: {
        popup: adhocPopup
      }
    },
  }
};

//----------------- search code (feb17)---------------------- //
const searchResults = async (action, state, dispatch, applicationNumber) => {
  let queryObjForSearch = [{ key: "tenantId", value: tenantId }, { key: "applicationNumber", value: applicationNumber }]
  let viewBillTooltip = [], estimate, payload = [];
  if (service === "WATER") {
    payload = [];
    payload = await getSearchResults(queryObjForSearch);
    payload.WaterConnection[0].service = service;

    const convPayload = findAndReplace(payload, "NA", null)
    let queryObjectForEst = [{
      applicationNo: applicationNumber,
      tenantId: tenantId,
      waterConnection: convPayload.WaterConnection[0]
    }]
    if (payload !== undefined && payload !== null) {
      dispatch(prepareFinalObject("WaterConnection[0]", payload.WaterConnection[0]));
    }
    // to set documents 
    if (payload.WaterConnection[0].documents !== null && payload.WaterConnection[0].documents !== "NA") {
      await setDocuments(
        state.screenConfiguration.preparedFinalObject,
        "WaterConnection[0].documents",
        "DocumentsData",
        dispatch,
        "WS"
      );
    }
    estimate = await waterEstimateCalculation(queryObjectForEst, dispatch);
    if (estimate !== null && estimate !== undefined) {
      if (estimate.Calculation.length > 0) {
        await processBills(estimate, viewBillTooltip, dispatch);

        // viewBreakUp 
        estimate.Calculation[0].billSlabData = _.groupBy(estimate.Calculation[0].taxHeadEstimates, 'category')

        dispatch(prepareFinalObject("dataCalculation", estimate.Calculation[0]));
      }
    }
  } else if (service === "SEWERAGE") {
    payload = [];
    payload = await getSearchResultsForSewerage(queryObjForSearch, dispatch);
    payload.SewerageConnections[0].service = service;
    if (payload !== undefined && payload !== null) {
      dispatch(prepareFinalObject("WaterConnection[0]", payload.SewerageConnections[0]));
    }

    // to set documents 
    if (payload.SewerageConnections[0].documents !== null && payload.SewerageConnections[0].documents !== "NA") {
      await setDocuments(
        state.screenConfiguration.preparedFinalObject,
        "WaterConnection[0].documents",
        "DocumentsData",
        dispatch,
        "WS"
      );
    }

    const convPayload = findAndReplace(payload, "NA", null)
    let queryObjectForEst = [{
      applicationNo: applicationNumber,
      tenantId: tenantId,
      sewerageConnection: convPayload.SewerageConnections[0]
    }]
    estimate = await swEstimateCalculation(queryObjectForEst, dispatch);
    let viewBillTooltip = []
    if (estimate !== null && estimate !== undefined) {
      if (estimate.Calculation !== undefined && estimate.Calculation.length > 0) {
        await processBills(estimate, viewBillTooltip, dispatch);
        // viewBreakUp 
        estimate.Calculation[0].billSlabData = _.groupBy(estimate.Calculation[0].taxHeadEstimates, 'category')
        dispatch(prepareFinalObject("dataCalculation", estimate.Calculation[0]));
      }
    }
  }
  if (estimate !== null && estimate !== undefined) {
    createEstimateData(estimate.Calculation[0].taxHeadEstimates, "taxHeadEstimates", dispatch, {}, {});
  }
};

const parserFunction = (obj) => {
  let parsedObject = {
    roadCuttingArea: parseInt(obj.roadCuttingArea),
    meterInstallationDate: convertDateToEpoch(obj.meterInstallationDate),
    connectionExecutionDate: convertDateToEpoch(obj.connectionExecutionDate),
    proposedWaterClosets: parseInt(obj.proposedWaterClosets),
    proposedToilets: parseInt(obj.proposedToilets),
    roadCuttingArea: parseInt(obj.roadCuttingArea),
    meterId: parseInt(obj.meterId),
    additionalDetails: {
      initialMeterReading: (
        obj.additionalDetails !== undefined &&
        obj.additionalDetails.initialMeterReading !== undefined
      ) ? parseInt(obj.additionalDetails.initialMeterReading) : null
    },
    noOfTaps: parseInt(obj.noOfTaps),
    proposedTaps: parseInt(obj.proposedTaps),
    plumberInfo: (obj.plumberInfo === null || obj.plumberInfo === "NA") ? [] : obj.plumberInfo
  }
  obj = { ...obj, ...parsedObject }
  return obj;
}

const processBills = async (data, viewBillTooltip, dispatch) => {
  let des, obj, groupBillDetails = [];
  let appNumber=data.Calculation[0].applicationNo;
  data.Calculation[0].taxHeadEstimates.forEach(async element => {
    let cessKey = element.taxHeadCode
    let body;
    if (service === "WATER" ||appNumber.includes("WS")) {
      body = { "MdmsCriteria": { "tenantId": "pb.amritsar", "moduleDetails": [{ "moduleName": "ws-services-calculation", "masterDetails": [{ "name": cessKey }] }] } }
    } else {
      body = { "MdmsCriteria": { "tenantId": "pb.amritsar", "moduleDetails": [{ "moduleName": "sw-services-calculation", "masterDetails": [{ "name": cessKey }] }] } }
    }
    let res = await getDescriptionFromMDMS(body, dispatch)
    if (res !== null && res !== undefined && res.MdmsRes !== undefined && res.MdmsRes !== null) {
      if (service === "WATER" || appNumber.includes("WS")) { des = res.MdmsRes["ws-services-calculation"]; }
      else { des = res.MdmsRes["sw-services-calculation"]; }
      if (des !== null && des !== undefined && des[cessKey] !== undefined && des[cessKey][0] !== undefined && des[cessKey][0] !== null) {
        groupBillDetails.push({ key: cessKey, value: des[cessKey][0].description, amount: element.estimateAmount, order: element.order })
      } else {
        groupBillDetails.push({ key: cessKey, value: 'Please put some description in mdms for this Key', amount: element.estimateAmount, category: element.category })
      }
    }
  })
  obj = { bill: groupBillDetails }
  viewBillTooltip.push(obj);
  const dataArray = [{ total: data.Calculation[0].totalAmount }]
  const finalArray = [{ description: viewBillTooltip, data: dataArray }]
  dispatch(prepareFinalObject("viewBillToolipData", finalArray));
}

// const setWSDocuments = async (obj, dispatch) => {
//   let getDocList = get(obj, "WaterConnection[0].documents");
//   console.log("-------------------------");
//   console.log(obj.WaterConnection);
//   console.log(obj.WaterConnection[0]);
//   console.log(obj.WaterConnection[0].documents);
//   console.log('---------------------------------------------');
//   dispatch(prepareFinalObject("DocumentsData", getDocList));
//   console.log(get(obj, 'DocumentsData'));
//   await setDocuments(
//     obj,
//     "WaterConnection[0].documents",
//     "DocumentsData",
//     dispatch, "WS"
//   );
// }
export default screenConfig;
