import get from "lodash/get";
import { handleScreenConfigurationFieldChange as handleField, prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getSearchResults, fetchBill, getSearchResultsForSewerage, serviceConst } from "../../../../../ui-utils/commons";
import { convertEpochToDate, getTextToLocalMapping } from "../../utils/index";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { validateFields } from "../../utils";
import { httpRequest } from "../../../../../ui-utils";
import { handleAddress } from "../../wns/searchResource/functions";

export const searchApiCall = async (state, dispatch) => {
  showHideTable(false, dispatch);
  let queryObject = [
    { key: "offset", value: "0" }
  ];
  let searchScreenObject = get(
    state.screenConfiguration.preparedFinalObject,
    "searchScreen",
    {}
  );
  const isSearchBoxFirstRowValid = validateFields(
    "components.div.children.citizenApplication.children.cardContent.children.cityPropertyAndMobNumContainer.children",
    state,
    dispatch,
    "search"
  );

  const isSearchBoxSecondRowValid = validateFields(
    "components.div.children.citizenApplication.children.cardContent.children.cityPropertyAndMobNumContainer.children",
    state,
    dispatch,
    "search"
  );
  if (!(isSearchBoxFirstRowValid && isSearchBoxSecondRowValid)) {
    dispatch(toggleSnackbar(true, { labelKey: "ERR_WS_FILL_MANDATORY_FIELDS" }, "warning"));
  } else if (
    Object.keys(searchScreenObject).length == 0 ||
    Object.values(searchScreenObject).every(x => x === "")
  ) {
    dispatch(toggleSnackbar(true, { labelKey: "ERR_WS_FILL_MANDATORY_FIELDS" }, "warning"));
  } else if (
    (searchScreenObject["propertyId"] === undefined || searchScreenObject["propertyId"] === "") &&
    (searchScreenObject["mobileNumber"] === undefined || searchScreenObject["mobileNumber"] === "") &&
    (searchScreenObject["connectionNumber"] === undefined || searchScreenObject["connectionNumber"] === "") &&
    (searchScreenObject["oldConnectionNumber"] === undefined || searchScreenObject["oldConnectionNumber"] === "")
  ) {
    dispatch(toggleSnackbar(true, { labelKey: "ERR_WS_FILL_VALID_FIELDS" }, "warning"));
  } else {
    for (var key in searchScreenObject) {
      if (
        searchScreenObject.hasOwnProperty(key) &&
        searchScreenObject[key].trim() !== ""
      ) {
        queryObject.push({ key: key, value: searchScreenObject[key].trim() });
      }
    }
    let tenantId = get(state, "screenConfiguration.preparedFinalObject.searchScreen.tenantId");
    let waterMeteredDemandExipryDate = 0;
    let waterNonMeteredDemandExipryDate = 0;
    let sewerageNonMeteredDemandExpiryDate = 0;
    let payloadbillingPeriod
    try {
      try {
        // Get the MDMS data for billingPeriod
        let mdmsBody = {
          MdmsCriteria: {
            tenantId: tenantId,
            moduleDetails: [
              { moduleName: "ws-services-masters", masterDetails: [{ name: "billingPeriod" }]},
              { moduleName: "sw-services-calculation", masterDetails: [{ name: "billingPeriod" }]}
            ]
          }
        }
        //Read metered & non-metered demand expiry date and assign value.
        payloadbillingPeriod = await httpRequest("post", "/egov-mdms-service/v1/_search", "_search", [], mdmsBody);
        
      } catch (err) {  }
      if(queryObject.length > 0) queryObject.push({key: "searchType", value: "CONNECTION" })
      let getSearchResult = getSearchResults(queryObject)
      let getSearchResultForSewerage = getSearchResultsForSewerage(queryObject, dispatch)
      let finalArray = [];
      let searchWaterConnectionResults, searcSewerageConnectionResults;
      try { searchWaterConnectionResults = await getSearchResult } catch (error) { finalArray = []; }
      try { searcSewerageConnectionResults = await getSearchResultForSewerage } catch (error) { finalArray = [];  }
      const waterConnections = searchWaterConnectionResults ? searchWaterConnectionResults.WaterConnection.map(e => { e.service = serviceConst.WATER; return e }) : []
      const sewerageConnections = searcSewerageConnectionResults ? searcSewerageConnectionResults.SewerageConnections.map(e => { e.service = serviceConst.SEWERAGE; return e }) : [];
      let combinedSearchResults = searchWaterConnectionResults || searcSewerageConnectionResults ? sewerageConnections.concat(waterConnections) : []
      for (let i = 0; i < combinedSearchResults.length; i++) {
        let element = combinedSearchResults[i];
        if(element.property && element.property !== "NA" && element.connectionNo !== null && element.connectionNo!=='NA') {
	  let queryObjectForWaterFetchBill;
          if (element.service === serviceConst.WATER) {
            queryObjectForWaterFetchBill = [{ key: "tenantId", value: tenantId }, { key: "consumerCode", value: element.connectionNo }, { key: "businessService", value: "WS" }];
          } else {
            queryObjectForWaterFetchBill = [{ key: "tenantId", value: tenantId }, { key: "consumerCode", value: element.connectionNo }, { key: "businessService", value: "SW" }];
          }

          if (element.service === serviceConst.WATER && payloadbillingPeriod.MdmsRes['ws-services-masters'] && payloadbillingPeriod.MdmsRes['ws-services-masters'].billingPeriod !== undefined && payloadbillingPeriod.MdmsRes['ws-services-masters'].billingPeriod  !== null) {
            payloadbillingPeriod.MdmsRes['ws-services-masters'].billingPeriod.forEach(obj => {
              if(obj.connectionType === 'Metered') {
                waterMeteredDemandExipryDate = obj.demandExpiryDate;
              } else if (obj.connectionType === 'Non Metered') {
                waterNonMeteredDemandExipryDate = obj.demandExpiryDate;
              }
            }); 
          }
          if (element.service === serviceConst.SEWERAGE && payloadbillingPeriod.MdmsRes['sw-services-calculation'] && payloadbillingPeriod.MdmsRes['sw-services-calculation'].billingPeriod !== undefined && payloadbillingPeriod.MdmsRes['sw-services-calculation'].billingPeriod  !== null) {
            payloadbillingPeriod.MdmsRes['sw-services-calculation'].billingPeriod.forEach(obj => {
              if (obj.connectionType === 'Non Metered') {
                sewerageNonMeteredDemandExpiryDate = obj.demandExpiryDate;
              }
            }); 
          }

          let billResults = await fetchBill(queryObjectForWaterFetchBill, dispatch)
          billResults && billResults.Bill &&Array.isArray(billResults.Bill)&&billResults.Bill.length>0 ? billResults.Bill.map(bill => {
            let updatedDueDate = 0;
            if(element.service === serviceConst.WATER) {
              updatedDueDate = (element.connectionType === 'Metered' ?
              (bill.billDetails[0].toPeriod+waterMeteredDemandExipryDate) :
              (bill.billDetails[0].toPeriod+waterNonMeteredDemandExipryDate));
            } else if (element.service === serviceConst.SEWERAGE) {
              updatedDueDate = bill.billDetails[0].toPeriod + sewerageNonMeteredDemandExpiryDate;
            }
            let obj = {
              due: bill.totalAmount,
              dueDate: updatedDueDate,
              service: element.service,
              connectionNo: element.connectionNo,
              name: (element.property && element.property !== "NA" && element.property.owners)?element.property.owners[0].name:'',
              status: element.status,
              address: handleAddress(element),
              tenantId: element.tenantId,
              connectionType: element.connectionType
            }
            finalArray.push(obj)
          }) : finalArray.push({
            due: 'NA',
            dueDate: 'NA',
            service: element.service,
            connectionNo: element.connectionNo,
            name: (element.property && element.property !== "NA" && element.property.owners)?element.property.owners[0].name:'',
            status: element.status,
            address:handleAddress(element),
            tenantId: element.tenantId,
            connectionType: element.connectionType
          })
        }
      }
      showResults(finalArray, dispatch, tenantId)
    } catch (err) {  }
  }
}
const showHideTable = (booleanHideOrShow, dispatch) => {
  dispatch(
    handleField(
      "search",
      "components.div.children.searchResults",
      "visible",
      booleanHideOrShow
    )
  );
};

const showResults = (connections, dispatch, tenantId) => {
  let data = connections.map(item => ({
    ["WS_COMMON_TABLE_COL_SERVICE_LABEL"]: item.service,
    ["WS_COMMON_TABLE_COL_CONSUMER_NO_LABEL"]: item.connectionNo,
    ["WS_COMMON_TABLE_COL_OWN_NAME_LABEL"]: item.name,
    ["WS_COMMON_TABLE_COL_STATUS_LABEL"]: item.status,
    ["WS_COMMON_TABLE_COL_DUE_LABEL"]: item.due,
    ["WS_COMMON_TABLE_COL_ADDRESS"]: item.address,
    ["WS_COMMON_TABLE_COL_DUE_DATE_LABEL"]: (item.dueDate !== undefined && item.dueDate !== "NA") ? convertEpochToDate(item.dueDate) : item.dueDate,
    ["WS_COMMON_TABLE_COL_TENANTID_LABEL"]: item.tenantId,
    ["WS_COMMON_TABLE_COL_CONNECTIONTYPE_LABEL"]: item.connectionType
  }))

  dispatch(handleField("search", "components.div.children.searchResults", "props.data", data));
  dispatch(handleField("search", "components.div.children.searchResults", "props.rows", connections.length));
  showHideTable(true, dispatch);
}
