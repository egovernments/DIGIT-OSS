import { getCommonHeader, getCommonCard, getCommonGrayCard, getCommonContainer, getCommonSubHeader, convertEpochToDate, getLabel } from "egov-ui-framework/ui-config/screens/specs/utils";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { prepareFinalObject, handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import set from "lodash/set";
import get from "lodash/get";

import {
  getSearchResultsForCurrentBill,
  getSearchResultsForSewerage,
  fetchBill,
  getDescriptionFromMDMS,
  getConsumptionDetails,
  serviceConst
} from "../../../../ui-utils/commons";
import {
  createEstimateData,
  getFeesEstimateCard,
} from "../utils";
import { getProperty } from "./viewBillResource/propertyDetails";
import { getOwner } from "./viewBillResource/ownerDetails";
import { getService } from "./viewBillResource/serviceDetails";
import { viewBillFooter } from "./viewBillResource/viewBillFooter";

import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";

let consumerCode = getQueryArg(window.location.href, "connectionNumber");
const tenantId = getQueryArg(window.location.href, "tenantId")
const service = getQueryArg(window.location.href, "service")

const processBills = async (state, data, viewBillTooltip, dispatch) => {
  data.Bill[0].billDetails.forEach(bills => {
    let des, obj, groupBillDetails = [];
    bills.billAccountDetails.forEach(async element => {
      let cessKey = element.taxHeadCode
      let body;
      if (service === serviceConst.WATER) {
        body = { "MdmsCriteria": { "tenantId": getTenantId(), "moduleDetails": [{ "moduleName": "ws-services-calculation", "masterDetails": [{ "name": cessKey }] }] } }
      } else {
        body = { "MdmsCriteria": { "tenantId": getTenantId(), "moduleDetails": [{ "moduleName": "sw-services-calculation", "masterDetails": [{ "name": cessKey }] }] } }
      }
      let res = await getDescriptionFromMDMS(body, dispatch)
      if (res !== null && res !== undefined && res.MdmsRes !== undefined && res.MdmsRes !== null) {
        if (service === serviceConst.WATER) { des = res.MdmsRes["ws-services-calculation"]; }
        else { des = res.MdmsRes["sw-services-calculation"]; }
        if (des !== null && des !== undefined && des[cessKey] !== undefined && des[cessKey][0] !== undefined && des[cessKey][0] !== null) {
          groupBillDetails.push({ key: cessKey, value: des[cessKey][0].description, amount: element.amount, order: element.order })
        } else {
          groupBillDetails.push({ key: cessKey, value: 'Please put some description in mdms for this Key', amount: element.amount, order: element.order })
        }
        if (groupBillDetails.length >= bills.billAccountDetails.length) {
          let arrayData = groupBillDetails.sort((a, b) => parseInt(a.order) - parseInt(b.order))
          obj = { bill: arrayData, fromPeriod: bills.fromPeriod, toPeriod: bills.toPeriod, demandId: bills.demandId }
          viewBillTooltip.push(obj)
        }
        if (viewBillTooltip.length >= data.Bill[0].billDetails.length) {
          let bPeriodMDMS = get(state.screenConfiguration.preparedFinalObject, "billingPeriodMDMS", {});
          // let expiryDemandDate = billingPeriodMDMS(bills.toPeriod,bPeriodMDMS,service);
          let expiryDemandDate = bills.expiryDate;
          let dataArray = [{
            total: data.Bill[0].totalAmount,
            expiryDate: expiryDemandDate
          }]
          let sortedBills = viewBillTooltip.sort((a, b) => b.toPeriod - a.toPeriod);
          let forward = 0;
          let currentDemand = sortedBills[0];
          if (data.Bill[0].totalAmount < 0) {
            sortedBills.forEach(e => {
              e.bill.forEach(cur => {
                if (cur.key === "WS_ADVANCE_CARRYFORWARD" || cur.key === "SW_ADVANCE_CARRYFORWARD") {
                  forward = forward + cur.amount
                }
              });
            });
            let keyExist = false;
            currentDemand.bill.forEach(cur => {
              if (cur.key === "WS_ADVANCE_CARRYFORWARD" || cur.key === "SW_ADVANCE_CARRYFORWARD") {
                cur.amount = forward;
                keyExist = true;
              }
            });
            if (!keyExist) {
              currentDemand.bill.push({
                amount: forward,
                key: "ADVANCE_CARRYFORWARD",
                order: 2,
                value: "Please put some description in mdms for this key"
              })
            }
          }
          let totalArrears = 0;
          if (data.Bill[0].totalAmount > 0) {
            sortedBills.shift();
            sortedBills.forEach(e => { e.bill.forEach(o => { totalArrears = totalArrears + o.amount }); })
          }

          let finalArray = [{
            arrears: totalArrears,
            arrearsDescription: "Total outstanding payment of previous billing cycles.",
            description: currentDemand,
            data: dataArray
          }]
          dispatch(prepareFinalObject("viewBillToolipData", finalArray));
        }
      }
    })
  })
}

const fetchMDMSForBillPeriod = async (action, state, dispatch) => {
  const requestBody = {
    "MdmsCriteria": {
      "tenantId": tenantId,
      "moduleDetails": [
        { "moduleName": "ws-services-masters", "masterDetails": [{ "name": "billingPeriod" }] },
        { "moduleName": "sw-services-calculation", "masterDetails": [{ "name": "billingPeriod" }] }
      ]
    }
  }
  try {
    let response = await getDescriptionFromMDMS(requestBody, dispatch);
    dispatch(prepareFinalObject("billingPeriodMDMS", response.MdmsRes))
  } catch (error) {
  }
}
const searchResults = async (action, state, dispatch, consumerCode) => {
  let queryObjForSearch = [{ key: "tenantId", value: tenantId }, { key: "connectionNumber", value: consumerCode }]
  let queryObjectForConsumptionDetails = [{ key: "tenantId", value: tenantId }, { key: "connectionNos", value: consumerCode }]
  let viewBillTooltip = [], data;
  let serviceUrl = getQueryArg(window.location.href, "service");
  if (serviceUrl === serviceConst.WATER) {
    let meterReadingsData = await getConsumptionDetails(queryObjectForConsumptionDetails, dispatch);
    let payload = await getSearchResultsForCurrentBill(queryObjForSearch, true);
    let queryObjectForFetchBill = [{ key: "tenantId", value: tenantId }, { key: "consumerCode", value: consumerCode }, { key: "businessService", value: "WS" }];
    data = await fetchBill(queryObjectForFetchBill, dispatch);
    if (payload !== null && payload !== undefined && data !== null && data !== undefined) {
      if (payload.WaterConnection.length > 0 && data.Bill.length > 0) {
        payload.WaterConnection[0].service = serviceUrl
        await processBills(state, data, viewBillTooltip, dispatch);
        if (meterReadingsData !== null && meterReadingsData !== undefined && meterReadingsData.meterReadings.length > 0) {
          payload.WaterConnection[0].consumption = meterReadingsData.meterReadings[0].currentReading - meterReadingsData.meterReadings[0].lastReading
          payload.WaterConnection[0].currentMeterReading = meterReadingsData.meterReadings[0].currentReading
          payload.WaterConnection[0].lastMeterReading = meterReadingsData.meterReadings[0].lastReading
          meterReadingsData.meterReadings[0].currentReadingDate = convertEpochToDate(meterReadingsData.meterReadings[0].currentReadingDate)
          meterReadingsData.meterReadings[0].lastReading = meterReadingsData.meterReadings[0].lastReading === 0 ? "0" : meterReadingsData.meterReadings[0].lastReading
        }

        if (payload.WaterConnection[0].additionalDetails.adhocPenaltyComment === 'NA' || payload.WaterConnection[0].additionalDetails.adhocPenaltyComment === null || payload.WaterConnection[0].additionalDetails.adhocPenaltyComment === undefined) {
          payload.WaterConnection[0].additionalDetails.adhocPenaltyComment = "";
        }
        if (payload.WaterConnection[0].additionalDetails.adhocRebateComment === 'NA' || payload.WaterConnection[0].additionalDetails.adhocRebateComment === null || payload.WaterConnection[0].additionalDetails.adhocRebateComment === undefined) {
          payload.WaterConnection[0].additionalDetails.adhocRebateComment = "";
        }
        if (payload.WaterConnection[0].additionalDetails.adhocPenaltyReason === 'NA' || payload.WaterConnection[0].additionalDetails.adhocPenaltyReason === null || payload.WaterConnection[0].additionalDetails.adhocPenaltyReason === undefined) {
          payload.WaterConnection[0].additionalDetails.adhocPenaltyReason = "";
        }
        if (payload.WaterConnection[0].additionalDetails.adhocRebateReason === 'NA' || payload.WaterConnection[0].additionalDetails.adhocRebateReason === null || payload.WaterConnection[0].additionalDetails.adhocRebateReason === undefined) {
          payload.WaterConnection[0].additionalDetails.adhocRebateReason = "";
        }

        if (payload.WaterConnection[0] && payload.WaterConnection[0].connectionType === "Metered") {
          dispatch(
            handleField(
              "viewBill",
              "components.div.children.viewBill.children.cardContent.children.serviceDetails.children.cardContent.children.waterMeterDetails",
              "visible",
              true
            )
          );
          dispatch(
            handleField(
              "viewBill",
              "components.div.children.viewBill.children.cardContent.children.serviceDetails.children.cardContent.children.waterDetails",
              "visible",
              false
            )
          );
        } else {
          dispatch(
            handleField(
              "viewBill",
              "components.div.children.viewBill.children.cardContent.children.serviceDetails.children.cardContent.children.waterDetails",
              "visible",
              true
            )
          );
          dispatch(
            handleField(
              "viewBill",
              "components.div.children.viewBill.children.cardContent.children.serviceDetails.children.cardContent.children.waterMeterDetails",
              "visible",
              false
            )
          );
        }
        dispatch(
          handleField(
            "viewBill",
            "components.div.children.viewBill.children.cardContent.children.serviceDetails.children.cardContent.children.sewerDetails",
            "visible",
            false
          )
        );
        dispatch(prepareFinalObject("WaterConnection[0]", payload.WaterConnection[0]));
        dispatch(prepareFinalObject("billData", data.Bill[0]));
        dispatch(prepareFinalObject("consumptionDetails[0]", meterReadingsData.meterReadings[0]))
      }
    }
  } else if (serviceUrl === serviceConst.SEWERAGE) {
    let queryObjectForFetchBill = [{ key: "tenantId", value: tenantId }, { key: "consumerCode", value: consumerCode }, { key: "businessService", value: "SW" }];
    let payload = await getSearchResultsForSewerage(queryObjForSearch, dispatch, true);
    data = await fetchBill(queryObjectForFetchBill, dispatch)
    let viewBillTooltip = []
    if (payload !== null && payload !== undefined && data !== null && data !== undefined) {
      if (payload.SewerageConnections.length > 0 && data.Bill.length > 0) {
        payload.SewerageConnections[0].service = serviceUrl;
        await processBills(state, data, viewBillTooltip, dispatch);
        if (payload.SewerageConnections[0].additionalDetails.adhocPenaltyComment === 'NA' || payload.SewerageConnections[0].additionalDetails.adhocPenaltyComment === null || payload.SewerageConnections[0].additionalDetails.adhocPenaltyComment === undefined) {
          payload.SewerageConnections[0].additionalDetails.adhocPenaltyComment = "";
        }
        if (payload.SewerageConnections[0].additionalDetails.adhocRebateComment === 'NA' || payload.SewerageConnections[0].additionalDetails.adhocRebateComment === null || payload.SewerageConnections[0].additionalDetails.adhocRebateComment === undefined) {
          payload.SewerageConnections[0].additionalDetails.adhocRebateComment = "";
        }
        if (payload.SewerageConnections[0].additionalDetails.adhocPenaltyReason === 'NA' || payload.SewerageConnections[0].additionalDetails.adhocPenaltyReason === null || payload.SewerageConnections[0].additionalDetails.adhocPenaltyReason === undefined) {
          payload.SewerageConnections[0].additionalDetails.adhocPenaltyReason = "";
        }
        if (payload.SewerageConnections[0].additionalDetails.adhocRebateReason === 'NA' || payload.SewerageConnections[0].additionalDetails.adhocRebateReason === null || payload.SewerageConnections[0].additionalDetails.adhocRebateReason === undefined) {
          payload.SewerageConnections[0].additionalDetails.adhocRebateReason = "";
        }
        dispatch(
          handleField(
            "viewBill",
            "components.div.children.viewBill.children.cardContent.children.serviceDetails.children.cardContent.children.sewerDetails",
            "visible",
            true
          )
        );
        dispatch(
          handleField(
            "viewBill",
            "components.div.children.viewBill.children.cardContent.children.serviceDetails.children.cardContent.children.waterDetails",
            "visible",
            false
          )
        );
        dispatch(
          handleField(
            "viewBill",
            "components.div.children.viewBill.children.cardContent.children.serviceDetails.children.cardContent.children.waterMeterDetails",
            "visible",
            false
          )
        );
        dispatch(prepareFinalObject("WaterConnection[0]", payload.SewerageConnections[0]));
        dispatch(prepareFinalObject("billData", data.Bill[0]));
      }
    }
  }
  createEstimateData(data, "screenConfiguration.preparedFinalObject.billData.billDetails", dispatch, {}, {});
};

const validatePropertyTaxName = (mdmsPropertyUsageType) => {
  if (
    mdmsPropertyUsageType !== undefined &&
    mdmsPropertyUsageType !== null &&
    mdmsPropertyUsageType.MdmsRes !== undefined &&
    mdmsPropertyUsageType.MdmsRes !== null &&
    mdmsPropertyUsageType.MdmsRes.PropertyTax !== undefined &&
    mdmsPropertyUsageType.MdmsRes.PropertyTax !== null &&
    mdmsPropertyUsageType.MdmsRes.PropertyTax.UsageCategoryMajor !== undefined &&
    mdmsPropertyUsageType.MdmsRes.PropertyTax.UsageCategoryMajor !== null &&
    mdmsPropertyUsageType.MdmsRes.PropertyTax.UsageCategoryMajor.length > 0
  ) { return mdmsPropertyUsageType.MdmsRes.PropertyTax.UsageCategoryMajor[0].name }
  else { return "NA" }
}

const beforeInitFn = async (action, state, dispatch, consumerCode) => {
  if (consumerCode) {
    await fetchMDMSForBillPeriod(action, state, dispatch);
    await searchResults(action, state, dispatch, consumerCode);
  }
};

const billHeader = () => {
  const service = getQueryArg(window.location.href, "service");
  if (service === "WATER") {
    return getCommonHeader({ labelKey: "WS_COMMON_WATER_BILL_HEADER" })
  } else {
    return getCommonHeader({ labelKey: "WS_COMMON_SEWERAGE_BILL_HEADER" })
  }
}

let headerrow = getCommonContainer({
  header: billHeader(),
  consumerCode: {
    uiFramework: "custom-atoms-local",
    moduleName: "egov-wns",
    componentPath: "ConsumerNoContainer",
    props: { number: consumerCode }
  }
});

const estimate = getCommonGrayCard({
  header: getCommonSubHeader({ labelKey: "UC_VIEWBILL_DETAILS_HEADER" }),
  estimateSection: getFeesEstimateCard({ sourceJsonPath: "viewBillToolipData" })
});

const propertyDetails = getProperty();
const ownerDetails = getOwner();
const serviceDetails = getService();

export const viewBill = getCommonCard(
  {
    estimate,
    serviceDetails,
    propertyDetails,
    ownerDetails
  });

const screenConfig = {
  uiFramework: "material-ui",
  name: "viewBill",
  beforeInitScreen: (action, state, dispatch) => {
    consumerCode = getQueryArg(window.location.href, "connectionNumber");
    dispatch(prepareFinalObject("WaterConnection[0]", {}));
    dispatch(prepareFinalObject("billData", {}));
    dispatch(prepareFinalObject("billingPeriodMDMS", {}));
    dispatch(prepareFinalObject("consumptionDetails", []));
    dispatch(prepareFinalObject("searchScreen", {}));
    dispatch(prepareFinalObject("searchScreenMdmsData", {}));
    dispatch(prepareFinalObject("viewBillToolipData", []));
    dispatch(prepareFinalObject("UpdateBillCriteria", {}));

    // To set the application no. at the  top
    set(
      action.screenConfig,
      "components.div.children.headerDiv.children.header1.children.consumerCode.props.number",
      consumerCode
    );

    const service = getQueryArg(window.location.href, "service");
    if (service == "SEWERAGE") {
      set(
        action.screenConfig,
        "components.div.children.headerDiv.children.header1.children.header.children.key.props.labelKey",
        "WS_COMMON_SEWERAGE_BILL_HEADER"
      );
    } else {
      set(
        action.screenConfig,
        "components.div.children.headerDiv.children.header1.children.header.children.key.props.labelKey",
        "WS_COMMON_WATER_BILL_HEADER"
      );
    }
    
    
    // set(action,"screenConfig.components.adhocDialog.children.popup",adhocPopupViewBill);
    beforeInitFn(action, state, dispatch, consumerCode);
    return action;
  },

  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      props: { className: "common-div-css search-preview" },
      children: {
        headerDiv: {
          uiFramework: "custom-atoms",
          componentPath: "Container",
          children: { header1: { gridDefination: { xs: 12, sm: 8 }, ...headerrow } }
        },
        viewBill,
        viewBillFooter
      }
    },
  }
};

export default screenConfig;