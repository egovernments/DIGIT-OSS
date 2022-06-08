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
          queryObjectForWaterFetchBill = [{ key: "tenantId", value: tenantId }, { key: "consumerCode", value: element.connectionNo }, { key: "businessService", value: "WS" }];
        } else {
          queryObjectForWaterFetchBill = [{ key: "tenantId", value: tenantId }, { key: "consumerCode", value: element.connectionNo }, { key: "businessService", value: "SW" }];
        }
        let billResults = await fetchBill(queryObjectForWaterFetchBill, dispatch)
        billResults ? billResults.Bill.map(bill => {
          let obj = {
            due: bill.totalAmount,
            dueDate: bill.billDetails[0].expiryDate,
            service: element.service,
            connectionNo: element.connectionNo,
            name: element.property.owners[0].name,
            status: element.status,
            address: element.property.address.street,
            tenantId: tenantId,
            connectionType: element.connectionType
          }
          finalArray.push(obj)
        }) : finalArray.push({
          due: 'NA',
          dueDate: 'NA',
          service: element.service,
          connectionNo: element.connectionNo,
          name: element.property.owners[0].name,
          status: element.status,
          address: element.property.address.street,
          tenantId: tenantId,
          connectionType: element.connectionType
        })
      }
      showResults(finalArray, dispatch, tenantId)
    } catch (err) { console.log(err) }
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
    [getTextToLocalMapping("Service")]: item.service,
    [getTextToLocalMapping("Consumer No")]: item.connectionNo,
    [getTextToLocalMapping("Owner Name")]: item.name,
    [getTextToLocalMapping("Status")]: item.status,
    [getTextToLocalMapping("Due")]: item.due,
    [getTextToLocalMapping("Address")]: item.address,
    [getTextToLocalMapping("Due Date")]: (item.dueDate !== undefined && item.dueDate !== "NA") ? convertEpochToDate(item.dueDate) : item.dueDate,
    ["tenantId"]: tenantId,
    ["connectionType"]: item.connectionType
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
