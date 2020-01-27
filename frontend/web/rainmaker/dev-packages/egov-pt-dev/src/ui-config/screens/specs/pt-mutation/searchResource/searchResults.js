
import React from "react";
import {
  sortByEpoch,
  getEpochForDate,
  getTextToLocalMapping
} from "../../utils";
import store from "ui-redux/store";
import {setRoute} from "egov-ui-kit/redux/app/actions";
import {
  getLocalization,
  getTenantId
} from "egov-ui-kit/utils/localStorageUtils";
import {
  getLocaleLabels,
  getTransformedLocalStorgaeLabels
} from "egov-ui-framework/ui-utils/commons";

const getLocalTextFromCode = localCode => {
  return JSON.parse(getLocalization("localization_en_IN")).find(
    item => item.code === localCode
  );
};

export const textToLocalMapping = {
  "Property Tax Unique Id": getLocaleLabels(
    "Property Tax Unique Id",
    "PT_COMMON_TABLE_COL_PT_ID",
    getTransformedLocalStorgaeLabels()
  ),
  "Owner Name": getLocaleLabels(
    "Owner Name",
    "PT_COMMON_TABLE_COL_OWNER_NAME",
    getTransformedLocalStorgaeLabels()
  ),
  "Guardian Name": getLocaleLabels(
    "Guardian Name",
    "PT_GUARDIAN_NAME",
    getTransformedLocalStorgaeLabels()
  ),
  "Existing Property Id": getLocaleLabels(
    "Existing Property Id",
    "PT_COMMON_COL_EXISTING_PROP_ID",
    getTransformedLocalStorgaeLabels()
  ),
  "Address": getLocaleLabels(
    "Address",
    "PT_COMMON_COL_ADDRESS",
    getTransformedLocalStorgaeLabels()
  ),
  "Application No": getLocaleLabels(
    "Application No.",
    "PT_COMMON_COL_APPLICATION_NO",
    getTransformedLocalStorgaeLabels()
  ),
  "Application Type": getLocaleLabels(
    "Application Type",
    "PT_COMMON_COL_APPLICATION_TYPE",
    getTransformedLocalStorgaeLabels()
  ),
  Status: getLocaleLabels(
    "Status",
    "PT_COMMON_TABLE_COL_STATUS_LABEL",
    getTransformedLocalStorgaeLabels()
  ),
  INITIATED: getLocaleLabels(
    "Initiated,",
    "PT_INITIATED",
    getTransformedLocalStorgaeLabels()
  ),
  APPLIED: getLocaleLabels(
    "Applied",
    "PT_APPLIED",
    getTransformedLocalStorgaeLabels()
  ),
  DOCUMENTVERIFY: getLocaleLabels(
    "Pending for Document Verification",
    "WF_PT_DOCUMENTVERIFY",
    getTransformedLocalStorgaeLabels()
  ),
  APPROVED: getLocaleLabels(
    "Approved",
    "PT_APPROVED",
    getTransformedLocalStorgaeLabels()
  ),
  REJECTED: getLocaleLabels(
    "Rejected",
    "PT_REJECTED",
    getTransformedLocalStorgaeLabels()
  ),
  CANCELLED: getLocaleLabels(
    "Cancelled",
    "PT_CANCELLED",
    getTransformedLocalStorgaeLabels()
  ),
  PENDINGAPPROVAL: getLocaleLabels(
    "Pending for Approval",
    "WF_PT_PENDINGAPPROVAL",
    getTransformedLocalStorgaeLabels()
  ),
  PENDINGPAYMENT: getLocaleLabels(
    "Pending payment",
    "WF_PT_PENDINGPAYMENT",
    getTransformedLocalStorgaeLabels()
  ),
  FIELDINSPECTION: getLocaleLabels(
    "Pending for Field Inspection",
    "WF_PT_FIELDINSPECTION",
    getTransformedLocalStorgaeLabels()
  ),
  "Search Results for PT Applications": getLocaleLabels(
    "Search Results for PT Applications",
    "PT_HOME_SEARCH_RESULTS_TABLE_HEADING",
    getTransformedLocalStorgaeLabels()
  )
};

export const searchPropertyTable = {
  uiFramework: "custom-molecules",
  // moduleName: "egov-tradelicence",
  componentPath: "Table",
  visible: false,
  props: {
    // data: [],
    columns: [
      getTextToLocalMapping("Property Tax Unique Id"),
      getTextToLocalMapping("Owner Name"),
      getTextToLocalMapping("Guardian Name"),
      getTextToLocalMapping("Existing Property Id"),
      getTextToLocalMapping("Address"),
      {
        name: getTextToLocalMapping("Status"),
        options: {
          filter: false,
          customBodyRender: value => (
            <span
              style={
                value === "ACTIVE" ? { color: "green" } : { color: "red" }
              }
            >
              {getTextToLocalMapping(value)}
            </span>
          )
        }
      },
      {
        name: "tenantId",
        options: {
          display: false
        }
      }
    ],
    title: getTextToLocalMapping("Search Results for PT Applications"),
    options: {
      filter: false,
      download: false,
      responsive: "stacked",
      selectableRows: false,
      hover: true,
      rowsPerPageOptions: [10, 15, 20],
      onRowClick: (row, index,dispatch) => {
        onPropertyTabClick(row,dispatch);
      }
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
};

export const searchApplicationTable = {
  uiFramework: "custom-molecules",
  // moduleName: "egov-tradelicence",
  componentPath: "Table",
  visible: false,
  props: {
    // data: [],
    columns: [
      getTextToLocalMapping("Application No"),
      getTextToLocalMapping("Property Tax Unique Id"),
      getTextToLocalMapping("Application Type"),
      getTextToLocalMapping("Owner Name"),
      getTextToLocalMapping("Address"),
      {
        name: getTextToLocalMapping("Status"),
        options: {
          filter: false,
          customBodyRender: value => (
            <span
              style={
                value === "ACTIVE" ? { color: "green" } : { color: "red" }
              }
            >
              {getTextToLocalMapping(value)}
            </span>
          )
        }
      },
      {
        name: "tenantId",
        options: {
          display: false
        }
      }
    ],
    title: getTextToLocalMapping("Search Results for PT Applications"),
    options: {
      filter: false,
      download: false,
      responsive: "stacked",
      selectableRows: false,
      hover: true,
      rowsPerPageOptions: [10, 15, 20],
      onRowClick: (row, index,dispatch) => {
        onApplicationTabClick(row,dispatch);
      }
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
};



const onPropertyTabClick = (rowData,dispatch) => {
  switch (rowData[5]) {
    case "INITIATED":
      window.location.href = `apply?applicationNumber=${rowData[0]}&tenantId=${
        rowData[6]
      }`;
      break;
    default:
     // window.location.href = `search-preview?applicationNumber=${
     // window.location.pathname=`property-tax/property/${rowData[0]}/${rowData[6]}`;
      store.dispatch(setRoute(`/property-tax/property/${rowData[0]}/${rowData[6]}`));
    //   rowData[0]
    // }&tenantId=${rowData[6]}`; 
      break;
  }
};

const onApplicationTabClick = (rowData,dispatch) => {
  if (rowData[5]==="INITIATED") {
      window.location.href = `apply?applicationNumber=${rowData[1]}&tenantId=${
        rowData[6]
      }`;
  }
    else{
     // window.location.href = `search-preview?applicationNumber=${
    //  window.location.pathname=`property-tax/property/${rowData[1]}/${rowData[6]}`;
      store.dispatch(setRoute(`/property-tax/property/${rowData[1]}/${rowData[6]}`));
    //   rowData[0]
    // }&tenantId=${rowData[6]}`; 
  }
};