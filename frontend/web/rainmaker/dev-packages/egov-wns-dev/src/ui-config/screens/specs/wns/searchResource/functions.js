import get from "lodash/get";
import { handleScreenConfigurationFieldChange as handleField, prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getSearchResults, fetchBill, getSearchResultsForSewerage } from "../../../../../ui-utils/commons";
import { convertEpochToDate, getTextToLocalMapping } from "../../utils/index";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { validateFields } from "../../utils";
import { getUserInfo } from "egov-ui-kit/utils/localStorageUtils";

export const searchApiCall = async (state, dispatch) => {
  showHideTable(false, dispatch);
  let queryObject = [{ key: "tenantId", value: JSON.parse(getUserInfo()).tenantId }, { key: "offset", value: "0" }];
  let searchScreenObject = get(state.screenConfiguration.preparedFinalObject, "searchScreen", {});
  const isSearchBoxFirstRowValid = validateFields(
    "components.div.children.tradeLicenseApplication.children.cardContent.children.appTradeAndMobNumContainer.children",
    state,
    dispatch,
    "search"
  );

  // const isSearchBoxSecondRowValid = validateFields(
  //   "components.div.children.tradeLicenseApplication.children.cardContent.children.appTradeAndMobNumContainer.children",
  //   state,
  //   dispatch,
  //   "search"
  // );

  if (!(isSearchBoxFirstRowValid)) {
    dispatch(toggleSnackbar(true, { labelKey: "ERR_WS_FILL_MANDATORY_FIELDS" }, "warning"));
  } else if (
    Object.keys(searchScreenObject).length == 0 ||
    Object.values(searchScreenObject).every(x => x === "")
  ) {
    dispatch(toggleSnackbar(true, { labelKey: "ERR_WS_FILL_ATLEAST_ONE_FIELD" }, "error"));
  } else {
    for (var key in searchScreenObject) {
      if (
        searchScreenObject.hasOwnProperty(key) &&
        searchScreenObject[key].trim() !== ""
      ) {
        // if (key === "fromDate") {
        //   queryObject.push({
        //     key: key,
        //     value: convertDateToEpoch(searchScreenObject[key], "daystart")
        //   });
        // } else if (key === "toDate") {
        //   queryObject.push({
        //     key: key,
        //     value: convertDateToEpoch(searchScreenObject[key], "dayend")
        //   });
        // } else {
        queryObject.push({ key: key, value: searchScreenObject[key].trim() });
      }
    }
    let getSearchResult = getSearchResults(queryObject)
    let getSearchResultForSewerage = getSearchResultsForSewerage(queryObject, dispatch)
    try {
      let searchWaterConnectionResults = await getSearchResult
      let searcSewerageConnectionResults = await getSearchResultForSewerage
      const waterConnections = searchWaterConnectionResults.WaterConnection.map(e => { e.service = 'WATER'; return e });
      const sewerageConnections = searcSewerageConnectionResults.SewerageConnections.map(e => { e.service = 'SEWERAGE'; return e });
      let combinedSearchResults = searchWaterConnectionResults && searcSewerageConnectionResults ? sewerageConnections.concat(waterConnections) : []
      let finalArray = [];
      for (let i = 0; i < combinedSearchResults.length; i++) {
        let element = combinedSearchResults[i];
        let queryObjectForWaterFetchBill = [{ key: "tenantId", value: JSON.parse(getUserInfo()).tenantId }, { key: "consumerCode", value: element.connectionNo }, { key: "businessService", value: "WS" }];
        let billResults = await fetchBill(queryObjectForWaterFetchBill, dispatch)
        try {
          billResults ? billResults.Bill.map(bill => {
            let obj = {
              due: bill.totalAmount,
              dueDate: bill.billDetails[0].expiryDate,
              service: element.service,
              connectionNo: element.connectionNo,
              name: element.property.owners[0].name,
              status: element.status,
              address: element.property.address.street
            }
            finalArray.push(obj)
          }) : finalArray.push({
            due: ' ',
            dueDate: ' ',
            service: element.service,
            connectionNo: element.connectionNo,
            name: element.property.owners[0].name,
            status: element.status,
            address: element.property.address.street
          })
        } catch (e) { console.error(e) }
      }
      showResults(finalArray, dispatch)
    } catch (e) { console.error(e) }
  }
}
const showHideTable = (booleanHideOrShow, dispatch) => {
  dispatch(handleField("search", "components.div.children.searchResults", "visible", booleanHideOrShow));
};

const showResults = (connections, dispatch) => {
  let data = connections.map(item => ({

    [getTextToLocalMapping("Service")]: item.service,
    [getTextToLocalMapping("Consumer No")]: item.connectionNo || " ",
    [getTextToLocalMapping("Owner Name")]: item.name !== undefined ? item.name : " " || " ",
    [getTextToLocalMapping("Status")]: item.status || " ",
    [getTextToLocalMapping("Due")]: (item.due !== undefined || item.due !== null) ? item.due : " " || " ",
    [getTextToLocalMapping("Address")]: item.address || " ",
    [getTextToLocalMapping("Due Date")]: (item.dueDate !== undefined && item.dueDate !== ' ') ? convertEpochToDate(item.dueDate) : " " || " ",
    ["tenantId"]: JSON.parse(getUserInfo()).tenantId
  }));

  dispatch(handleField("search", "components.div.children.searchResults", "props.data", data));
  dispatch(handleField("search", "components.div.children.searchResults", "props.title",
    `${getTextToLocalMapping(
      "Search Results for Water & Sewerage Connections"
    )} (${connections.length})`
  ));
  showHideTable(true, dispatch);
}
