import { handleScreenConfigurationFieldChange as handleField, prepareFinalObject, toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import get from "lodash/get";
// import { getGroupsearch } from "../../../../../ui-utils/commons";
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
    "components.div.children.searchCard.children.cardContent.children.searchContainer.children",
    state,
    dispatch,
    "search"
  );
  const isSearchBoxSecondRowValid = validateFields(
    "components.div.children.searchCard.children.cardContent.children.searchContainer.children",
    state,
    dispatch,
    "search"
  );
  if (!isSearchBoxFirstRowValid || !isSearchBoxSecondRowValid) {
    dispatch(
      toggleSnackbar(
        true,
        {
          labelName: "Please fill at least one field to start search",
          labelKey: "BILL_SEARCH_SELECT_AT_LEAST_ONE_TOAST_MESSAGE"
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
          labelKey: "BILL_SEARCH_SELECT_AT_LEAST_ONE_TOAST_MESSAGE"
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
            labelKey: "BILL_SEARCH_BILLGINEIURL_NOTFOUND"
          },
          "error"
        )
      );
      return;
    }
    searchScreenObject.tenantId = process.env.REACT_APP_NAME === "Citizen" ? tenantId : getTenantId();
    // const responseFromAPI = await getGroupsearch(dispatch, searchScreenObject)
    const responseFromAPI={};
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
      prepareFinalObject("searchScreenMdmsData.searchResponse", bills)
    );
    const uiConfigs = get(state.screenConfiguration.preparedFinalObject, "searchScreenMdmsData.common-masters.uiCommonPay");
    const configObject = uiConfigs.filter(item => item.code === searchScreenObject.businesService);
    
    try {
      let data = billTableData.map(item => ({
        ['BILL_COMMON_SERVICE_TYPE']: item.billNumber || "-",
        ["BILL_COMMON_APPLICATION_NO"]: item.consumerCode || "-",
        ["PAYMENT_COMMON_CONSUMER_CODE"]: item.consumerCode || "-",
        
        ['BILL_COMMON_TABLE_COL_CONSUMER_NAME']: item.consumerName || "-",
        ['BILL_COMMON_TABLE_CONSUMER_ADDRESS']: item.consumerName || "-",
        ['BILL_COMMON_TABLE_COL_BILL_DATE']:
          convertEpochToDate(item.billDate) || "-",
        ['BILL_COMMON_TABLE_COL_BILL_AMOUNT']: (item.billAmount || item.billAmount===0) ? item.billAmount : "-",
        ['BILL_COMMON_TABLE_COL_STATUS']: item.status || "-",
        ['BILL_COMMON_TABLE_COL_ACTION']: item.action || "-",
        ["BUSINESS_SERVICE"]: searchScreenObject.businesService,
        ["RECEIPT_KEY"]: get(configObject[0], "receiptKey"),
        ["BILL_KEY"]: get(configObject[0], "billKey"),
        ["TENANT_ID"]: item.tenantId,
        ["BILL_ID"]: item.billId,
        ["BILL_SEARCH_URL"]: searchScreenObject.url,
        ["ADVANCE_PAYMENT"]: isAdvancePayment
      }));

      data=[{
        ['BILL_COMMON_SERVICE_TYPE']: 'WATER' || "-",
        ["BILL_COMMON_APPLICATION_NO"]: 'NA',
        ["PAYMENT_COMMON_CONSUMER_CODE"]: 'WS/107/2020-21/000041' || "-",
        
        ['BILL_COMMON_TABLE_COL_CONSUMER_NAME']: 'Anand' || "-",
        ['BILL_COMMON_TABLE_CONSUMER_ADDRESS']: 'Patiala Road - Area1, amritsar' || "-",
        ['BILL_COMMON_TABLE_COL_BILL_DATE']:
          "-",
        ['BILL_COMMON_TABLE_COL_BILL_AMOUNT']:  "-",
        ['BILL_COMMON_TABLE_COL_STATUS']: "APPROVED" || "-",
        ['BILL_COMMON_TABLE_COL_ACTION']: "-",
        ["BUSINESS_SERVICE"]: '',
        ["RECEIPT_KEY"]:'',
        ["BILL_KEY"]:'',
        ["TENANT_ID"]: '',
        ["BILL_ID"]:'',
        ["BILL_SEARCH_URL"]: '',
        ["ADVANCE_PAYMENT"]: false
      },{
        ['BILL_COMMON_SERVICE_TYPE']: 'WATER' || "-",
        ["BILL_COMMON_APPLICATION_NO"]: 'WS/107/2020-21/000037',
        ["PAYMENT_COMMON_CONSUMER_CODE"]: 'WS/107/2020-21/000037' || "-",
        
        ['BILL_COMMON_TABLE_COL_CONSUMER_NAME']: 'Karthikeyan' || "-",
        ['BILL_COMMON_TABLE_CONSUMER_ADDRESS']: 'Ajit Nagar - Area1, amritsar' || "-",
        ['BILL_COMMON_TABLE_COL_BILL_DATE']:
          "-",
        ['BILL_COMMON_TABLE_COL_BILL_AMOUNT']:  "-",
        ['BILL_COMMON_TABLE_COL_STATUS']: "APPROVED" || "-",
        ['BILL_COMMON_TABLE_COL_ACTION']: "-",
        ["BUSINESS_SERVICE"]: '',
        ["RECEIPT_KEY"]:'',
        ["BILL_KEY"]:'',
        ["TENANT_ID"]: '',
        ["BILL_ID"]:'',
        ["BILL_SEARCH_URL"]: '',
        ["ADVANCE_PAYMENT"]: false
      }]
      dispatch(
        handleField(
          "search",
          "components.div.children.searchResults",
          "props.data",
          data
        )
      );
      dispatch(
        handleField(
          "search",
          "components.div.children.searchResults",
          "props.tableData",
          billTableData
        )
      );
      dispatch(
        handleField(
          "search",
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
      "search",
      "components.div.children.searchResults",
      "visible",
      booleanHideOrShow
    )
  );
};

const getActionItem = (status) => {
  switch (status) {
    case "ACTIVE": return "PAY";
    case "CANCELLED":
    case "EXPIRED": return "GENERATE NEW BILL"
    case "PAID": return "DOWNLOAD RECEIPT"
    case "PARTIALLY_PAID": return "PARTIALLY PAID"
  }
}
