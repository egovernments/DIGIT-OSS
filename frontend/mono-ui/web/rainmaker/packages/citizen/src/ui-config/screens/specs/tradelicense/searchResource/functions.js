import get from "lodash/get";
import { httpRequest } from "../../../../../ui-utils/api";
import store from "redux/store";

import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { textToLocalMapping } from "./searchResults";
import { validateFields, convertEpochToDate } from "../../utils";
import { getLocaleLabels, getTransformedLocale } from "egov-ui-framework/ui-utils/commons";

export const searchApiCall = async (state, dispatch) => {
  showHideTable(false, dispatch);
  let requestBody = {};
  let searchScreenObject = get(state.screenConfiguration.preparedFinalObject, "searchScreen", {});
  const isSearchBoxFirstRowValid = validateFields(
    "components.div.children.tradeLicenseApplication.children.cardContent.children.appTradeAndMobNumContainer.children",
    state,
    dispatch,
    "search"
  );

  if (!isSearchBoxFirstRowValid) {
    dispatch(
      toggleSnackbar(
        true,
        {
          labelName: "Please fill valid fields to start search",
          labelKey: "ERR_FILL_VALID_FIELDS",
        },
        "warning"
      )
    );
  } else if (Object.keys(searchScreenObject).length == 0 || Object.values(searchScreenObject).every((x) => x === "")) {
    dispatch(
      toggleSnackbar(
        true,
        {
          labelName: "Please fill at least one field to start search",
          labelKey: "ERR_FILL_ONE_FIELDS",
        },
        "warning"
      )
    );
  } else {
    const tenantId = get(state.screenConfiguration.preparedFinalObject, "tenantId", "");
    if (tenantId && tenantId.trim() !== "") searchScreenObject = { ...searchScreenObject, ...{ tenantId: tenantId } };
    requestBody = { searchCriteria: searchScreenObject };

    const response = await getSearchResults(requestBody);
    try {
      let data = response.TradeLicenses.map((item) => ({
        [get(textToLocalMapping, "Application No")]: item.applicationnumber || "-",
        [get(textToLocalMapping, "License No")]: item.licensenumber || "-",
        [get(textToLocalMapping, "Trade Name")]: item.tradename || "-",
        [get(textToLocalMapping, "Application Date")]: convertEpochToDate(item.applicationdate) || "-",
        [get(textToLocalMapping, "Tenant")]:
          getLocaleLabels(item.tenantid, "TENANT_TENANTS_" + getTransformedLocale(item.tenantid), get(state, "app.localizationLabels", "-")) || "-",
        [get(textToLocalMapping, "Status")]: get(textToLocalMapping, item.status) || "-",
      }));

      dispatch(handleField("search", "components.div.children.searchResults", "props.data", data));
      dispatch(
        handleField(
          "search",
          "components.div.children.searchResults",
          "props.title",
          `${textToLocalMapping["Search Results for Trade License Applications"]} (${response.TradeLicenses.length})`
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
  dispatch(handleField("search", "components.div.children.searchResults", "visible", booleanHideOrShow));
};

export const getSearchResults = async (requestBody) => {
  try {
    const response = await httpRequest("post", "egov-searcher/tl-searcher/opensearch/_get", "", [], requestBody);
    return response;
  } catch (error) {
    store.dispatch(toggleSnackbar(true, { labelName: error.message, labelCode: error.message }, "error"));
  }
};
