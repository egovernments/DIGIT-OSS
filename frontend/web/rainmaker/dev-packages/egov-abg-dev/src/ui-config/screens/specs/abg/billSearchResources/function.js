import get from "lodash/get";
import {
  handleScreenConfigurationFieldChange as handleField,
  prepareFinalObject
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getSearchResults,getGroupBillSearch } from "../../../../../ui-utils/commons";
import { convertEpochToDate, getTextToLocalMapping } from "../../utils/index";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { validateFields } from "../../utils";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";

const tenantId = getTenantId();

export const searchApiCall = async (state, dispatch) => {
  showHideTable(false, dispatch);
  let queryObject = [
    {
      key: "tenantId",
      value: tenantId
    },
    { key: "limit", value: "10" }
  ];
  let searchScreenObject = get(
    state.screenConfiguration.preparedFinalObject,
    "searchScreen",
    {}
  );

  const isSearchBoxFirstRowValid = validateFields(
    "components.div.children.billSearchCard.children.cardContent.children.searchContainer.children",
    state,
    dispatch,
    "billSearch"
  );
  const isSearchBoxSecondRowValid = validateFields(
    "components.div.children.billSearchCard.children.cardContent.children.searchContainer.children",
    state,
    dispatch,
    "billSearch"
  );
  if (!isSearchBoxFirstRowValid || !isSearchBoxSecondRowValid) {
    dispatch(
      toggleSnackbar(
        true,
        {
          labelName: "Please fill at least one field to start search",
          labelKey: "ABG_SEARCH_SELECT_AT_LEAST_ONE_TOAST_MESSAGE"
        },
        "warning"
      )
    );
  } else if (
    Object.keys(searchScreenObject).length == 0 ||
    Object.values(searchScreenObject).every(x => x === "")
  ) {
    dispatch(
      toggleSnackbar(
        true,
        {
          labelName: "Please fill at least one field to start search",
          labelKey: "ABG_SEARCH_SELECT_AT_LEAST_ONE_TOAST_MESSAGE"
        },
        "warning"
      )
    );
  } else {
    for (var key in searchScreenObject) {
      if (
        searchScreenObject.hasOwnProperty(key) &&
        searchScreenObject[key].trim() !== ""
      ) {
        queryObject.push({ key: key, value: searchScreenObject[key].trim() });
      }
    }
    searchScreenObject.tenantId = tenantId;
    // const responseFromAPI = await getSearchResults(dispatch,queryObject);
    const responseFromAPI = await getGroupBillSearch(dispatch,searchScreenObject)
    const bills = (responseFromAPI && responseFromAPI.Bills) || [];
    const billTableData = bills.map(item => {
      return {
        billNumber: get(item, "billNumber"),
        consumerCode : get(item, "consumerCode"),
        consumerName: get(item, "payerName"),
        billDate: get(item, "billDate"),
        billAmount: get(item, "totalAmount"),
        status: get(item, "status"),
        action: getActionItem(get(item, "status")),

      };
    });

    dispatch(
      prepareFinalObject("searchScreenMdmsData.billSearchResponse", bills)
    );
    try {
      let data = billTableData.map(item => ({
        [getTextToLocalMapping("Bill No.")]: item.billNumber || "-",
        "Consumer Code" : item.consumerCode || "-",
        [getTextToLocalMapping("Consumer Name")]: item.consumerName || "-",
        [getTextToLocalMapping("Bill Date")]:
          convertEpochToDate(item.billDate) || "-",
        [getTextToLocalMapping("Bill Amount(Rs)")]: item.billAmount || "-",
        [getTextToLocalMapping("Status")]: item.status && getTextToLocalMapping(item.status.toUpperCase())  || "-",
        [getTextToLocalMapping("Action")]: item.action || "-",
        tenantId: item.tenantId,
      }));
      dispatch(
        handleField(
          "billSearch",
          "components.div.children.searchResults",
          "props.data",
          data
        )
      );
      dispatch(
        handleField(
          "billSearch",
          "components.div.children.searchResults",
          "props.tableData",
          billTableData
        )
      );
      // dispatch(
      //   handleField(
      //     "billSearch",
      //     "components.div.children.searchResults",
      //     "props.title",
      //     "Search Results for Bill (" + data.length + ")"
      //   )
      // );
      dispatch(
        handleField(
          "search",
          "components.div.children.searchResults",
          "props.title",
          `${getTextToLocalMapping(
            "Search Results for Bill"
          )} (${data.length})`
        )
      );

      showHideTable(true, dispatch);
    } catch (error) {
      dispatch(toggleSnackbar(true, error.message, "error"));
      console.log(error);
    }
  }
};

const showHideTable = (booleanHideOrShow, dispatch) => {
  dispatch(
    handleField(
      "billSearch",
      "components.div.children.searchResults",
      "visible",
      booleanHideOrShow
    )
  );
};

const getActionItem = (status) => {
  switch(status){
    case "ACTIVE" : return "PAY";
    case "CANCELLED" : 
    case "EXPIRED":  return "GENERATE NEW BILL"
    case "PAID" : return "DOWNLOAD RECEIPT"
   }
}


