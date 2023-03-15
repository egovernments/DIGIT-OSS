import { handleScreenConfigurationFieldChange as handleField, toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getLocaleLabels, getTransformedLocale } from "egov-ui-framework/ui-utils/commons";
import { getTenantIdCommon } from "egov-ui-kit/utils/localStorageUtils";
import get from "lodash/get";
import { httpRequest } from "../../../../../ui-utils";
import { fetchBill, findAndReplace, getSearchResults, getSearchResultsForSewerage, getWorkFlowData, serviceConst } from "../../../../../ui-utils/commons";
import { validateFields } from "../../utils";
import { convertDateToEpoch, convertEpochToDate, resetFieldsForApplication, resetFieldsForConnection } from "../../utils/index";

export const searchApiCall = async (state, dispatch) => {
  showHideApplicationTable(false, dispatch);
  showHideConnectionTable(false, dispatch);
  let getCurrentTab = get(state.screenConfiguration.preparedFinalObject, "currentTab");
  let currentSearchTab = getCurrentTab === undefined ? "SEARCH_CONNECTION" : getCurrentTab;
  if (currentSearchTab === "SEARCH_CONNECTION") {
    resetFieldsForApplication(state, dispatch);
    await renderSearchConnectionTable(state, dispatch);
  } else {
    resetFieldsForConnection(state, dispatch);
    await renderSearchApplicationTable(state, dispatch);
  }
}

const renderSearchConnectionTable = async (state, dispatch) => {
  let queryObject = [];
  queryObject.push({ key: "searchType", value: "CONNECTION" });
  let searchScreenObject = get(state.screenConfiguration.preparedFinalObject, "searchConnection", {});
  Object.keys(searchScreenObject).forEach((key) => (searchScreenObject[key] == "") && delete searchScreenObject[key]);
  if (
    Object.values(searchScreenObject).length <= 1
  ) {
    dispatch(toggleSnackbar(true, { labelName: "Please provide the city and any one other field information to search for property.", labelKey: "ERR_PT_COMMON_FILL_MANDATORY_FIELDS" }, "warning"));
  } else if (
    (searchScreenObject["fromDate"] === undefined || searchScreenObject["fromDate"].length === 0) &&
    searchScreenObject["toDate"] !== undefined && searchScreenObject["toDate"].length !== 0) {
    dispatch(toggleSnackbar(true, { labelName: "Please fill From Date", labelKey: "ERR_FILL_FROM_DATE" }, "warning"));
  } else {
    for (var key in searchScreenObject) {
      if (searchScreenObject.hasOwnProperty(key) && searchScreenObject[key].trim() !== "") {
        if (key === "fromDate") {
          queryObject.push({ key: key, value: convertDateToEpoch(searchScreenObject[key], "daystart") });
        } else if (key === "toDate") {
          queryObject.push({ key: key, value: convertDateToEpoch(searchScreenObject[key], "dayend") });
        } else {
          queryObject.push({ key: key, value: searchScreenObject[key].trim() });
        }
      }
    }
    try {
      let waterMeteredDemandExipryDate = 0;
      let waterNonMeteredDemandExipryDate = 0;
      let sewerageNonMeteredDemandExpiryDate = 0;
      let payloadbillingPeriod = "";
      try {
        // Get the MDMS data for billingPeriod
        let mdmsBody = {
          MdmsCriteria: {
            tenantId: getTenantIdCommon(),
            moduleDetails: [
              { moduleName: "ws-services-masters", masterDetails: [{ name: "billingPeriod" }] },
              { moduleName: "sw-services-calculation", masterDetails: [{ name: "billingPeriod" }] }
            ]
          }
        }
        //Read metered & non-metered demand expiry date and assign value.
        payloadbillingPeriod = await httpRequest("post", "/egov-mdms-service/v1/_search", "_search", [], mdmsBody);
      } catch (err) {  }
      let getSearchResult = getSearchResults(queryObject)
      let getSearchResultForSewerage = getSearchResultsForSewerage(queryObject, dispatch)
      let finalArray = [];
      let searchWaterConnectionResults, searcSewerageConnectionResults;
      try { searchWaterConnectionResults = await getSearchResult } catch (error) { finalArray = [];  }
      try { searcSewerageConnectionResults = await getSearchResultForSewerage } catch (error) { finalArray = [];  }
      const waterConnections = searchWaterConnectionResults ? searchWaterConnectionResults.WaterConnection.map(e => { e.service = serviceConst.WATER; return e }) : []
      const sewerageConnections = searcSewerageConnectionResults ? searcSewerageConnectionResults.SewerageConnections.map(e => { e.service = serviceConst.SEWERAGE; return e }) : [];
      let combinedSearchResults = searchWaterConnectionResults || searcSewerageConnectionResults ? sewerageConnections.concat(waterConnections) : []
      for (let i = 0; i < combinedSearchResults.length; i++) {
        let element = combinedSearchResults[i];
        if (element.connectionNo !== "NA" && element.connectionNo !== null) {
          let queryObjectForWaterFetchBill;
          if (element.service === serviceConst.WATER) {
            queryObjectForWaterFetchBill = [{ key: "tenantId", value: getTenantIdCommon() }, { key: "consumerCode", value: element.connectionNo }, { key: "businessService", value: "WS" }];
          } else {
            queryObjectForWaterFetchBill = [{ key: "tenantId", value: getTenantIdCommon() }, { key: "consumerCode", value: element.connectionNo }, { key: "businessService", value: "SW" }];
          }

          if (element.service === serviceConst.WATER &&
            payloadbillingPeriod &&
            payloadbillingPeriod.MdmsRes['ws-services-masters'] &&
            payloadbillingPeriod.MdmsRes['ws-services-masters'].billingPeriod !== undefined &&
            payloadbillingPeriod.MdmsRes['ws-services-masters'].billingPeriod !== null) {
            payloadbillingPeriod.MdmsRes['ws-services-masters'].billingPeriod.forEach(obj => {
              if (obj.connectionType === 'Metered') {
                waterMeteredDemandExipryDate = obj.demandExpiryDate;
              } else if (obj.connectionType === 'Non Metered') {
                waterNonMeteredDemandExipryDate = obj.demandExpiryDate;
              }
            });
          }
          if (element.service === serviceConst.SEWERAGE &&
            payloadbillingPeriod &&
            payloadbillingPeriod.MdmsRes['sw-services-calculation'] &&
            payloadbillingPeriod.MdmsRes['sw-services-calculation'].billingPeriod !== undefined &&
            payloadbillingPeriod.MdmsRes['sw-services-calculation'].billingPeriod !== null) {
            payloadbillingPeriod.MdmsRes['sw-services-calculation'].billingPeriod.forEach(obj => {
              if (obj.connectionType === 'Non Metered') {
                sewerageNonMeteredDemandExpiryDate = obj.demandExpiryDate;
              }
            });
          }

          // let billResults = await fetchBill(queryObjectForWaterFetchBill, dispatch)
          // billResults && billResults.Bill &&Array.isArray(billResults.Bill)&&billResults.Bill.length>0? billResults.Bill.map(bill => {
          //   let updatedDueDate = 0;
          //   if(element.service === serviceConst.WATER) {
          //     updatedDueDate = (element.connectionType === 'Metered' ?
          //     (bill.billDetails[0].toPeriod+waterMeteredDemandExipryDate) :
          //     (bill.billDetails[0].toPeriod+waterNonMeteredDemandExipryDate));
          //   } else if (element.service === serviceConst.SEWERAGE) {
          //     updatedDueDate = bill.billDetails[0].toPeriod + sewerageNonMeteredDemandExpiryDate;
          //   }
          //   finalArray.push({
          //     due: bill.totalAmount,
          //     dueDate: updatedDueDate,
          //     service: element.service,
          //     connectionNo: element.connectionNo,
          //     name: (element.property)?element.property.owners[0].name:'',
          //     status: element.status,
          //     address: handleAddress(element),
          //     connectionType: element.connectionType,
          //     tenantId:element.tenantId
          //   })
          // }) : finalArray.push({
          //   due: 'NA',
          //   dueDate: 'NA',
          //   service: element.service,
          //   connectionNo: element.connectionNo,
          //   name: (element.property)?element.property.owners[0].name:'',
          //   status: element.status,
          //   address: handleAddress(element),
          //   connectionType: element.connectionType,
          //   tenantId:element.tenantId
          // })
          let billResults = await fetchBill(queryObjectForWaterFetchBill, dispatch)
          let updatedDueDate = 0;
          billResults && billResults.Bill && Array.isArray(billResults.Bill) && billResults.Bill.length > 0 && billResults.Bill[0].billDetails.map(bill => {
            if (element.service === serviceConst.WATER) {
              updatedDueDate = bill.expiryDate;
            } else if (element.service === serviceConst.SEWERAGE) {
              updatedDueDate = bill.expiryDate;
            }
          });
          billResults && billResults.Bill && Array.isArray(billResults.Bill) && billResults.Bill.length > 0 ? finalArray.push({
            due: billResults.Bill[0].totalAmount,
            dueDate: updatedDueDate,
            service: element.service,
            connectionNo: element.connectionNo,
            name: (element.property) ? element.property.owners[0].name : '',
            status: element.status,
            address: handleAddress(element),
            connectionType: element.connectionType,
            tenantId: element.tenantId
          })
            : finalArray.push({
              due: '0',
              dueDate: 'NA',
              service: element.service,
              connectionNo: element.connectionNo,
              name: (element.property) ? element.property.owners[0].name : '',
              status: element.status,
              address: handleAddress(element),
              connectionType: element.connectionType,
              tenantId: element.tenantId
            })
        }

      }
      showConnectionResults(finalArray, dispatch)
    } catch (err) { }
  }
}

const renderSearchApplicationTable = async (state, dispatch) => {
  let queryObject = [{ key: "tenantId", value: getTenantIdCommon() }];
  queryObject.push({ key: "isConnectionSearch", value: true });
  let searchScreenObject = get(state.screenConfiguration.preparedFinalObject, "searchScreen", {});
  const isSearchBoxFirstRowValid = validateFields(
    "components.div.children.showSearches.children.showSearchScreens.props.tabs[1].tabContent.searchApplications.children.cardContent.children.wnsApplicationSearch",
    state,
    dispatch,
    "search"
  );

  const isSearchBoxSecondRowValid = validateFields(
    "components.div.children.showSearches.children.showSearchScreens.props.tabs[1].tabContent.searchApplications.children.cardContent.children.wnsApplicationSearch",
    state,
    dispatch,
    "search"
  );
  if (!(isSearchBoxFirstRowValid && isSearchBoxSecondRowValid)) {
    dispatch(toggleSnackbar(true, { labelKey: "ERR_WS_FILL_ATLEAST_ONE_FIELD" }, "warning"));
  } else if (
    Object.keys(searchScreenObject).length == 0 ||
    Object.values(searchScreenObject).every(x => x === "")
  ) {
    dispatch(toggleSnackbar(true, { labelKey: "ERR_WS_FILL_ATLEAST_ONE_FIELD" }, "warning"));
  } else if (
    (searchScreenObject["fromDate"] === undefined || searchScreenObject["fromDate"].length === 0) &&
    searchScreenObject["toDate"] !== undefined && searchScreenObject["toDate"].length !== 0) {
    dispatch(toggleSnackbar(true, { labelName: "Please fill From Date", labelKey: "ERR_FILL_FROM_DATE" }, "warning"));
  } else {
    for (var key in searchScreenObject) {
      if (searchScreenObject.hasOwnProperty(key) && searchScreenObject[key].trim() !== "") {
        if (key === "fromDate") {
          queryObject.push({ key: key, value: convertDateToEpoch(searchScreenObject[key], "daystart") });
        } else if (key === "toDate") {
          queryObject.push({ key: key, value: convertDateToEpoch(searchScreenObject[key], "dayend") });
        } else if (key === "applicationType") {
          queryObject.push({ key: key, value: searchScreenObject[key].replace(/ /g, '_') });
        } else {
          queryObject.push({ key: key, value: searchScreenObject[key].trim() });
        }
      }
    }
    try {
      let getSearchResult, getSearchResultForSewerage;
      if (searchScreenObject.applicationType && searchScreenObject.applicationType.toLowerCase().includes('water')) {
        getSearchResult = getSearchResults(queryObject)
      } else if (searchScreenObject.applicationType && searchScreenObject.applicationType.toLowerCase().includes('sewerage')) {
        getSearchResultForSewerage = getSearchResultsForSewerage(queryObject, dispatch)
      } else {
        getSearchResult = getSearchResults(queryObject),
          getSearchResultForSewerage = getSearchResultsForSewerage(queryObject, dispatch)
      }
      let finalArray = [];
      let searchWaterConnectionResults, searcSewerageConnectionResults;
      try { searchWaterConnectionResults = await getSearchResult } catch (error) { finalArray = [];  }
      try { searcSewerageConnectionResults = await getSearchResultForSewerage } catch (error) { finalArray = [];  }
      const waterConnections = searchWaterConnectionResults ? searchWaterConnectionResults.WaterConnection.map(e => { e.service = serviceConst.WATER; return e }) : []
      const sewerageConnections = searcSewerageConnectionResults ? searcSewerageConnectionResults.SewerageConnections.map(e => { e.service = serviceConst.SEWERAGE; return e }) : [];
      let combinedSearchResults = searchWaterConnectionResults || searcSewerageConnectionResults ? sewerageConnections.concat(waterConnections) : []

      let appNo = "";
      let combinedWFSearchResults = [];
      for (let i = 0; i < combinedSearchResults.length; i++) {
        let element = findAndReplace(combinedSearchResults[i], null, "NA");
        if (element.applicationNo !== "NA" && element.applicationNo !== undefined) {
          appNo = appNo + element.applicationNo + ",";
        }
        if (i % 50 === 0 || i === (combinedSearchResults.length - 1)) {
          //We are trying to fetch 50 WF objects at a time
          appNo = appNo.substring(0, appNo.length - 1);
          const queryObj = [
            { key: "businessIds", value: appNo },
            { key: "history", value: true },
            { key: "tenantId", value: getTenantIdCommon() }
          ];
          let wfResponse = await getWorkFlowData(queryObj);
          if (wfResponse !== null && wfResponse.ProcessInstances !== null) {
            combinedWFSearchResults = combinedWFSearchResults.concat(wfResponse.ProcessInstances);
          }
          appNo = "";
        }
      }
      /*const queryObj = [
        { key: "businessIds", value: appNo },
        { key: "history", value: true },
        { key: "tenantId", value: getTenantIdCommon() }
      ];
      let Response = await getWorkFlowData(queryObj);*/
      for (let i = 0; i < combinedSearchResults.length; i++) {
        let element = findAndReplace(combinedSearchResults[i], null, "NA");
        let appStatus;
        if (element.applicationNo !== "NA" && element.applicationNo !== undefined) {
          appStatus = combinedWFSearchResults.filter(item => item.businessId.includes(element.applicationNo))[0]
          if (appStatus !== undefined && appStatus.state !== undefined) {
            appStatus = appStatus.state.applicationStatus;
          } else {
            appStatus = "NA";
          }
          if (element.property && element.property.owners &&
            element.property.owners !== "NA" &&
            element.property.owners !== null &&
            element.property.owners.length > 1) {
            let ownerName = "";
            element.property.owners.forEach(ele => { ownerName = ownerName + ", " + ele.name })

            finalArray.push({
              connectionNo: element.connectionNo,
              applicationNo: element.applicationNo,
              applicationType: element.applicationType,
              name: ownerName.slice(2),
              applicationStatus: appStatus,
              address: handleAddress(element),
              service: element.service,
              connectionType: element.connectionType,
              tenantId: element.tenantId
            })
          } else {
            finalArray.push({
              connectionNo: element.connectionNo,
              applicationNo: element.applicationNo,
              applicationType: element.applicationType,
              name: (element.property && element.property !== "NA" && element.property.owners) ? element.property.owners[0].name : "",
              applicationStatus: appStatus,
              address: handleAddress(element),
              service: element.service,
              connectionType: element.connectionType,
              tenantId: element.tenantId
            })
          }
        }
      }
      showApplicationResults(finalArray, dispatch)
    } catch (err) { }
  }
}




export const handleAddress = (element) => {
  let city = (
    element.property &&
    element.property !== "NA" &&
    element.property.address !== undefined &&
    element.property.address.tenantId !== undefined &&
    element.property.address.tenantId !== null
  ) ? getLocaleLabels("NA", `TENANT_TENANTS_${getTransformedLocale(element.property.address.tenantId)}`) : "";
  let localityName = (
    element.property &&
    element.property !== "NA" &&
    element.property.address.locality !== undefined &&
    element.property.address.locality !== null &&
    element.property.address.locality.code !== null
  ) ? getLocaleLabels("NA", `${getTransformedLocale(element.property.address.tenantId)}_REVENUE_${element.property.address.locality.code}`) : "";

  return (city === "" && localityName === "") ? getLocaleLabels("NA", "WS_NA") : `${localityName}, ${city}`;
}

const showHideConnectionTable = (booleanHideOrShow, dispatch) => {
  dispatch(handleField("search", "components.div.children.searchResults", "visible", booleanHideOrShow));
};

const showHideApplicationTable = (booleanHideOrShow, dispatch) => {
  dispatch(handleField("search", "components.div.children.searchApplicationResults", "visible", booleanHideOrShow));
};

const showConnectionResults = (connections, dispatch) => {
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
  }));
  dispatch(handleField("search", "components.div.children.searchResults", "props.data", data));
  dispatch(handleField("search", "components.div.children.searchResults", "props.rows",
    connections.length
  ));
  showHideConnectionTable(true, dispatch);
}

const getApplicationType = (applicationType) => {
  return (applicationType) ? applicationType.split("_").join(" ") : applicationType;
}
const showApplicationResults = (connections, dispatch) => {
  let data = connections.map(item => ({
    ["WS_COMMON_TABLE_COL_CONSUMER_NO_LABEL"]: item.connectionNo,
    ["WS_COMMON_TABLE_COL_APP_NO_LABEL"]: item.applicationNo,
    ["WS_COMMON_TABLE_COL_APP_TYPE_LABEL"]: getApplicationType(item.applicationType),
    ["WS_COMMON_TABLE_COL_OWN_NAME_LABEL"]: item.name,
    ["WS_COMMON_TABLE_COL_APPLICATION_STATUS_LABEL"]: item.applicationStatus.split("_").join(" "),
    ["WS_COMMON_TABLE_COL_ADDRESS"]: item.address,
    ["WS_COMMON_TABLE_COL_TENANTID_LABEL"]: item.tenantId,
    ["WS_COMMON_TABLE_COL_SERVICE_LABEL"]: item.service,
    ["WS_COMMON_TABLE_COL_CONNECTIONTYPE_LABEL"]: item.connectionType,
  }));
  dispatch(handleField("search", "components.div.children.searchApplicationResults", "props.data", data));
  dispatch(handleField("search", "components.div.children.searchApplicationResults", "props.rows",
    connections.length
  ));
  showHideApplicationTable(true, dispatch);
}

