import React from "react";
import { Link } from "react-router-dom";
import get from "lodash/get";
import { sortByEpoch, getEpochForDate } from "../../utils";
import { getLocalization } from "egov-ui-kit/utils/localStorageUtils";

const getLocalTextFromCode = localCode => {
  return JSON.parse(getLocalization("localization_en_IN")).find(
    item => item.code === localCode
  );
};

export const textToLocalMapping = {
  "Application No": get(
    getLocalTextFromCode("NOC_COMMON_TABLE_COL_APP_NO"),
    "message",
    "Application No"
  ),
  "NOC No": get(
    getLocalTextFromCode("NOC_COMMON_TABLE_COL_NOC_NO"),
    "message",
    "NOC No"
  ),
  "Building Name": get(
    getLocalTextFromCode("NOC_COMMON_TABLE_COL_TRD_NAME"),
    "message",
    "Building Name"
  ),
  "Owner Name": get(
    getLocalTextFromCode("NOC_COMMON_TABLE_COL_OWN_NAME"),
    "message",
    "Owner Name"
  ),
  "Application Date": get(
    getLocalTextFromCode("NOC_COMMON_TABLE_COL_APP_DATE"),
    "message",
    "Application Date"
  ),
  Status: get(
    getLocalTextFromCode("NOC_COMMON_TABLE_COL_STATUS"),
    "message",
    "Status"
  ),
  INITIATED: get(getLocalTextFromCode("NOC_INITIATED"), "message", "INITIATED"),
  APPLIED: get(getLocalTextFromCode("NOC_APPLIED"), "message", "APPLIED"),
  PAID: get(
    getLocalTextFromCode("WF_NEWNOC_PENDINGAPPROVAL"),
    "message",
    "PAID"
  ),
  APPROVED: get(getLocalTextFromCode("NOC_APPROVED"), "message", "APPROVED"),
  REJECTED: get(getLocalTextFromCode("NOC_REJECTED"), "message", "REJECTED"),
  CANCELLED: get(getLocalTextFromCode("NOC_CANCELLED"), "message", "CANCELLED"),
  PENDINGAPPROVAL: get(
    getLocalTextFromCode("WF_NEWNOC_PENDINGAPPROVAL"),
    "message",
    "Pending for Approval"
  ),
  PENDINGPAYMENT: get(
    getLocalTextFromCode("WF_NEWNOC_PENDINGPAYMENT"),
    "message",
    "Pending payment"
  ),
  FIELDINSPECTION: get(
    getLocalTextFromCode("WF_NEWNOC_FIELDINSPECTION"),
    "message",
    "Pending for Field Inspection"
  ),
  "Search Results for Fire NOC Applications": get(
    getLocalTextFromCode("NOC_HOME_SEARCH_RESULTS_TABLE_HEADING"),
    "message",
    "Search Results for Fire NOC Applications"
  )
};

export const searchResults = {
  uiFramework: "custom-molecules",
  // moduleName: "egov-tradelicence",
  componentPath: "Table",
  visible: false,
  props: {
    // data: [],
    columns: {
      [get(textToLocalMapping, "Application No")]: {
        format: rowData => {
          return (
            <Link to={onRowClick(rowData)}>
              <span
                style={{
                  color: "#FE7A51"
                }}
              >
                {rowData[get(textToLocalMapping, "Application No")]}
              </span>
            </Link>
          );
        }
      },
      [get(textToLocalMapping, "NOC No")]: {},
      [get(textToLocalMapping, "Building Name")]: {},
      [get(textToLocalMapping, "Owner Name")]: {},
      [get(textToLocalMapping, "Application Date")]: {},
      [get(textToLocalMapping, "Status")]: {}
    },
    title: get(textToLocalMapping, "Search Results for Fire NOC Applications"),
    options: {
      filter: false,
      download: false,
      responsive: "stacked",
      selectableRows: false,
      hover: true,
      rowsPerPageOptions: [10, 15, 20]
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
  switch (rowData[get(textToLocalMapping, "Status")]) {
    case get(textToLocalMapping, "APPLIED"):
    case get(textToLocalMapping, "PENDINGPAYMENT"):
      return `/fire-noc/search-preview?status=pending_payment&role=approver&applicationNumber=${
        rowData[get(textToLocalMapping, "Application No")]
      }&tenantId=${rowData["tenantId"]}`;
    case get(textToLocalMapping, "APPROVED"):
      return `/fire-noc/search-preview?status=approved&role=approver&applicationNumber=${
        rowData[get(textToLocalMapping, "Application No")]
      }&tenantId=${rowData["tenantId"]}`;

    case get(textToLocalMapping, "PAID"):
    case get(textToLocalMapping, "PENDINGAPPROVAL"):
    case get(textToLocalMapping, "FIELDINSPECTION"):
      return `/fire-noc/search-preview?status=pending_approval&role=approver&applicationNumber=${
        rowData[get(textToLocalMapping, "Application No")]
      }&tenantId=${rowData["tenantId"]}`;
    case get(textToLocalMapping, "CANCELLED"):
      return `/fire-noc/search-preview?status=cancelled&role=approver&applicationNumber=${
        rowData[get(textToLocalMapping, "Application No")]
      }&tenantId=${rowData["tenantId"]}`;
    case get(textToLocalMapping, "INITIATED"):
      return process.env.REACT_APP_SELF_RUNNING === "true"
        ? `/egov-ui-framework/fire-noc/taskDetails?applicationNumber=PB-TL-2019-01-24-001390&tenantId=pb.amritsar`
        : `/fire-noc/taskDetails?applicationNumber=PB-TL-2019-01-24-001390&tenantId=pb.amritsar`;
    case get(textToLocalMapping, "REJECTED"):
      return `/fire-noc/search-preview?status=rejected&role=approver&applicationNumber=${
        rowData[get(textToLocalMapping, "Application No")]
      }&tenantId=${rowData["tenantId"]}`;
    default:
      return `/fire-noc/search`;
  }
};
