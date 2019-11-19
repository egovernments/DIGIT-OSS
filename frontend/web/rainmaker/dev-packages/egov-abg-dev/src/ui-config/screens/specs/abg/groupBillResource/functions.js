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
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import isEmpty from "lodash/isEmpty"

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
    searchScreenObject.tenantId = tenantId;
    const responseFromAPI = await getGroupBillSearch(dispatch,searchScreenObject);
    const bills = (responseFromAPI && responseFromAPI.Bills) || [];
    dispatch(
      prepareFinalObject("searchScreenMdmsData.billSearchResponse", bills)
    );
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
        [getTextToLocalMapping("Bill No.")]: item.billNo || "-",
        [getTextToLocalMapping("Consumer ID")]: item.consumerId || "-",
        [getTextToLocalMapping("Owner Name")]: item.ownerName || "-",
        [getTextToLocalMapping("Bill Date")]:
          convertEpochToDate(item.billDate) || "-",
        [getTextToLocalMapping("Status")]: item.status && getTextToLocalMapping(item.status.toUpperCase())  || "-",
        tenantId: item.tenantId
      }));

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
          "props.title",
          `${getTextToLocalMapping(
            "BILL_GENIE_GROUP_SEARCH_HEADER"
          )} (${data.length})`
        )
      );      
      showHideTable(true, dispatch);
      if(!isEmpty(response)){showHideMergeButton(true, dispatch)};
    } catch (error) {
      dispatch(toggleSnackbar(true, error.message, "error"));
      console.log(error);
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
