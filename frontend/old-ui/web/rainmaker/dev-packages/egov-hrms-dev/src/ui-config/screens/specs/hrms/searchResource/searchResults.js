import {
  getLocaleLabels,
  getTransformedLocalStorgaeLabels
} from "egov-ui-framework/ui-utils/commons";
import { routeTo } from "egov-ui-kit/utils/PTCommon/FormWizardUtils/formActionUtils";

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
    }
  }
};

const onRowClick = rowData => {
  routeTo(`view?employeeID=${rowData[0]}&tenantId=${rowData[5]}`);
};
