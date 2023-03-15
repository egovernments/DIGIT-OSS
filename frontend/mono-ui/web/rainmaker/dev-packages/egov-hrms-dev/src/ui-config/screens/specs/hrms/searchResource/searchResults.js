
import { LabelContainer } from "egov-ui-framework/ui-containers";
import { getLocaleLabels, getStatusKey, getTransformedLocalStorgaeLabels } from "egov-ui-framework/ui-utils/commons";
import { routeTo } from "egov-ui-kit/utils/PTCommon/FormWizardUtils/formActionUtils";
import React from "react";
import { getEpochForDate,  sortByEpoch } from "../../utils";

export const getTextToLocalMapping = label => {
  const localisationLabels = getTransformedLocalStorgaeLabels();
  switch (label) {
    case "Employee ID":
      return getLocaleLabels(
        "Employee ID",
        "HR_COMMON_TABLE_COL_EMP_ID",
        localisationLabels
      );
    case "Name":
      return getLocaleLabels(
        "Name",
        "HR_COMMON_TABLE_COL_NAME",
        localisationLabels
      );
    case "Role":
      return getLocaleLabels(
        "Role",
        "HR_COMMON_TABLE_COL_ROLE",
        localisationLabels
      );
    case "Designation":
      return getLocaleLabels(
        "Designation",
        "HR_COMMON_TABLE_COL_DESG",
        localisationLabels
      );
    case "Department":
      return getLocaleLabels(
        "Department",
        "HR_COMMON_TABLE_COL_DEPT",
        localisationLabels
      );
    case "Status":
      return getLocaleLabels(
        "Status",
        "HR_COMMON_TABLE_COL_STATUS",
        localisationLabels
      );
    case "Search Results for Employee":
      return getLocaleLabels(
        "Search Results for Employee",
        "HR_HOME_SEARCH_RESULTS_TABLE_HEADING",
        localisationLabels
      );
    case "Tenant ID":
      return getLocaleLabels(
        "Tenant ID",
        "HR_COMMON_TABLE_COL_TENANT_ID",
        localisationLabels
      );
  }
};

export const searchResults = {
  uiFramework: "custom-molecules",
  componentPath: "Table",
  visible: false,
  props: {
    columns: [
      {
        labelName: "Employee ID",
        labelKey: "HR_COMMON_TABLE_COL_EMP_ID"
      },
      {
        labelName: "Name",
        labelKey: "HR_COMMON_TABLE_COL_NAME"
      },
      {
        labelName: "Role",
        labelKey: "HR_COMMON_TABLE_COL_ROLE"
      },
      {
        labelName: "Designation",
        labelKey: "HR_COMMON_TABLE_COL_DESG"
      },
      {
        labelName: "Department",
        labelKey: "HR_COMMON_TABLE_COL_DEPT"
      },
      {
        labelName: "Status",
        labelKey: "HR_COMMON_TABLE_COL_STATUS",
        options: {
          filter: false,
          customBodyRender: value => (
            <LabelContainer
              style={
                value === "ACTIVE" ? { color: "green" } : { color: "red" }
              }
              labelKey={getStatusKey(value).labelKey}
              labelName={getStatusKey(value).labelName}
            />
          )
        }
      },
      {
        labelName: "Tenant ID",
        labelKey: "HR_COMMON_TABLE_COL_TENANT_ID",
        name: "tenantId",
        options: {
          display: false
        }
      }
    ],
    title: {
      labelName: "Search Results for Employee",
      labelKey: "HR_HOME_SEARCH_RESULTS_TABLE_HEADING"
    },
    rows: "",
    options: {
      filter: false,
      download: false,
      responsive: "stacked",
      selectableRows: false,
      hover: true,
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
  routeTo(`view?employeeID=${rowData[0]}&tenantId=${rowData[6]}`);
};
