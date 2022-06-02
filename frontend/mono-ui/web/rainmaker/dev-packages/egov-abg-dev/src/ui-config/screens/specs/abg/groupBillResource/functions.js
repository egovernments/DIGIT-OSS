import get from "lodash/get";
import { getGroupBillSearch } from "../../../../../ui-utils/commons";
import {
  handleScreenConfigurationFieldChange as handleField,
  prepareFinalObject
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {
  convertEpochToDate,
  validateFields,
  getTextToLocalMapping
} from "../../utils/index";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getTenantId,getUserInfo } from "egov-ui-kit/utils/localStorageUtils";
import isEmpty from "lodash/isEmpty"
import { loadUlbLogo } from "../../utils/receiptTransformer";
import { getMergeAndDownloadList } from "../../utils";
import cloneDeep from "lodash/cloneDeep";

// const tenantId = getTenantId();
const tenantId = getTenantId();
export const searchApiCall = async (state, dispatch) => {
  showHideTable(false, dispatch);
  showHideMergeButton(false, dispatch);
  let searchScreenObject = get(
    state.screenConfiguration.preparedFinalObject,
    "searchCriteria",
    {}
  );
  const isSearchBoxFirstRowValid = validateFields(
    "components.div.children.abgSearchCard.children.cardContent.children.searchContainer.children",
    state,
    dispatch,
    "groupBills"
  );

  const isSearchBoxSecondRowValid = validateFields(
    "components.div.children.abgSearchCard.children.cardContent.children.searchContainer.children",
    state,
    dispatch,
    "groupBills"
  );

  if (!(isSearchBoxFirstRowValid && isSearchBoxSecondRowValid)) {
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
        searchScreenObject[key] === ""
      ) {
        delete searchScreenObject[key];
      }
    }
    let serviceObject = get(
      state.screenConfiguration.preparedFinalObject,
      "searchScreenMdmsData.BillingService.BusinessService"
    ).filter(item => item.code === searchScreenObject.businesService);

    searchScreenObject.url = serviceObject&&serviceObject[0]&&serviceObject[0].billGineiURL;
    searchScreenObject.tenantId = process.env.REACT_APP_NAME === "Employee" ?  getTenantId() : JSON.parse(getUserInfo()).permanentCity;
    searchScreenObject.billActive = "ACTIVE";
    const responseFromAPI = await getGroupBillSearch(dispatch,searchScreenObject);
    const businessUrl = cloneDeep(searchScreenObject.url);
    const bills = (responseFromAPI && responseFromAPI.Bills) || [];
    dispatch(
      prepareFinalObject("searchScreenMdmsData.billSearchResponse", bills)
    );

    const uiConfigs = get(state.screenConfiguration.preparedFinalObject, "searchScreenMdmsData.common-masters.uiCommonPay");
    const configObject = uiConfigs.filter(item => item.code === searchScreenObject.businesService);

    const response = [];
    for (let i = 0; i < bills.length; i++) {
      if(get(bills[i], "status") === "ACTIVE"){
        response.push({
          consumerId: get(bills[i], "consumerCode"),
          billNo: get(bills[i], "billNumber"),
          ownerName: get(bills[i], "payerName"),
          billDate: get(bills[i], "billDate"),
          status : get(bills[i], "status"),
          tenantId: tenantId
        })
      }      
    }
    try {
      let data = response.map(item => ({
        ["ABG_COMMON_TABLE_COL_BILL_NO"]: item.billNo || "-",
        ["ABG_COMMON_TABLE_COL_CONSUMER_ID"]: item.consumerId || "-",
        ["ABG_COMMON_TABLE_COL_OWN_NAME"]: item.ownerName || "-",
        ["ABG_COMMON_TABLE_COL_BILL_DATE"]:
          convertEpochToDate(item.billDate) || "-",
        ["ABG_COMMON_TABLE_COL_STATUS"]: item.status && getTextToLocalMapping(item.status.toUpperCase())  || "-",
        ["TENANT_ID"]: item.tenantId,
        ["BUSINESS_URL"]: businessUrl,
        ["BILL_KEY"]: get(configObject[0], "billKey","consolidatedbill")||"consolidatedbill",
        ["BUSINESS_SERVICE"]: searchScreenObject.businesService,
      }));
      const copyOfSearchScreenObject = cloneDeep(searchScreenObject);
      dispatch(
        prepareFinalObject("searchDetailsOfGroupBills", copyOfSearchScreenObject)
      );
      dispatch(
        handleField(
          "groupBills",
          "components.div.children.searchResults",
          "props.data",
          data
        )
      );
      dispatch(
        handleField(
          "groupBills",
          "components.div.children.searchResults",
          "props.rows",
          data.length
        )
      );
      getMergeAndDownloadList(state, dispatch, data.length);
      showHideTable(true, dispatch);
      if(!isEmpty(response)){
        showHideMergeButton(true, dispatch);
        loadUlbLogo(tenantId);
      };
    } catch (error) {
      dispatch(toggleSnackbar(true, error.message, "error"));
    }
  }
};

const showHideTable = (booleanHideOrShow, dispatch) => {
  dispatch(
    handleField(
      "groupBills",
      "components.div.children.searchResults",
      "visible",
      booleanHideOrShow
    )
  );
};

const showHideMergeButton = (booleanHideOrShow, dispatch) => {
  dispatch(
    handleField(
      "groupBills",
      "components.div.children.mergeDownloadButton.children.mergeButton",
      "visible",
      booleanHideOrShow
    )
  );
};
