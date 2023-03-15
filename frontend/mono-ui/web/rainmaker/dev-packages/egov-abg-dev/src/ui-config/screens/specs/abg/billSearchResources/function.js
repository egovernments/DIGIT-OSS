import { handleScreenConfigurationFieldChange as handleField, prepareFinalObject, toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import get from "lodash/get";
import { getGroupBillSearch } from "../../../../../ui-utils/commons";
import { validateFields } from "../../utils";
import { convertEpochToDate } from "../../utils/index";


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
        searchScreenObject.hasOwnProperty(key) && searchScreenObject[key] &&
        searchScreenObject[key].trim() !== ""
      ) {
        queryObject.push({ key: key, value: searchScreenObject[key].trim() });
      }
      if (searchScreenObject.hasOwnProperty(key) &&
        searchScreenObject[key] =="") {
          delete searchScreenObject[key];
      }
    }
    let serviceObject = get(
      state.screenConfiguration.preparedFinalObject,
      "searchScreenMdmsData.BillingService.BusinessService"
    ).filter(item => item.code === searchScreenObject.businesService);

    searchScreenObject.url = serviceObject && serviceObject[0] && serviceObject[0].billGineiURL;
    const isAdvancePayment = serviceObject && serviceObject[0] && serviceObject[0].isAdvanceAllowed;
    if (!searchScreenObject.url) {
      dispatch(
        toggleSnackbar(
          true,
          {
            labelName: "Selected Service Category is Not Available for Search",
            labelKey: "ABG_SEARCH_BILLGINEIURL_NOTFOUND"
          },
          "error"
        )
      );
      return;
    }
    searchScreenObject.tenantId = process.env.REACT_APP_NAME === "Citizen" ? tenantId : getTenantId();
    const responseFromAPI = await getGroupBillSearch(dispatch, searchScreenObject)
    const bills = (responseFromAPI && responseFromAPI.Bills) || [];
    const billTableData = bills.map(item => {
      return {
        billNumber: get(item, "billNumber"),
        billId: get(item, "id"),
        consumerCode: get(item, "consumerCode"),
        consumerName: get(item, "payerName"),
        billDate: get(item, "billDate"),
        billAmount: get(item, "totalAmount"),
        status: get(item, "status"),
        action: getActionItem(get(item, "status")),
        tenantId: get(item, "tenantId")
      };
    });
    dispatch(
      prepareFinalObject("searchScreenMdmsData.billSearchResponse", bills)
    );
    const uiConfigs = get(state.screenConfiguration.preparedFinalObject, "searchScreenMdmsData.common-masters.uiCommonPay");
    const configObject = uiConfigs.filter(item => item.code === searchScreenObject.businesService);
    
    try {
      let data = billTableData.map(item => ({
        ['ABG_COMMON_TABLE_COL_BILL_NO']: item.billNumber || "-",
        ["PAYMENT_COMMON_CONSUMER_CODE"]: item.consumerCode || "-",
        ['ABG_COMMON_TABLE_COL_CONSUMER_NAME']: item.consumerName || "-",
        ['ABG_COMMON_TABLE_COL_BILL_DATE']:
          convertEpochToDate(item.billDate) || "-",
        ['ABG_COMMON_TABLE_COL_BILL_AMOUNT']: (item.billAmount || item.billAmount===0) ? item.billAmount : "-",
        ['ABG_COMMON_TABLE_COL_STATUS']: item.status || "-",
        ['ABG_COMMON_TABLE_COL_ACTION']: item.action || "-",
        ["BUSINESS_SERVICE"]: searchScreenObject.businesService,
        ["RECEIPT_KEY"]: get(configObject[0], "receiptKey","consolidatedreceipt")||"consolidatedreceipt",
        ["BILL_KEY"]: get(configObject[0], "billKey","consolidatedbill")||"consolidatedbill",
        ["TENANT_ID"]: item.tenantId,
        ["BILL_ID"]: item.billId,
        ["BILL_SEARCH_URL"]: searchScreenObject.url,
        ["ADVANCE_PAYMENT"]: isAdvancePayment
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
          "billSearch",
          "components.div.children.searchResults",
          "props.rows",
          billTableData.length
        )
      );

      showHideTable(true, dispatch);
    } catch (error) {
      dispatch(toggleSnackbar(true, error.message, "error"));
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
  switch (status) {
    case "ACTIVE": return "ABG_PAY";
    case "CANCELLED":
    case "EXPIRED": return "ABG_GENERATE_NEW_BILL"
    case "PAID": return "ABG_DOWNLOAD_RECEIPT"
    case "PARTIALLY_PAID": return "ABG_PARTIALLY_PAID"
  }
}
