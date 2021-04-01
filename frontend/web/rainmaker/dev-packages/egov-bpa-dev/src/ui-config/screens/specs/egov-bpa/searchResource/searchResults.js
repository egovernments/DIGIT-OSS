import React from "react";
import { Link } from "react-router-dom";
import get from "lodash/get";
import {
  sortByEpoch,
  getEpochForDate,
  getBpaTextToLocalMapping
} from "../../utils";
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
  "Application No": getLocaleLabels(
    "Application No",
    "NOC_COMMON_TABLE_COL_APP_NO_LABEL",
    getTransformedLocalStorgaeLabels()
  ),
  "NOC No": getLocaleLabels(
    "NOC No",
    "NOC_COMMON_TABLE_COL_NOC_NO_LABEL",
    getTransformedLocalStorgaeLabels()
  ),
  "NOC Type": getLocaleLabels(
    "NOC Type",
    "NOC_TYPE_LABEL",
    getTransformedLocalStorgaeLabels()
  ),
  "Owner Name": getLocaleLabels(
    "Owner Name",
    "BPA_COMMON_TABLE_COL_OWN_NAME_LABEL",
    getTransformedLocalStorgaeLabels()
  ),
  "Application Date": getLocaleLabels(
    "Application Date",
    "BPA_COMMON_TABLE_COL_APP_DATE_LABEL",
    getTransformedLocalStorgaeLabels()
  ),
  Status: getLocaleLabels(
    "Status",
    "BPA_COMMON_TABLE_COL_STATUS_LABEL",
    getTransformedLocalStorgaeLabels()
  ),
  INITIATED: getLocaleLabels(
    "Initiated,",
    "NOC_INITIATED",
    getTransformedLocalStorgaeLabels()
  ),
  APPLIED: getLocaleLabels(
    "Applied",
    "NOC_APPLIED",
    getTransformedLocalStorgaeLabels()
  ),
  DOCUMENTVERIFY: getLocaleLabels(
    "Pending for Document Verification",
    "WF_FIRENOC_DOCUMENTVERIFY",
    getTransformedLocalStorgaeLabels()
  ),
  APPROVED: getLocaleLabels(
    "Approved",
    "NOC_APPROVED",
    getTransformedLocalStorgaeLabels()
  ),
  REJECTED: getLocaleLabels(
    "Rejected",
    "NOC_REJECTED",
    getTransformedLocalStorgaeLabels()
  ),
  CANCELLED: getLocaleLabels(
    "Cancelled",
    "NOC_CANCELLED",
    getTransformedLocalStorgaeLabels()
  ),
  PENDINGAPPROVAL: getLocaleLabels(
    "Pending for Approval",
    "WF_FIRENOC_PENDINGAPPROVAL",
    getTransformedLocalStorgaeLabels()
  ),
  PENDINGPAYMENT: getLocaleLabels(
    "Pending payment",
    "WF_FIRENOC_PENDINGPAYMENT",
    getTransformedLocalStorgaeLabels()
  ),
  FIELDINSPECTION: getLocaleLabels(
    "Pending for Field Inspection",
    "WF_FIRENOC_FIELDINSPECTION",
    getTransformedLocalStorgaeLabels()
  ),
  "Search Results for BPA Applications": getLocaleLabels(
    "Search Results for BPA Applications",
    "BPA_HOME_SEARCH_RESULTS_TABLE_HEADING",
    getTransformedLocalStorgaeLabels()
  )
};

export const searchResults = {
  uiFramework: "custom-molecules",
  // moduleName: "egov-tradelicence",
  componentPath: "Table",
  visible: false,
  props: {
    columns: [
      {
        name: "Application No", labelKey: "BPA_COMMON_TABLE_COL_APP_NO"
      },
      {
        name: "Owner Name", labelKey: "BPA_COMMON_TABLE_COL_OWN_NAME_LABEL"
      },
      {
        name: "Application Date", labelKey: "BPA_COMMON_TABLE_COL_APP_DATE_LABEL"
      },
      {
        name: "Status", labelKey: "BPA_COMMON_TABLE_COL_STATUS_LABEL",
        options: {
          filter: false,
          customBodyRender: value => (
            <span
              style={
                value === "Approved" ? { color: "green" } : { color: "red" }
              }
            >
              {value}
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
      },
      {
        name: "serviceType",
        labelKey: "SERVICE_TYPE",
        options: {
          display: false
        }
      }
    ],
    title: { labelKey: "BPA_HOME_SEARCH_RESULTS_TABLE_HEADING", labelName: "Search Results for BPA Applications"},
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
  if(rowData[5] == "BPA_OC") {
    const environment = process.env.NODE_ENV === "production" ? "employee" : "";
    const origin =  process.env.NODE_ENV === "production" ? window.location.origin + "/" : window.location.origin;
    switch (state) {
      case "INITIATED":
        window.location.assign(`${origin}${environment}/oc-bpa/apply?applicationNumber=${applicationNumber}&tenantId=${tenantId}`);
        break;
      default:
        window.location.assign(`${origin}${environment}/oc-bpa/search-preview?applicationNumber=${applicationNumber}&tenantId=${tenantId}`);
        break;
    }
  } else {
    let type = "HIGH";
    if(rowData[5] == "BPA_LOW") {
      type = "LOW"
    }
    switch (state) {
      case "INITIATED":
        window.location.href = `apply?applicationNumber=${applicationNumber}&tenantId=${tenantId}&type=${type}`;
        break;
      default:
        window.location.href = `search-preview?applicationNumber=${applicationNumber}&tenantId=${tenantId}&type=${type}`;
        break;
    }
  }
};
