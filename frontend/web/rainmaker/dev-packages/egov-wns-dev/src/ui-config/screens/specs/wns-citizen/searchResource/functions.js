import get from "lodash/get";
import { handleScreenConfigurationFieldChange as handleField, prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getSearchResults, fetchBill, getSearchResultsForSewerage } from "../../../../../ui-utils/commons";
import { convertEpochToDate, getTextToLocalMapping } from "../../utils/index";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { validateFields } from "../../utils";

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
        let queryObjectForWaterFetchBill;
        if (element.service === "WATER") {
          queryObjectForWaterFetchBill = [{ key: "tenantId", value: tenantId }, { key: "consumerCode", value: element.connectionNo }, { key: "businessService", value: "WS" }];
        } else {
          queryObjectForWaterFetchBill = [{ key: "tenantId", value: tenantId }, { key: "consumerCode", value: element.connectionNo }, { key: "businessService", value: "SW" }];
        }
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
              address: element.property.address.street,
              tenantId: tenantId
            }
            finalArray.push(obj)
          }) : finalArray.push({
            due: ' ',
            dueDate: ' ',
            service: element.service,
            connectionNo: element.connectionNo,
            name: element.property.owners[0].name,
            status: element.status,
            address: element.property.address.street,
            tenantId: tenantId
          })
        } catch (e) { console.error(e) }
      }
      showResults(finalArray, dispatch, tenantId)
    } catch (e) { console.error(e) }
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
    [getTextToLocalMapping("Service")]: item.service || "-",
    [getTextToLocalMapping("Consumer No")]: item.connectionNo || "-",
    [getTextToLocalMapping("Owner Name")]: item.name !== undefined ? item.name : " " || " ",
    [getTextToLocalMapping("Status")]: item.status || "-",
    [getTextToLocalMapping("Due")]: (item.due !== undefined || item.due !== null) ? item.due : " " || " ",
    [getTextToLocalMapping("Address")]: item.address || "-",
    [getTextToLocalMapping("Due Date")]: (item.dueDate !== undefined && item.dueDate !== ' ') ? convertEpochToDate(item.dueDate) : " " || " ",
    ["tenantId"]: tenantId
  }))

  dispatch(handleField("search", "components.div.children.searchResults", "props.data", data));
  dispatch(
    handleField(
      "search",
      "components.div.children.searchResults",
      "props.title",
      `${getTextToLocalMapping(
        "Search Results for Water & Sewerage Connections"
      )} (${connections.length})`
    )
  );
  showHideTable(true, dispatch);
}