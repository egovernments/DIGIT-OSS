import get from "lodash/get";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getSearchResults, fetchBill, getSearchResultsForSewerage } from "../../../../../ui-utils/commons";
import { convertEpochToDate, getTextToLocalMapping } from "../../utils/index";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { validateFields } from "../../utils";
import { getUserInfo } from "egov-ui-kit/utils/localStorageUtils";

export const searchApiCall = async (state, dispatch) => {
  showHideApplicationTable(false, dispatch);
  showHideConnectionTable(false, dispatch);
  let getCurrentTab = get(state.screenConfiguration.preparedFinalObject, "currentTab");
  let currentSearchTab = getCurrentTab === undefined ? "SEARCH_CONNECTION" : getCurrentTab;
  if (currentSearchTab === "SEARCH_CONNECTION") {
    await renderSearchConnectionTable(state, dispatch);
  } else {
    await renderSearchApplicationTable(state, dispatch);
  }
}

const renderSearchConnectionTable = async (state, dispatch) => {
  let queryObject = [{ key: "tenantId", value: JSON.parse(getUserInfo()).tenantId }, { key: "offset", value: "0" }];
  let searchScreenObject = get(state.screenConfiguration.preparedFinalObject, "searchScreen", {});
  const isSearchBoxFirstRowValid = validateFields(
    "components.div.children.showSearches.children.showSearchScreens.props.tabs[0].tabContent.wnsApplication.children.cardContent.children.wnsApplicationContainer.children",
    state,
    dispatch,
    "search"
  );

  const isSearchBoxSecondRowValid = validateFields(
    "components.div.children.showSearches.children.showSearchScreens.props.tabs[0].tabContent.wnsApplication.children.cardContent.children.wnsApplicationContainer.children",
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
        } else {
          queryObject.push({ key: key, value: searchScreenObject[key].trim() });
        }
      }
    }
    try {
      let getSearchResult = getSearchResults(queryObject)
      let getSearchResultForSewerage = getSearchResultsForSewerage(queryObject, dispatch)
      let finalArray = [];
      let searchWaterConnectionResults, searcSewerageConnectionResults;
      try { searchWaterConnectionResults = await getSearchResult } catch (error) { finalArray = []; console.log(error) }
      try { searcSewerageConnectionResults = await getSearchResultForSewerage } catch (error) { finalArray = []; console.log(error) }
      const waterConnections = searchWaterConnectionResults ? searchWaterConnectionResults.WaterConnection.map(e => { e.service = 'WATER'; return e }) : []
      const sewerageConnections = searcSewerageConnectionResults ? searcSewerageConnectionResults.SewerageConnections.map(e => { e.service = 'SEWERAGE'; return e }) : [];
      let combinedSearchResults = searchWaterConnectionResults || searcSewerageConnectionResults ? sewerageConnections.concat(waterConnections) : []
      for (let i = 0; i < combinedSearchResults.length; i++) {
        let element = combinedSearchResults[i];
        let queryObjectForWaterFetchBill;
        if (element.service === "WATER") {
          queryObjectForWaterFetchBill = [{ key: "tenantId", value: JSON.parse(getUserInfo()).tenantId }, { key: "consumerCode", value: element.connectionNo }, { key: "businessService", value: "WS" }];
        } else {
          queryObjectForWaterFetchBill = [{ key: "tenantId", value: JSON.parse(getUserInfo()).tenantId }, { key: "consumerCode", value: element.connectionNo }, { key: "businessService", value: "SW" }];
        }
        let billResults = await fetchBill(queryObjectForWaterFetchBill, dispatch)
        billResults ? billResults.Bill.map(bill => {
          finalArray.push({
            due: bill.totalAmount,
            dueDate: bill.billDetails[0].expiryDate,
            service: element.service,
            connectionNo: element.connectionNo,
            name: element.property.owners[0].name,
            status: element.status,
            address: element.property.address.street,
            connectionType: element.connectionType
          })
        }) : finalArray.push({
          due: 'NA',
          dueDate: 'NA',
          service: element.service,
          connectionNo: element.connectionNo,
          name: element.property.owners[0].name,
          status: element.status,
          address: element.property.address.street,
          connectionType: element.connectionType
        })
      }
      showConnectionResults(finalArray, dispatch)
    } catch (err) { console.log(err) }
  }
}

const renderSearchApplicationTable = async (state, dispatch) => {
  let queryObject = [{ key: "tenantId", value: JSON.parse(getUserInfo()).tenantId }, { key: "offset", value: "0" }];
  let searchScreenObject = get(state.screenConfiguration.preparedFinalObject, "searchScreen", {});
  const isSearchBoxFirstRowValid = validateFields(
    "components.div.children.showSearches.children.showSearchScreens.props.tabs[0].tabContent.wnsApplication.children.cardContent.children.wnsApplicationContainer.children",
    state,
    dispatch,
    "search"
  );

  const isSearchBoxSecondRowValid = validateFields(
    "components.div.children.showSearches.children.showSearchScreens.props.tabs[0].tabContent.wnsApplication.children.cardContent.children.wnsApplicationContainer.children",
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
        } else {
          queryObject.push({ key: key, value: searchScreenObject[key].trim() });
        }
      }
    }
    try {
      let getSearchResult = getSearchResults(queryObject)
      let getSearchResultForSewerage = getSearchResultsForSewerage(queryObject, dispatch)
      let finalArray = [];
      let searchWaterConnectionResults, searcSewerageConnectionResults;
      try { searchWaterConnectionResults = await getSearchResult } catch (error) { finalArray = []; console.log(error) }
      try { searcSewerageConnectionResults = await getSearchResultForSewerage } catch (error) { finalArray = []; console.log(error) }
      const waterConnections = searchWaterConnectionResults ? searchWaterConnectionResults.WaterConnection.map(e => { e.service = 'WATER'; return e }) : []
      const sewerageConnections = searcSewerageConnectionResults ? searcSewerageConnectionResults.SewerageConnections.map(e => { e.service = 'SEWERAGE'; return e }) : [];
      let combinedSearchResults = searchWaterConnectionResults || searcSewerageConnectionResults ? sewerageConnections.concat(waterConnections) : []
      for (let i = 0; i < combinedSearchResults.length; i++) {
        let element = combinedSearchResults[i];
        finalArray.push({ service: element.service, connectionNo: element.connectionNo, name: element.property.owners[0].name, status: element.status, address: element.property.address.street, connectionType: element.connectionType })
      }
      showApplicationResults(finalArray, dispatch)
    } catch (err) { console.log(err) }
  }
}

const showHideConnectionTable = (booleanHideOrShow, dispatch) => {
  dispatch(handleField("search", "components.div.children.searchResults", "visible", booleanHideOrShow));
};

const showHideApplicationTable = (booleanHideOrShow, dispatch) => {
  dispatch(handleField("search", "components.div.children.searchApplicationResults", "visible", booleanHideOrShow));
};

const showConnectionResults = (connections, dispatch) => {
  let data = connections.map(item => ({
    [getTextToLocalMapping("Service")]: item.service,
    [getTextToLocalMapping("Consumer No")]: item.connectionNo,
    [getTextToLocalMapping("Owner Name")]: item.name,
    [getTextToLocalMapping("Status")]: item.status,
    [getTextToLocalMapping("Due")]: item.due,
    [getTextToLocalMapping("Address")]: item.address,
    [getTextToLocalMapping("Due Date")]: (item.dueDate !== undefined && item.dueDate !== "NA") ? convertEpochToDate(item.dueDate) : item.dueDate,
    ["tenantId"]: JSON.parse(getUserInfo()).tenantId,
    ["connectionType"]: item.connectionType
  }));
  dispatch(handleField("search", "components.div.children.searchResults", "props.data", data));
  dispatch(handleField("search", "components.div.children.searchResults", "props.title",
    `${getTextToLocalMapping("Search Results for Water & Sewerage Connections")} (${connections.length})`
  ));
  showHideConnectionTable(true, dispatch);
}

const showApplicationResults = (connections, dispatch) => {
  let data = connections.map(item => ({
    [getTextToLocalMapping("Service")]: item.service,
    [getTextToLocalMapping("Consumer No")]: item.connectionNo,
    [getTextToLocalMapping("Owner Name")]: item.name,
    [getTextToLocalMapping("Application Status")]: item.status,
    [getTextToLocalMapping("Address")]: item.address,
    ["tenantId"]: JSON.parse(getUserInfo()).tenantId,
    ["connectionType"]: item.connectionType
  }));
  dispatch(handleField("search", "components.div.children.searchApplicationResults", "props.data", data));
  dispatch(handleField("search", "components.div.children.searchApplicationResults", "props.title",
    `${getTextToLocalMapping("Search Results for Water & Sewerage Application")} (${connections.length})`
  ));
  showHideApplicationTable(true, dispatch);
}