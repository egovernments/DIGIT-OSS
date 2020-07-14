import React from "react";
import {
  sortByEpoch,
  getEpochForDate,
  getTextToLocalMapping
} from "../../utils";

export const searchResults = {
  uiFramework: "custom-molecules",
  componentPath: "Table",
  visible: false,
  props: {
    columns: [
      {
        name: "Application No", labelKey: "BPA_COMMON_TABLE_COL_APP_NO"
      },
      {
        name: "ApplicationType", labelKey: "BPA_BASIC_DETAILS_APPLICATION_TYPE_LABEL"
      },
      {
        name: "NocType", labelKey: "NOC_SEARCH_TYPE_LABEL"
      },
      {
        name: "Status", labelKey: "BPA_COMMON_TABLE_COL_STATUS_LABEL",
        options: {
          filter: false,
          customBodyRender: value => (
            <span
              style={
                (value === "APPROVED" || value === "AUTO_APPROVED") ? { color: "green" } : value === "INPROGRESS" ? { color: "orange" } : { color: "red" }
              }
            >
              {getTextToLocalMapping(value)}
            </span>
          )
        }
      },
      {
        name: "Tenant Id",
        labelKey: "TENANT_ID",
        options: {
          display: false
        }
      }
    ],
    title: { labelKey: "NOC_HOME_SEARCH_RESULTS_TABLE_HEADING", labelName: "Search Results for NOC Applications" },
    rows: "",
    options: {
      filter: false,
      download: false,
      responsive: "stacked",
      selectableRows: false,
      hover: true,
      viewColumns: false,
      rowsPerPageOptions: [10, 15, 20],
      onRowClick: (row, index) => {
        onRowClick(row);
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

const onRowClick = rowData => {
  const state = rowData[3];
  const applicationNumber = rowData[0];
  const tenantId = rowData[4];
    const environment = process.env.NODE_ENV === "production" ? "employee" : "";
    const origin = process.env.NODE_ENV === "production" ? window.location.origin + "/" : window.location.origin;
    switch (state) {
      case "INITIATED":
        window.location.assign(`${origin}${environment}/egov-bpa/noc-search-preview?applicationNumber=${applicationNumber}&tenantId=${tenantId}`);
        break;
      default:
        window.location.assign(`${origin}${environment}/egov-bpa/noc-search-preview?applicationNumber=${applicationNumber}&tenantId=${tenantId}`);
        break;
    }
};
