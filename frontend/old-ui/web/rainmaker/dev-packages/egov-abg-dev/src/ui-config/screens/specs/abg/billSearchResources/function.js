import get from "lodash/get";
import {
  handleScreenConfigurationFieldChange as handleField,
  prepareFinalObject
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getGroupBillSearch } from "../../../../../ui-utils/commons";
import { convertEpochToDate, getTextToLocalMapping } from "../../utils/index";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { validateFields } from "../../utils";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";


export const searchApiCall = async (state, dispatch) => {
  showHideTable(false, dispatch);
  let tenantId = get(
    state.screenConfiguration.preparedFinalObject,
    "searchScreen.tenantId"
  );
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
    let serviceObject = get(
      state.screenConfiguration.preparedFinalObject,
      "searchScreenMdmsData.BillingService.BusinessService"
    ).filter(item => item.code === searchScreenObject.businesService);

    searchScreenObject.url = serviceObject[0].billGineiURL;
    searchScreenObject.tenantId = process.env.REACT_APP_NAME === "Citizen" ? tenantId : getTenantId();
    const responseFromAPI = await getGroupBillSearch(dispatch,searchScreenObject)
    const bills = (responseFromAPI && responseFromAPI.Bills) || [];
    const billTableData = bills.map(item => {
      return {
        billNumber: get(item, "billNumber"),
        billId : get(item,"id"),
        consumerCode : get(item, "consumerCode"),
        consumerName: get(item, "payerName"),
        billDate: get(item, "billDate"),
        billAmount: get(item, "totalAmount"),
        status: get(item, "status"),
        action: getActionItem(get(item, "status")),
        tenantId : get(item, "tenantId")
      };
    });
    dispatch(
      prepareFinalObject("searchScreenMdmsData.billSearchResponse", bills)
    );
    const uiConfigs = get(state.screenConfiguration.preparedFinalObject , "searchScreenMdmsData.common-masters.uiCommonPay");
    const configObject = uiConfigs.filter(item => item.code === searchScreenObject.businesService);

    try {
      let data = billTableData.map(item => ({
        [getTextToLocalMapping("Bill No.")]: item.billNumber || "-",
        "Consumer Code" : item.consumerCode || "-",
        [getTextToLocalMapping("Consumer Name")]: item.consumerName || "-",
        [getTextToLocalMapping("Bill Date")]:
          convertEpochToDate(item.billDate) || "-",
        [getTextToLocalMapping("Bill Amount(Rs)")]: item.billAmount || "-",
        [getTextToLocalMapping("Status")]: item.status  || "-",
        [getTextToLocalMapping("Action")]: item.action || "-",
        businessService: searchScreenObject.businesService,
        receiptKey : get(configObject[0] , "receiptKey"),
        billKey : get(configObject[0] , "billKey"),
        tenantId: item.tenantId,
        "Bill Id": item.billId,
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
    case "PARTIALLY_PAID" : return "PARTIALLY PAID"
   }
}


