import { getCommonContainer, getCommonHeader } from "egov-ui-framework/ui-config/screens/specs/utils";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getTransformedLocale } from "egov-ui-framework/ui-utils/commons";
import get from "lodash/get";
import { getBpaSearchResults, getSearchResults } from "../../../../ui-utils/commons";
import { getWorkFlowData, getWorkFlowDataForBPA } from "../bpastakeholder/searchResource/functions";
import {
  getBpaTextToLocalMapping, getEpochForDate,

  getTextToLocalMapping, sortByEpoch
} from "../utils";
const header = getCommonHeader(
  {
    labelName: "My Applications",
    labelKey: "BPA_MY_APPLICATIONS"
  },
  {
    classes: {
      root: "common-header-cont"
    }
  }
);

export const getWfBusinessData = async (action, state, dispatch, businessService) => {
  const tenantId = getTenantId();
  const BSqueryObject = [
    { key: "tenantId", value: tenantId },
    { key: "businessServices", value: businessService }
  ];
  const payload = await httpRequest(
    "post",
    "egov-workflow-v2/egov-wf/businessservice/_search",
    "_search",
    BSqueryObject
  );
  if (
    payload &&
    payload.BusinessServices &&
    payload.BusinessServices.length > 0
  ) {
    dispatch(prepareFinalObject(businessService, get(payload, "BusinessServices[0]")))
  }
}

const getAllBusinessServicesDataForStatus = async (action, state, dispatch) => {
  let businessServices = ["BPA", "BPA_OC", "ARCHITECT"];
  businessServices.forEach(service => {
    getWfBusinessData(action, state, dispatch, service)
  })
}

const screenConfig = {
  uiFramework: "material-ui",
  name: "my-applications-stakeholder",
  beforeInitScreen: (action, state, dispatch) => {
    fetchData(action, state, dispatch);
    return action;
  },
  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      children: {
        header: header,
        stakeholderMyappsConatiner: getCommonContainer({
          myApplicationsCard: {
            uiFramework: "custom-molecules",
            name: "my-applications-stakeholder",
            componentPath: "Table",
            props: {
              columns: [
                {
                  name: "Application No", labelKey: "BPA_COMMON_TABLE_COL_APP_NO"
                },
                {
                  name: "Application Type", labelKey: "BPA_BASIC_DETAILS_APPLICATION_TYPE_LABEL"
                },
                {
                  name: "Service type", labelKey: "BPA_BASIC_DETAILS_SERVICE_TYPE_LABEL"
                },
                {
                  name: "Assigned To", labelKey: "BPA_COL_ASSIGNEDTO"
                },
                {
                  name: "SLA(Days Remaining)", labelKey: "BPA_COMMON_SLA"
                },
                {
                  name: "Status", labelKey: "BPA_COMMON_TABLE_COL_STATUS_LABEL"
                },
                {
                  name: "tenantId",
                  labelKey: "tenantId",
                  options: {
                    display: false
                  }
                },
                {
                  name: "serviceType",
                  labelKey: "serviceType",
                  options: {
                    display: false
                  }
                },
                {
                  name: "type",
                  labelKey: "type",
                  options: {
                    display: false
                  }
                },
                {
                  name: "appStatus", labelKey: "BPA_COMMON_TABLE_COL_APP_STATUS_LABEL",
                  options: {
                    display: false
                  }
                },
              ],
              title: {
                labelName: "Search Results for BPA Applications",
                labelKey: "BPA_SEARCH_RESULTS_FOR_APP"
              },
              rows: "",
              options: {
                filter: false,
                download: false,
                responsive: "stacked",
                selectableRows: false,
                hover: true,
                viewColumns: false,
                onRowClick: (row, index) => {
                  onRowClick(row);
                },
                serverSide: false
              },
              customSortColumn: {
                column: "Application Date",
                sortingFn: (data, i, sortDateOrder) => {
                  const epochDates = data.reduce((acc, curr) => {
                    acc.push([...curr, getEpochForDate(curr[4], "dayend")]);
                    return acc;
                  }, []);
                  const order = sortDateOrder === "asc" ? true : false;
                  const finalData = sortByEpoch(epochDates, !order).map(item => {
                    item.pop();
                    return item;
                  });
                  return { data: finalData, currentOrder: !order ? "asc" : "desc" };
                }
              }
            }
          }
        })
      }
    }
  }
};

export const fetchData = async (
  action,
  state,
  dispatch
) => {

  let searchConvertedArray = [];
  let sortConvertedArray = [];
  const bpaResponse = await getBpaSearchResults();
  const response = await getSearchResults();

  if (bpaResponse && bpaResponse.BPA && bpaResponse.BPA.length > 0) {
    const businessIdToOwnerMappingForBPA = await getWorkFlowDataForBPA(bpaResponse.BPA);
    bpaResponse.BPA.forEach(element => {
      let status = getTextToLocalMapping("WF_BPA_" + get(businessIdToOwnerMappingForBPA[element.applicationNo], "state", null));
      let service = getTextToLocalMapping("BPA_APPLICATIONTYPE_" + get(element, "applicationType"));
      service += " - " + getTextToLocalMapping("BPA_SERVICETYPE_" + get(element, "serviceType"));
      let modifiedTime = element.auditDetails.lastModifiedTime;
      let primaryowner = "-";
      let businessService = get(element, "businessService", null);
      let type;
      if (businessService == "BPA_LOW") { type = "LOW" } else if ((businessService == "BPA") || (businessService == "BPA_OC")) { type = "HIGH" }
      let owners = get(element, "owners", [])
      owners.map(item => {
        if (item.isPrimaryOwner) {
          primaryowner = item.name;
        }
      });
      let bService = get(element, "businessService");
      let appType = getBpaTextToLocalMapping("WF_BPA_BUILDING_PLAN_SCRUTINY");
      let serType = getBpaTextToLocalMapping(`WF_BPA_NEW_CONSTRUCTION`);
      if (bService === "BPA_OC") {
        appType = getBpaTextToLocalMapping("WF_BPA_BUILDING_OC_PLAN_SCRUTINY");
      }
      searchConvertedArray.push({
        ["BPA_COMMON_TABLE_COL_APP_NO"]: element.applicationNo || "-",
        ["BPA_COMMON_TABLE_COL_STATUS_LABEL"]: status || "-",
        ["BPA_BASIC_DETAILS_APPLICATION_TYPE_LABEL"]: appType,
        ["BPA_BASIC_DETAILS_SERVICE_TYPE_LABEL"]: serType,
        ["BPA_COMMON_SLA"]: get(businessIdToOwnerMappingForBPA[element.applicationNo], "sla", null) || "-",
        ["BPA_COL_ASSIGNEDTO"]: get(businessIdToOwnerMappingForBPA[element.applicationNo], "assignee", null) || "-",
        ["BPA_COMMON_TABLE_COL_APP_STATUS_LABEL"]: element.status,
        applicationType: getBpaTextToLocalMapping("BPA_APPLY_SERVICE"),
        modifiedTime: modifiedTime,
        sortNumber: 1,
        serviceType: businessService,
        tenantId: get(element, "tenantId", null),
        type: type
      })
    });
  }


  if (response && response.Licenses && response.Licenses.length > 0) {
    const businessIdToOwnerMapping = await getWorkFlowData(response.Licenses);
    response.Licenses.forEach(element => {
      let service = getTextToLocalMapping("MODULE_" + get(element, "businessService"));
      let status = getTextToLocalMapping("WF_ARCHITECT_" + get(element, "status"));
      let modifiedTime = element.auditDetails.lastModifiedTime;
      let licensetypeFull = element.tradeLicenseDetail.tradeUnits[0].tradeType;
      if (licensetypeFull.split(".").length > 1) {
        service += " - " + getTextToLocalMapping(`TRADELICENSE_TRADETYPE_${getTransformedLocale(licensetypeFull.split(".")[0])}`);
      }
      searchConvertedArray.push({
        ["BPA_COMMON_TABLE_COL_APP_NO"]: element.applicationNumber || "-",
        ["BPA_COMMON_TABLE_COL_STATUS_LABEL"]: status || "-",
        ["BPA_BASIC_DETAILS_APPLICATION_TYPE_LABEL"]: getBpaTextToLocalMapping("BPAREG_SERVICE"),
        ["BPA_BASIC_DETAILS_SERVICE_TYPE_LABEL"]: service,
        ["BPA_COMMON_SLA"]: get(businessIdToOwnerMapping[element.applicationNumber], "sla", null) || "-",
        ["BPA_COL_ASSIGNEDTO"]: get(businessIdToOwnerMapping[element.applicationNumber], "assignee", null) || "-",
        applicationType: getBpaTextToLocalMapping("BPAREG_SERVICE"),
        modifiedTime: modifiedTime,
        sortNumber: 0,
        serviceType: "BPAREG",
        tenantId: get(element, "tenantId", null)
      })
    });
  }

  sortConvertedArray = [].slice.call(searchConvertedArray).sort(function (a, b) {
    return new Date(b.modifiedTime) - new Date(a.modifiedTime) || a.sortNumber - b.sortNumber;
  });
  dispatch(
    handleField(
      "my-applications-stakeholder",
      "components.div.children.stakeholderMyappsConatiner.children.myApplicationsCard",
      "props.data",
      sortConvertedArray
    ));
  dispatch(
    handleField(
      "my-applications-stakeholder",
      "components.div.children.stakeholderMyappsConatiner.children.myApplicationsCard",
      "props.rows",
      sortConvertedArray.length
    )
  );
};

const onRowClick = rowData => {
  const environment = process.env.NODE_ENV === "production" ? "citizen" : "";
  const origin = process.env.NODE_ENV === "production" ? window.location.origin + "/" : window.location.origin;
  if (rowData[7] === "BPAREG") {
    switch (rowData[4]) {
      case "INITIATED":
        window.location.assign(`${origin}${environment}/bpastakeholder/apply?applicationNumber=${rowData[0]}&tenantId=${rowData[6]}`)
        break;
      default:
        window.location.assign(`${origin}${environment}/bpastakeholder/search-preview?applicationNumber=${rowData[0]}&tenantId=${rowData[6]}`)
    }
  } else if ((rowData[7] === "BPA") || rowData[7] == "BPA_LOW") {
    switch (rowData[9]) {
      case "INITIATED":
        window.location.assign(`${origin}${environment}/egov-bpa/apply?applicationNumber=${rowData[0]}&tenantId=${rowData[6]}`);
        break;
      default:
        window.location.assign(`${origin}${environment}/egov-bpa/search-preview?applicationNumber=${rowData[0]}&tenantId=${rowData[6]}&type=${rowData[8]}`);
    }
  } else {
    switch (rowData[9]) {
      case "INITIATED":
        window.location.assign(`${origin}${environment}/oc-bpa/apply?applicationNumber=${rowData[0]}&tenantId=${rowData[6]}`);
        break;
      default:
        window.location.assign(`${origin}${environment}/oc-bpa/search-preview?applicationNumber=${rowData[0]}&tenantId=${rowData[6]}`);
    }
  }
};

export default screenConfig;
