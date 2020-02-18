import {
  getCommonHeader,
  getCommonCard,
  getCommonTitle,
  getCommonGrayCard,
  getCommonContainer,
  getCommonSubHeader
} from "egov-ui-framework/ui-config/screens/specs/utils";
import get from "lodash/get";
import set from "lodash/set";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getQueryArg, setDocuments, setBusinessServiceDataToLocalStorage, getFileUrlFromAPI } from "egov-ui-framework/ui-utils/commons";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getSearchResults, getSearchResultsForSewerage, fetchBill, getDescriptionFromMDMS } from "../../../../ui-utils/commons";
import {
  createEstimateData,
  setMultiOwnerForSV,
  setValidToFromVisibilityForSV,
  getDialogButton
} from "../utils";

import { footerReview } from "./applyResource/footer";
import {
  getFeesEstimateCard,
  getHeaderSideText,
  getTransformedStatus
} from "../utils";
import { getReviewConnectionDetails } from "./applyResource/review-trade";
import { getReviewOwner } from "./applyResource/review-owner";
import { getReviewDocuments } from "./applyResource/review-documents";
import { loadReceiptGenerationData } from "../utils/receiptTransformer";

const tenantId = getQueryArg(window.location.href, "tenantId");
let applicationNumber = getQueryArg(window.location.href, "applicationNumber");
let service = getQueryArg(window.location.href, "service");
let headerSideText = { word1: "", word2: "" };



// const getTradeTypeSubtypeDetails = payload => {
//   const tradeUnitsFromApi = get(
//     payload,
//     "Licenses[0].tradeLicenseDetail.tradeUnits",
//     []
//   );
//   const tradeUnitDetails = [];
//   tradeUnitsFromApi.forEach(tradeUnit => {
//     const { tradeType } = tradeUnit;
//     const tradeDetails = tradeType.split(".");
//     tradeUnitDetails.push({
//       trade: get(tradeDetails, "[0]", ""),
//       tradeType: get(tradeDetails, "[1]", ""),
//       tradeSubType: get(tradeDetails, "[2]", "")
//     });
//   });
//   return tradeUnitDetails;
// };

//---------------- existing Code -------------------- //
// const searchResults = async (action, state, dispatch, applicationNo) => {
//   let queryObject = [
//     { key: "tenantId", value: tenantId },
//     { key: "applicationNumber", value: applicationNumber }
//   ];
//   let payload = await getSearchResults(queryObject);


//   console.log("payloaddata", payload)

//   headerSideText = getHeaderSideText(
//     get(payload, "WaterConnection[0].applicationStatus"),
//     get(payload, "WaterConnection[0].applicationNo")
//   );
//   set(payload, "WaterConnection[0].headerSideText", headerSideText);

//   // get(payload, "WaterConnection[0].tradeLicenseDetail.subOwnerShipCategory") &&
//   //   get(payload, "WaterConnection[0].tradeLicenseDetail.subOwnerShipCategory").split(
//   //     "."
//   //   )[0] === "INDIVIDUAL"
//   //   ? setMultiOwnerForSV(action, true)
//   //   : setMultiOwnerForSV(action, false);

//   // if (get(payload, "Licenses[0].licenseType")) {
//   //   setValidToFromVisibilityForSV(
//   //     action,
//   //     get(payload, "Licenses[0].licenseType")
//   //   );
//   // }

//   // await setDocuments(
//   //   payload,
//   //   "Licenses[0].tradeLicenseDetail.applicationDocuments",
//   //   "LicensesTemp[0].reviewDocData",
//   //   dispatch,'TL'
//   // );
//   let sts = getTransformedStatus(get(payload, "WaterConnection[0].applicationStatus"));
//   payload && dispatch(prepareFinalObject("WaterConnection[0]", payload.WaterConnection[0]));
//   // payload &&
//   //   dispatch(
//   //     prepareFinalObject(
//   //       "LicensesTemp[0].tradeDetailsResponse",
//   //       getTradeTypeSubtypeDetails(payload)
//   //     )
//   //   );
//   const WaterData = payload.WaterConnection[0];
//   // const fetchFromReceipt = sts !== "pending_payment";
//   createEstimateData(WaterData, "LicensesTemp[0].estimateCardData", dispatch, {}, {});
//   // Fetch Bill and populate estimate card
//   // const code = get(
//   //   payload,
//   //   "WaterConnection[0].property.address.locality.code"
//   // );
//   // const queryObj = [{ key: "tenantId", value: "pb.amritsar" }];
//   // getBoundaryData(action, state, dispatch, queryObj, code);
// };

const beforeInitFn = async (action, state, dispatch, applicationNumber) => {
  //Search details for given application Number
  if (applicationNumber) {
    !getQueryArg(window.location.href, "edited") &&
      (await searchResults(action, state, dispatch, applicationNumber));

    const status = getTransformedStatus(
      get(state, "screenConfiguration.preparedFinalObject.WaterConnection[0].applicationStatus")
    );
    // const status = get(
    //   state,
    //   "screenConfiguration.preparedFinalObject.WaterConnection[0].applicationStatus"
    // );

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

      if (get(data, "Licenses[0].tradeLicenseDetail.verificationDocuments")) {
        await setDocuments(
          data,
          "Licenses[0].tradeLicenseDetail.verificationDocuments",
          "LicensesTemp[0].verifyDocData",
          dispatch, 'TL'
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

    const footer = footerReview(
      action,
      state,
      dispatch,
      status,
      applicationNumber,
      tenantId
    );
    process.env.REACT_APP_NAME === "Citizen"
      ? set(action, "screenConfig.components.div.children.footer", footer)
      : set(action, "screenConfig.components.div.children.footer", {});

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
    labelName: "Task Details",
    labelKey: "WS_TASK_DETAILS"
  }),
  applicationNumber: {
    uiFramework: "custom-atoms-local",
    moduleName: "egov-wns",
    componentPath: "ApplicationNoContainer",
    props: {
      number: applicationNumber
    }
  }
});

const estimate = getCommonGrayCard({
  header: getCommonSubHeader({ labelKey: "WS_TASK_DETAILS_FEE_ESTIMATE" }),
  estimateSection: getFeesEstimateCard({
    sourceJsonPath: "viewBillToolipData",
    isCardrequired: true
  }),
  buttonView: getDialogButton(
    "VIEW BREAKUP",
    "WS_PAYMENT_VIEW_BREAKUP",
    "search-preview"
  ),
  buttonAdd: getDialogButton(
    "ADD REBATE/PENALTY",
    "WS_PAYMENT_ADD_REBATE_PENALTY",
    "search-preview"
  ),
});

export const reviewConnectionDetails = getReviewConnectionDetails(false);

export const reviewOwnerDetails = getReviewOwner(false);

export const reviewDocumentDetails = getReviewDocuments(false, false);

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
    applicationNumber = getQueryArg(window.location.href, "applicationNumber");
    //To set the application no. at the  top
    set(action.screenConfig, "components.div.children.headerDiv.children.header1.children.applicationNumber.props.number", applicationNumber);
    // if (status !== "pending_payment") {
    //   set(action.screenConfig, "components.div.children.taskDetails.children.cardContent.children.viewBreakupButton.visible", false);
    // }
    const queryObject = [
      { key: "tenantId", value: tenantId },
      { key: "businessServices", value: "NewWS1" }
    ];
    setBusinessServiceDataToLocalStorage(queryObject, dispatch)
    // response.then(data=>console.log("applyresource",data));
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
              // children:
              //   process.env.REACT_APP_NAME === "Employee"
              //     ? {}
              //     : {
              //       word1: {
              //         ...getCommonTitle(
              //           {
              //             jsonPath: "Licenses[0].headerSideText.word1"
              //           },
              //           {
              //             style: {
              //               marginRight: "10px",
              //               color: "rgba(0, 0, 0, 0.6000000238418579)"
              //             }
              //           }
              //         )
              //       },
              //       word2: {
              //         ...getCommonTitle({
              //           jsonPath: "Licenses[0].headerSideText.word2"
              //         })
              //       },
              //       cancelledLabel: {
              //         ...getCommonHeader(
              //           {
              //             labelName: "Cancelled",
              //             labelKey: "WS_COMMON_STATUS_CANC"
              //           },
              //           { variant: "body1", style: { color: "#E54D42" } }
              //         ),
              //         visible: false
              //       }
              //     }
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
            moduleName: "NewWS1",
            updateUrl: "/ws-services/wc/_update"
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
            moduleName: "NewWS1",
            updateUrl: "/ws-services/wc/_update",
            data: {
              buttonLabel: "RESUBMIT",
              moduleName: "NewWS1",
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
        // footer
      }
    },
    breakUpDialog: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-wns",
      componentPath: "ViewBreakupContainer",
      props: {
        open: false,
        maxWidth: "md",
        screenKey: "search-preview"
      }
    }
  }
};

//----------------- search code (feb17)---------------------- //
const searchResults = async (action, state, dispatch, applicationNumber) => {
  let queryObjForSearch = [{ key: "tenantId", value: tenantId }, { key: "applicationNumber", value: applicationNumber }]
  let viewBillTooltip = [], data;
  if (service === "WATER") {
    let payload = await getSearchResults(queryObjForSearch);
    let queryObjectForFetchBill = [{ key: "tenantId", value: tenantId }, { key: "consumerCode", value: applicationNumber }, { key: "businessService", value: "WS.ONE_TIME_FEE" }];
    data = await fetchBill(queryObjectForFetchBill, dispatch);
    if (payload !== null && payload !== undefined && data !== null && data !== undefined) {
      if (payload.WaterConnection.length > 0 && data.Bill.length > 0) {
        payload.WaterConnection[0].service = service
        await processBills(data, viewBillTooltip, dispatch);

        dispatch(prepareFinalObject("WaterConnection[0]", payload.WaterConnection[0]));
        dispatch(prepareFinalObject("billData", data.Bill[0]));
      }
    }
  } else if (service === "SEWERAGE") {
    let queryObjectForFetchBill = [{ key: "tenantId", value: tenantId }, { key: "consumerCode", value: applicationNumber }, { key: "businessService", value: "SW.ONE_TIME_FEE" }];
    let payload = await getSearchResultsForSewerage(queryObjForSearch, dispatch);
    data = await fetchBill(queryObjectForFetchBill, dispatch)
    let viewBillTooltip = []
    if (payload !== null && payload !== undefined && data !== null && data !== undefined) {
      if (payload.SewerageConnections.length > 0 && data.Bill.length > 0) {
        payload.SewerageConnections[0].service = service;
        await processBills(data, viewBillTooltip, dispatch);
        dispatch(prepareFinalObject("WaterConnection[0]", payload.SewerageConnections[0]));
        dispatch(prepareFinalObject("billData", data.Bill[0]));
      }
    }
  }
  createEstimateData(data, "screenConfiguration.preparedFinalObject.billData.billDetails", dispatch, {}, {});
};

const processBills = async (data, viewBillTooltip, dispatch) => {
  data.Bill[0].billDetails.forEach(bills => {
    let des, obj, groupBillDetails = [];
    bills.billAccountDetails.forEach(async element => {
      let cessKey = element.taxHeadCode
      let body;
      if (service === "WATER") {
        body = { "MdmsCriteria": { "tenantId": "pb.amritsar", "moduleDetails": [{ "moduleName": "ws-services-calculation", "masterDetails": [{ "name": cessKey }] }] } }
      } else {
        body = { "MdmsCriteria": { "tenantId": "pb.amritsar", "moduleDetails": [{ "moduleName": "sw-services-calculation", "masterDetails": [{ "name": cessKey }] }] } }
      }
      let res = await getDescriptionFromMDMS(body, dispatch)
      if (res !== null && res !== undefined && res.MdmsRes !== undefined && res.MdmsRes !== null) {
        if (service === "WATER") { des = res.MdmsRes["ws-services-calculation"]; }
        else { des = res.MdmsRes["sw-services-calculation"]; }
        if (des !== null && des !== undefined && des[cessKey] !== undefined && des[cessKey][0] !== undefined && des[cessKey][0] !== null) {
          groupBillDetails.push({ key: cessKey, value: des[cessKey][0].description, amount: element.amount, order: element.order })
        } else {
          groupBillDetails.push({ key: cessKey, value: 'Please put some description in mdms for this Key', amount: element.amount, order: element.order })
        }
        if (groupBillDetails.length >= bills.billAccountDetails.length) {
          let arrayData = groupBillDetails.sort((a, b) => parseInt(a.order) - parseInt(b.order))
          obj = { bill: arrayData, fromPeriod: bills.fromPeriod, toPeriod: bills.toPeriod }
          viewBillTooltip.push(obj)
        }
        if (viewBillTooltip.length >= data.Bill[0].billDetails.length) {
          let dataArray = [{ total: data.Bill[0].totalAmount, expiryDate: bills.expiryDate }]
          let descriptionArray = viewBillTooltip
          let finalArray = [{ description: descriptionArray, data: dataArray }]
          dispatch(prepareFinalObject("viewBillToolipData", finalArray));
        }
      }
    })
  })
}

export default screenConfig;
