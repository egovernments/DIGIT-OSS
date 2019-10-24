import get from "lodash/get";
import { getGroupBillSearch } from "../../../../../ui-utils/commons";
import {
  handleScreenConfigurationFieldChange as handleField,
  prepareFinalObject
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {
  convertEpochToDate,
  convertDateToEpoch,
  validateFields
} from "../../utils/index";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { textToLocalMapping } from "./searchResults";
import { getUserInfo, getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import { prepareFinalBodyData } from "egov-ui-framework/ui-redux/screen-configuration/utils";

// const tenantId = getTenantId();
const tenantId = getTenantId();
export const searchApiCall = async (state, dispatch) => {
  showHideTable(false, dispatch);
  showHideMergeButton(false, dispatch);
  let queryObject = [
    {
      key: "tenantId",
      value: tenantId
    },
    { key: "limit", value: "10" }
  ];
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
    const responseFromAPI = await getGroupBillSearch(searchScreenObject);
    const bills = (responseFromAPI && responseFromAPI.Bills) || [];
    dispatch(
      prepareFinalObject("searchScreenMdmsData.billSearchResponse", bills)
    );
    const response = [];
    for (let i = 0; i < bills.length; i++) {
      response[i] = {
        consumerId: get(bills[i], `billDetails[0].consumerCode`),
        billNo: get(bills[i], `billDetails[0].billNumber`),
        ownerName: get(bills[i], `payerName`),
        billDate: get(bills[i], `billDetails[0].billDate`),
        tenantId: tenantId
      };
    }
    try {
      let data = response.map(item => ({
        [get(textToLocalMapping, "Bill No.")]: item.billNo || "-",
        [get(textToLocalMapping, "Consumer ID")]: item.consumerId || "-",
        [get(textToLocalMapping, "Owner Name")]: item.ownerName || "-",
        [get(textToLocalMapping, "Bill Date")]:
          convertEpochToDate(item.billDate) || "-",
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
      // dispatch(
      //   handleField("groupBills", "components.div.children.searchResults")
      // );
      showHideTable(true, dispatch);
      showHideMergeButton(true, dispatch);
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
