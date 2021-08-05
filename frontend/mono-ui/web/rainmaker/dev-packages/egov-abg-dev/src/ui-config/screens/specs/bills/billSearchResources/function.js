import { handleScreenConfigurationFieldChange as handleField, prepareFinalObject, toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import get from "lodash/get";
import { fetchBill, getGroupBillSearch } from "../../../../../ui-utils/commons";
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
        searchScreenObject[key] == "") {
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
    const responseFromAPI = await getGroupBillSearch(dispatch, searchScreenObject);
    let bills = (responseFromAPI && responseFromAPI.Bills) || [];
    bills = bills.filter(bill => bill.status === "ACTIVE");
    let expiredConsumers = []
    let billObject = {};
    bills.map(bill => {
      billObject[bill.consumerCode] = bill;
      if (bill.billDetails[0].expiryDate < new Date().getTime()) {
        expiredConsumers.push(bill.consumerCode);
      }
    })
    if (expiredConsumers.length > 0) {
      const fetchbillResponse = await fetchBill([{ key: "tenantId", value: tenantId }, { key: "consumerCode", value: expiredConsumers.join(',') }, { key: "businessService", value: searchScreenObject.businesService }], dispatch, false)
      fetchbillResponse.Bill.map(bill => {
        billObject[bill.consumerCode] = bill;
      })
    }
    bills = Object.values(billObject);
    const billTableData = [];
    for (let i = 0; i < bills.length; i++) {
      if (get(bills[i], "status") === "ACTIVE") {
        billTableData.push({
          billNumber: get(bills[i], "billNumber"),
          billId: get(bills[i], "id"),
          consumerCode: get(bills[i], "consumerCode"),
          consumerName: get(bills[i], "payerName"),
          billDate: get(bills[i], "billDetails[0].expiryDate"),
          billAmount: get(bills[i], "totalAmount"),
          status: get(bills[i], "status"),
          action: getActionItem(get(bills[i], "status")),
          tenantId: get(bills[i], "tenantId")
        })
      }
    }
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
        ['ABG_COMMON_TABLE_COL_BILL_EXP_DATE']:
          convertEpochToDate(item.billDate) || "-",
        ['ABG_COMMON_TABLE_COL_BILL_AMOUNT']: (item.billAmount || item.billAmount === 0) ? item.billAmount : "-",
        ['ABG_COMMON_TABLE_COL_STATUS']: item.status || "-",
        ['ABG_COMMON_TABLE_COL_ACTION']: item.action || "-",
        ["BUSINESS_SERVICE"]: searchScreenObject.businesService,
        ["RECEIPT_KEY"]: get(configObject[0], "receiptKey", "consolidatedreceipt") || "consolidatedreceipt",
        ["BILL_KEY"]: get(configObject[0], "billKey", "consolidatedbill") || "consolidatedbill",
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
  switch (status) {
    case "ACTIVE": return "ABG_CANCEL_BILL";
  }
}
