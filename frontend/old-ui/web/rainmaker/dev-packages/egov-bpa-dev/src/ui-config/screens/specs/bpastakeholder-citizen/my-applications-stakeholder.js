import { getMdmsData, fieldChange, clearFilter } from "./citizenSearchResource/citizenFunctions";
import { getCommonHeader, getSelectField, getCommonContainer, getLabel } from "egov-ui-framework/ui-config/screens/specs/utils";
import {
  sortByEpoch,
  getEpochForDate,
  getBpaTextToLocalMapping,
  getTextToLocalMapping
} from "../utils";
import store from "ui-redux/store";
import { getAppSearchResults, getSearchResults } from "../../../../ui-utils/commons";
import { handleScreenConfigurationFieldChange as handleField, prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getWorkFlowData, getWorkFlowDataForBPA } from "../bpastakeholder/searchResource/functions";
import get from "lodash/get";
import { getTransformedLocale } from "egov-ui-framework/ui-utils/commons";
import { getTenantId, getUserInfo } from "egov-ui-kit/utils/localStorageUtils";
import { httpRequest } from "../../../../ui-utils";

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
    getMdmsData(dispatch).then(data => {
      dispatch( prepareFinalObject( "applyScreenMdmsData", data.MdmsRes ));
    });

    /**
    * @Todo set for status (commeting the code beacuase of the removing of status)
    */

    // getAllBusinessServicesDataForStatus(action, state, dispatch);
    dispatch(prepareFinalObject("filterData[0].applicationType", "BUILDING_PLAN_SCRUTINY"));
    changePage();
    return action;
  },
  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      children: {
        header: header,
        filterCard: getCommonContainer({
          applicationType: {
            ...getSelectField({
              label: {
                labelName: "Application Type",
                labelKey: "BPA_BASIC_DETAILS_APPLICATION_TYPE_LABEL"
              },
              placeholder: {
                labelName: "Select Application Type",
                labelKey: "BPA_BASIC_DETAILS_APPLICATION_TYPE_PLACEHOLDER"
              },
              jsonPath: "filterData[0].applicationType",
              props: {
                style: { marginLeft: "20px" }
              },
              localePrefix: {
                moduleName: "WF",
                masterName: "BPA"
              },
              data: [
                {
                  code: "BUILDING_PLAN_SCRUTINY",
                  label: "BPA"
                },
                {
                  code: "BUILDING_OC_PLAN_SCRUTINY",
                  label: "BPA OC"
                },
                {
                  code: "BPAREG_SERVICE",
                  label: "Stakeholder"
                }
              ],
              gridDefination: {
                xs: 12,
                sm: 4
              }
            }),
            afterFieldChange: (action, state, dispatch) => {
              fieldChange(action, state, dispatch);
            }
          },
          serviceType: {
            ...getSelectField({
              label: {
                labelName: "Service Type",
                labelKey: "BPA_BASIC_DETAILS_SERVICE_TYPE_LABEL"
              },
              placeholder: {
                labelName: "Select Service Type",
                labelKey: "BPA_BASIC_DETAILS_SERVICE_TYPE_PLACEHOLDER"
              },
              optionLabel: "name",
              sourceJsonPath: "applyScreenMdmsData.BPA.ServiceType",
              jsonPath: "filterData[0].serviceType",
              localePrefix: {
                moduleName: "WF",
                masterName: "BPA"
              },
              props: {
                style: { marginLeft: "20px" }
              },
              gridDefination: {
                xs: 12,
                sm: 4
              }
            }),
            afterFieldChange: (action, state, dispatch) => {
              fieldChange(action, state, dispatch);
            }
          },
          applicationStatus: {
            ...getSelectField({
              visible: false,
              label: {
                labelName: "Status",
                labelKey: "BPA_STATUS_LABEL"
              },
              optionLabel: "name",
              placeholder: {
                labelName: "Select Status",
                labelKey: "BPA_STATUS_PLACEHOLDER"
              },
              localePrefix: {
                moduleName: "WF",
                masterName: "BPA"
              },
              jsonPath: "filterData[0].status",
              sourceJsonPath: "applyScreenMdmsData.searchScreen.status",
              props: {
                style: { marginLeft: "20px" }
              },
              gridDefination: {
                xs: 12,
                sm: 3
              }
            }),
            afterFieldChange: (action, state, dispatch) => {
              fieldChange(action, state, dispatch);
            }
          },
          clearBtn: {
            componentPath: "Button",
            gridDefination: {
              xs: 12,
              sm: 4
            },
            props: {
              variant: "contained",
              style: {
                color: "white",
                margin: "8px",
                backgroundColor: "rgba(0, 0, 0, 0.6000000238418579)",
                borderRadius: "2px",
                width: "220px",
                height: "48px"
              }
            },
            children: {
              buttonLabel: getLabel({
                labelName: "Clear Filter",
                labelKey: "Clear Filter"
              })
            },
            onClickDefination: {
              action: "condition",
              callBack: clearFilter
            }
          }
        }),
        applicationsCard: {
          uiFramework: "custom-molecules",
          name: "my-applications-stakeholder",
          componentPath: "Table",
          props: {
            columns: [
              {
                name: "Application No", labelKey: "BPA_COMMON_TABLE_COL_APP_NO"
              },
              {
                name: "Module/Service", labelKey: "BPA_COL_MODULE_SERVICE"
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
              }
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
            //  rowsPerPageOptions: [10, 15, 20],
             // pagination: true,
              onRowClick: (row, index) => {
                onRowClick(row);
              },
              serverSide: false,
              //count: 10000,
              // onTableChange: (action, tableState) => {
              //   switch (action) {
              //     case 'changePage':
              //       changePage(tableState);
              //       break;
              //   }
              // }
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
      }
    }
  }
};

export const changePage = async (tableState) => {
  let state = store.getState();
  let typeOfService = get(
    state.screenConfiguration.preparedFinalObject,
    "filterData[0].applicationType"
  );
  let filterServiceType = get(
    state.screenConfiguration.preparedFinalObject,
    "filterData[0].serviceType"
  );
  let filterStatus = get(
    state.screenConfiguration.preparedFinalObject,
    "filterData[0].status"
  );

  let searchConvertedArray = [];
  let sortConvertedArray = [];
  const queryObj = [
    {
      key: "limit",
      value: -1
    },
    {
      key: "offset",
      value: 0
    }
  ];
  if ((typeOfService == "BUILDING_PLAN_SCRUTINY") || (typeOfService == "BUILDING_OC_PLAN_SCRUTINY")) {
    if (filterServiceType) {
      queryObj.push({
        key: "servicetype",
        value: filterServiceType
      });
    } 
    queryObj.push({
      key: "applicationType",
      value: typeOfService
    });
  }

  if (filterStatus) {
    queryObj.push(
      {
        key: "status",
        value: filterStatus
      },
      {
        key: "tenantId",
        value: getTenantId()
      }
    );

  }
  
  if ((typeOfService === "BUILDING_PLAN_SCRUTINY") || typeOfService === "BUILDING_OC_PLAN_SCRUTINY") {
    let userInfo = JSON.parse(getUserInfo());
    let mobileNumber = get(userInfo, "mobileNumber");
    queryObj.push({
      key: "requestor",
      value: mobileNumber
    });
    const bpaResponse = await getAppSearchResults(queryObj);
    if (bpaResponse && bpaResponse.Bpa && bpaResponse.Bpa.length > 0) {
      const businessIdToOwnerMappingForBPA = await getWorkFlowDataForBPA(bpaResponse.Bpa);
      bpaResponse.Bpa.forEach(element => {
        let status = getTextToLocalMapping("WF_BPA_" + get(element, "status"));
        let service = getTextToLocalMapping("BPA_APPLICATIONTYPE_" + get(element, "applicationType"));
        service += " - " + getTextToLocalMapping("BPA_SERVICETYPE_" + get(element, "serviceType"));
        let modifiedTime = element.auditDetails.lastModifiedTime;
        let primaryowner = "-";
        let businessService = get(element, "businessService", null);
        let type; 
        if(businessService == "BPA_LOW" ) { type = "LOW" } else if(businessService == "BPA") { type = "HIGH" }
        let owners = get(element, "owners", [])
        owners.map(item => {
          if (item.isPrimaryOwner) {
            primaryowner = item.name;
          }
        });
        searchConvertedArray.push({
          ["BPA_COMMON_TABLE_COL_APP_NO"]: element.applicationNo || "-",
          ["BPA_COMMON_TABLE_COL_STATUS_LABEL"]: status || "-",
          ["BPA_COL_MODULE_SERVICE"]: businessService == "BPA_OC" ? "Occupancy Certificate New Building Construction" : "Building permit new construction",
          ["BPA_COMMON_SLA"]: get(businessIdToOwnerMappingForBPA[element.applicationNo], "sla", null) || "-",
          ["BPA_COL_ASSIGNEDTO"]: get(businessIdToOwnerMappingForBPA[element.applicationNo], "assignee", null) || "-",
          applicationType: getBpaTextToLocalMapping("BPA_APPLY_SERVICE"),
          modifiedTime: modifiedTime,
          sortNumber: 1,
          serviceType: businessService, //get(element, "serviceType"),
          tenantId: get(element, "tenantId", null),
          type: type
        })
      });
    }
  } else {
    const response = await getSearchResults(queryObj);
    if (response && response.Licenses && response.Licenses.length > 0) {
      const businessIdToOwnerMapping = await getWorkFlowData(response.Licenses);
      response.Licenses.forEach(element => {
        let service = getTextToLocalMapping("MODULE_" + get(element, "businessService"));
        let status = getTextToLocalMapping("WF_ARCHITECT_" + get(element, "status"));
        let modifiedTime = element.auditDetails.lastModifiedTime;
        let licensetypeFull =
          element.tradeLicenseDetail.tradeUnits[0].tradeType;
        if (licensetypeFull.split(".").length > 1) {
          service += " - " + getTextToLocalMapping(`TRADELICENSE_TRADETYPE_${getTransformedLocale(licensetypeFull.split(".")[0])}`);
        }
        searchConvertedArray.push({
          ["BPA_COMMON_TABLE_COL_APP_NO"]: element.applicationNumber || "-",
          ["BPA_COMMON_TABLE_COL_STATUS_LABEL"]: status || "-",
          ["BPA_COL_MODULE_SERVICE"]: "Registration \n Stakeholder Registration",
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
  }

  sortConvertedArray = [].slice.call(searchConvertedArray).sort(function (a, b) {
    return new Date(b.modifiedTime) - new Date(a.modifiedTime) || a.sortNumber - b.sortNumber;
  });
  store.dispatch(
    handleField(
      "my-applications-stakeholder",
      "components.div.children.applicationsCard",
      "props.data",
      sortConvertedArray
    ));
    store.dispatch(
      handleField(
        "my-applications-stakeholder",
        "components.div.children.applicationsCard",
        "props.rows",
        sortConvertedArray.length
      )
    );
};

const onRowClick = rowData => {
  const environment = process.env.NODE_ENV === "production" ? "citizen" : "";
  const origin =  process.env.NODE_ENV === "production" ? window.location.origin + "/" : window.location.origin;
  if (rowData[6] === "BPAREG") {
    switch (rowData[4]) {
      case "INITIATED":
        window.location.assign(`${origin}${environment}/bpastakeholder/apply?applicationNumber=${rowData[0]}&tenantId=${rowData[5]}`)
        break;
      default:
        window.location.assign(`${origin}${environment}/bpastakeholder/search-preview?applicationNumber=${rowData[0]}&tenantId=${rowData[5]}`)
    }
  } else if ((rowData[6] === "BPA") || rowData[6] == "BPA_LOW") {
    switch (rowData[4]) {
      case "Initiated":
        window.location.assign(`${origin}${environment}/egov-bpa/apply?applicationNumber=${rowData[0]}&tenantId=${rowData[5]}`);
        break;
      default:
        window.location.assign(`${origin}${environment}/egov-bpa/search-preview?applicationNumber=${rowData[0]}&tenantId=${rowData[5]}&type=${rowData[7]}`);
    }
  } else {
    switch (rowData[4]) {
      case "Initiated":
        window.location.assign(`${origin}${environment}/oc-bpa/apply?applicationNumber=${rowData[0]}&tenantId=${rowData[5]}`);
        break;
      default:
        window.location.assign(`${origin}${environment}/oc-bpa/search-preview?applicationNumber=${rowData[0]}&tenantId=${rowData[5]}`);
    }
  }
};

export default screenConfig;
