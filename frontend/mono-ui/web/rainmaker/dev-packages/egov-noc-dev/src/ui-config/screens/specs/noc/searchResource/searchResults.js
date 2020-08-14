import React from "react";
import {
  sortByEpoch,
  getEpochForDate,
  getTextToLocalMapping
} from "../../utils";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";

export const searchResults = {
  uiFramework: "custom-molecules",
  componentPath: "Table",
  visible: false,
  props: {
    columns: [
      {
        name: "Application No", labelKey: "NOC_APP_NO_LABEL"
      },
      {
        name: "Source model application number", labelKey: "NOC_SOURCE_MODULE_NUMBER"
      },
      {
        name: "Source Module", labelKey: "NOC_MODULE_SOURCE_LABEL"
      },
      {
        name: "Status", labelKey: "NOC_STATUS_LABEL",
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
  const tenantId = getTenantId();;
  const environment = process.env.NODE_ENV === "production" ? "employee" : "";
  const origin = process.env.NODE_ENV === "production" ? window.location.origin + "/" : window.location.origin;
  switch (state) {
    case "INITIATED":
      window.location.assign(`${origin}${environment}/noc/search-preview?applicationNumber=${applicationNumber}&tenantId=${tenantId}`);
      break;
    default:
      window.location.assign(`${origin}${environment}/noc/search-preview?applicationNumber=${applicationNumber}&tenantId=${tenantId}`);
      break;
  }
};
