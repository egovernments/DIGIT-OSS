import { handleScreenConfigurationFieldChange as handleField, toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { httpRequest } from "egov-ui-framework/ui-utils/api";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import get from "lodash/get";
import { getSearchResults } from "../../../../..//ui-utils/commons";
import { validateFields } from "../../utils";
import {
  convertDateToEpoch, convertEpochToDate,

  getTextToLocalMapping
} from "../../utils/index";


const convertMillisecondsToDays = (milliseconds) => {
  return Math.round(milliseconds / (1000 * 60 * 60 * 24));
}
export const searchApiCall = async (state, dispatch) => {
  showHideTable(false, dispatch);

  let queryObject = [
    {
      key: "tenantId",
      value: (getTenantId().lastIndexOf(".") > 0 ? getTenantId().substr(0, getTenantId().lastIndexOf(".")) : getTenantId())
    },
    { key: "offset", value: "0" },
    { key: "limit", value: "100" }
  ];
  let searchScreenObject = get(
    state.screenConfiguration.preparedFinalObject,
    "searchScreen",
    {}
  );
  const isSearchBoxFirstRowValid = validateFields(
    "components.div.children.tradeLicenseApplication.children.cardContent.children.appTradeAndMobNumContainer.children",
    state,
    dispatch,
    "search"
  );

  const isSearchBoxSecondRowValid = validateFields(
    "components.div.children.tradeLicenseApplication.children.cardContent.children.appStatusAndToFromDateContainer.children",
    state,
    dispatch,
    "search"
  );

  if (!(isSearchBoxFirstRowValid && isSearchBoxSecondRowValid)) {
    dispatch(
      toggleSnackbar(
        true,
        {
          labelName: "Please fill valid fields to start search",
          labelKey: "ERR_FILL_VALID_FIELDS"
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
          labelKey: "ERR_FILL_ONE_FIELDS"
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
        } else {
          queryObject.push({ key: key, value: searchScreenObject[key].trim() });
        }
      }
    }
    const response = await getSearchResults(queryObject);
    const businessIdToOwnerMapping = await getWorkFlowData(response.Licenses);
    try {
      response.Licenses.sort((item1, item2) => item1.applicationDate > item2.applicationDate ? -1 : 1)
      let data = response.Licenses.map(item => ({
        ["BPA_COMMON_TABLE_COL_APP_NO"]: item.applicationNumber || "-",
        ["BPA_COMMON_TABLE_COL_OWN_NAME_LABEL"]: item.tradeLicenseDetail.owners[0].name || "-",
        ["BPA_COMMON_TABLE_COL_LICENSEE_TYPE"]: getTextToLocalMapping(
          `TRADELICENSE_TRADETYPE_${item.tradeLicenseDetail.tradeUnits[0].tradeType.split('.')[0].toUpperCase()}`
        ) || "-",
        ["BPA_COMMON_TABLE_COL_STATUS_LABEL"]: item.status || "-",
        ["BPA_COMMON_TABLE_COL_ASSIGN_TO"]: get(businessIdToOwnerMapping[item.applicationNumber], "assignee") || "-",
        ["BPA_COMMON_TABLE_COL_APP_DATE_LABEL"]: convertEpochToDate(item.applicationDate) || "-",
        ["TENANT_ID"]: item.tenantId
      }));

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
          response.Licenses.length
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
      "search",
      "components.div.children.searchResults",
      "visible",
      booleanHideOrShow
    )
  );
};

export const getWorkFlowData = async Licenses => {
  var businessIds = [];
  Licenses.forEach(item => {
    businessIds.push(item.applicationNumber);
  });
  const queryObject = [
    {
      key: "tenantId",
      value: (getTenantId().lastIndexOf(".") > 0 ? getTenantId().substr(0, getTenantId().lastIndexOf(".")) : getTenantId())
    },
    {
      key: "businessIds",
      value: businessIds
    }
  ];
  try {
    const payload = await httpRequest(
      "post",
      "egov-workflow-v2/egov-wf/process/_search",
      "",
      queryObject
    );
    var businessIdToOwnerMapping = {};
    payload.ProcessInstances.filter(
      record => record.moduleName === "BPAREG"
    ).forEach(item => {
      businessIdToOwnerMapping[item.businessId] = {
        assignee: get(item, "assignes[0].name"),
        sla: item.businesssServiceSla && convertMillisecondsToDays(item.businesssServiceSla)
      };
    });
    return businessIdToOwnerMapping;
  } catch (error) {
    return [];
  }
};

export const getWorkFlowDataForBPA = async Licenses => {
  var businessIds = [];
  let tenantMap = {};
  let processInstanceArray = [];
  var appNumbers = [];
  Licenses.forEach(item => {
    var appNums = tenantMap[item.tenantId] || [];
    appNumbers = appNums;
    appNums.push(item.applicationNo);
    tenantMap[item.tenantId] = appNums;
  });

  for (var key in tenantMap) {
    for (let i = 0; i < appNumbers.length / 100; i++) {
      let queryObject = [
        {
          key: "tenantId",
          value: key
        },
        {
          key: "businessIds",
          value: tenantMap[key].slice(i * 100, (i * 100) + 100)
        }
      ];
      try {
        let payload = await httpRequest(
          "post",
          "egov-workflow-v2/egov-wf/process/_search",
          "",
          queryObject
        );
        processInstanceArray = processInstanceArray.concat(payload.ProcessInstances)

      } catch (error) {
        return [];
      }
    }

    var businessIdToOwnerMapping = {};
    processInstanceArray.filter(
      record => record.moduleName.includes("bpa-services")
    ).forEach(item => {
      businessIdToOwnerMapping[item.businessId] = {
        assignee: get(item, "assignes[0].name"),
        sla: item.businesssServiceSla && convertMillisecondsToDays(item.businesssServiceSla),
        state: item.state.state
      };
    });
    return businessIdToOwnerMapping;
  }
};
