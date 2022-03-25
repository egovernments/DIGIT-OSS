import get from "lodash/get";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getSearchResults } from "../../../../..//ui-utils/commons";
import { convertEpochToDate, convertDateToEpoch } from "../../utils/index";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { textToLocalMapping } from "./searchResults";
import { validateFields } from "../../utils";
import { getUserInfo } from "egov-ui-kit/utils/localStorageUtils";

export const searchApiCall = async (state, dispatch) => {
  showHideTable(false, dispatch);
  let queryObject = [
    {
      key: "tenantId",
      value: JSON.parse(getUserInfo()).tenantId
    },
    { key: "limit", value: "10" },
    { key: "offset", value: "0" }
  ];
  let searchScreenObject = get(
    state.screenConfiguration.preparedFinalObject,
    "searchScreen",
    {}
  );
  const isSearchBoxFirstRowValid = validateFields(
    "components.div.children.fireNOCApplication.children.cardContent.children.searchContainer.children",
    state,
    dispatch,
    "notification"
  );

  const isSearchBoxSecondRowValid = validateFields(
    "components.div.children.fireNOCApplication.children.cardContent.children.appStatusAndToFromDateContainer.children",
    state,
    dispatch,
    "notification"
  );

  if (!(isSearchBoxFirstRowValid && isSearchBoxSecondRowValid)) {
    dispatch(
      toggleSnackbar(
        true,
        "Please fill valid fields to start search",
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
  } else if (
    (searchScreenObject["fromDate"] === undefined ||
      searchScreenObject["fromDate"].length === 0) &&
    searchScreenObject["toDate"] !== undefined &&
    searchScreenObject["toDate"].length !== 0
  ) {
    dispatch(toggleSnackbar(true, "Please fill From Date", "warning"));
  } else {
    //  showHideProgress(true, dispatch);
    for (var key in searchScreenObject) {
      if (
        searchScreenObject.hasOwnProperty(key) &&
        searchScreenObject[key].trim() !== ""
      ) {
        if (key === "fromDate") {
          queryObject.push({
            key: key,
            value: convertDateToEpoch(searchScreenObject[key], "daystart")
          });
        } else if (key === "toDate") {
          queryObject.push({
            key: key,
            value: convertDateToEpoch(searchScreenObject[key], "dayend")
          });
        } else {
          queryObject.push({ key: key, value: searchScreenObject[key].trim() });
        }
      }
    }

    //const response = await getSearchResults(queryObject);
    const response = [
      {
        jobIdNo: "TL-JLD-2018",
        dateCreated: 1554332357000,
        status: "Success"
        //add download button
      }
    ];
    try {
      let data = response.map(item => ({
        [get(textToLocalMapping, "Job ID No.")]:
          item.jobIdNo || "-",
        [get(textToLocalMapping, "Date Created")]:
          convertEpochToDate(item.dateCreated) || "-",
        [get(textToLocalMapping, "Status")]: item.status || "-",
        tenantId: item.tenantId,
      }));
      dispatch(
        handleField(
          "notification",
          "components.div.children.searchResults",
          "props.data",
          data
        )
      );
      dispatch(
        handleField(
          "notification",
          "components.div.children.searchResults",
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
      "notification",
      "components.div.children.searchResults",
      "visible",
      booleanHideOrShow
    )
  );
};
