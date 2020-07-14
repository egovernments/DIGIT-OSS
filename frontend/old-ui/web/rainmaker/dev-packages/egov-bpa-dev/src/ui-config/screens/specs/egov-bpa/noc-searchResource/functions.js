import get from "lodash/get";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { convertDateToEpoch } from "../../utils/index";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import store from "ui-redux/store";
import { httpRequest } from "../../../../../ui-utils/api";
import { getTextToLocalMapping } from "../../utils";


export const getNOCSearchResults = async queryObject => {
  try {
    const response = await httpRequest(
      "post",
      "/noc-services/v1/noc/_search?offset=0&limit=-1",
      "",
      queryObject
    );
    return response;
  } catch (error) {
    store.dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelCode: error.message },
        "error"
      )
    );
  }
};

export const searchApiCall = async (state, dispatch) => {
  showHideTable(false, dispatch);
  let tenantId = getTenantId();
  let queryObject = [
    {
      key: "tenantId",
      value: tenantId
    }
  ];
  let searchScreenObject = get(
    state.screenConfiguration.preparedFinalObject,
    "searchScreen",
    {}
  );
  if (
    Object.keys(searchScreenObject).length == 0 ||
    Object.values(searchScreenObject).every(x => x === "")
  ) {
    dispatch(
      toggleSnackbar(
        true,
        {
          labelName: "Please fill at least one field to start search",
          labelKey: "BPA_SEARCH_SELECT_AT_LEAST_ONE_TOAST_MESSAGE"
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
    dispatch(
      toggleSnackbar(
        true,
        { labelName: "Please fill From Date", labelKey: "ERR_FILL_FROM_DATE" },
        "warning"
      )
    );
  } else {
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
        }
        else {
          queryObject.push({ key: key, value: searchScreenObject[key].trim() });
        }
      }
    }
    try {
      const response = await getNOCSearchResults(queryObject);
      let data = response.Noc.map(item => ({
        ["BPA_COMMON_TABLE_COL_APP_NO"]: item.applicationNo || "-",
        ["BPA_BASIC_DETAILS_APPLICATION_TYPE_LABEL"]: getTextToLocalMapping(item.applicationType) || "-",
        ["NOC_SEARCH_TYPE_LABEL"]: getTextToLocalMapping(item.nocType) || "-",
        ["BPA_COMMON_TABLE_COL_STATUS_LABEL"]: item.applicationStatus || "-",
        ["TENANT_ID"]: item.tenantId
      }));

      dispatch(
        handleField(
          "noc-search",
          "components.div.children.searchResults",
          "props.data",
          data
        )
      );
      dispatch(
        handleField(
          "noc-search",
          "components.div.children.searchResults",
          "props.rows",
          response.Noc.length
        )
      );
      showHideTable(true, dispatch);
    } catch (error) {
      console.log(error);
    }
  }
};
const showHideTable = (booleanHideOrShow, dispatch) => {
  dispatch(
    handleField(
      "noc-search",
      "components.div.children.searchResults",
      "visible",
      booleanHideOrShow
    )
  );
};
