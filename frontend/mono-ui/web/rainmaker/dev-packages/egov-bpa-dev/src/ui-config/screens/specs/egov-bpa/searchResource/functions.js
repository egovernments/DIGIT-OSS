import { handleScreenConfigurationFieldChange as handleField, prepareFinalObject, toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import get from "lodash/get";
import { getBpaSearchResults } from "../../../../../ui-utils/commons";
import { getWorkFlowDataForBPA } from "../../bpastakeholder/searchResource/functions";
import { getTextToLocalMapping } from "../../utils";
import { convertDateToEpoch, convertEpochToDate } from "../../utils/index";

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
  // const isSearchBoxFirstRowValid = validateFields(
  //   "components.div.children.BPAApplication.children.cardContent.children.appBPAHomeSearchResultsContainer.children",
  //   state,
  //   dispatch,
  //   "search"
  // );

  // if (!(isSearchBoxFirstRowValid)) {
  //   dispatch(
  //     toggleSnackbar(
  //       true,
  //       {
  //         labelName: "Please fill valid fields to search",
  //         labelKey: "ERR_FIRENOC_FILL_VALID_FIELDS"
  //       },
  //       "error"
  //     )
  //   );
  // } else
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
        }
        else {
          queryObject.push({ key: key, value: searchScreenObject[key].trim() });
        }
      }
    }
    try {
      const response = await getBpaSearchResults(queryObject);
      const businessIdToOwnerMappingForBPA = await getWorkFlowDataForBPA(get(response, "BPA"));
      // const response = searchSampleResponse();

      let data = response.BPA.map(item => ({
        ["BPA_COMMON_TABLE_COL_APP_NO"]: item.applicationNo || "-",
        ["BPA_COMMON_TABLE_COL_OWN_NAME_LABEL"]: item.landInfo && item.landInfo.owners && item.landInfo.owners.map(function (items) {
          return items.isPrimaryOwner ? items.name : "";
        }),
        ["BPA_COMMON_TABLE_COL_APP_DATE_LABEL"]: convertEpochToDate(parseInt(get(item, "auditDetails.createdTime"))) || "-",
        ["BPA_COMMON_TABLE_COL_STATUS_LABEL"]: getTextToLocalMapping("WF_BPA_" + get(businessIdToOwnerMappingForBPA[item.applicationNo], "state", null)),
        ["TENANT_ID"]: item.tenantId,
        ["SERVICE_TYPE"]: get(item, "businessService", null),
        ["BPA_COMMON_TABLE_COL_APP_STATUS_LABEL"]: item.status || ""
      }));

      // if (data && data.length > 0) {
      //   data.map(items => {
      //     if (items && items["Application Date"]) {
      //       const date = items["Application Date"].split("/");
      //       items["Application Date"] = `${date[1]}/${date[0]}/${date[2]}`
      //     }
      //   });
      // }

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
          "props.rows",
          response.BPA.length
        )
      );
      //showHideProgress(false, dispatch);
      showHideTable(true, dispatch);
    } catch (error) {
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

export const setResidentialList = (state, dispatch) => {
  let residentialList = get(
    state.screenConfiguration.preparedFinalObject,
    `BPAs[0].BPADetails.blockwiseusagedetails.residential`,
    []
  );
  let furnishedRolesList = residentialList.map(item => {
    return " " + item.label;
  });
  dispatch(
    prepareFinalObject(
      "bpa.summary.residential",
      furnishedRolesList.join()
    )
  );
};
