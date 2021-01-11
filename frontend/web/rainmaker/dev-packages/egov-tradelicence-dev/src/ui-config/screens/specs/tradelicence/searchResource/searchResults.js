import { LabelContainer } from "egov-ui-framework/ui-containers";
import { getLocaleLabels, getStatusKey } from "egov-ui-framework/ui-utils/commons";
import { routeTo } from "egov-ui-kit/utils/PTCommon/FormWizardUtils/formActionUtils";
import React from "react";
import { getEpochForDate, sortByEpoch } from "../../utils";

export const searchResults = {
  uiFramework: "custom-molecules",
  componentPath: "Table",
  visible: false,
  props: {
    columns: [
      {
        labelName: "Application No",
        labelKey: "TL_COMMON_TABLE_COL_APP_NO",
        options: {
          filter: false,
          customBodyRender: (value, tableMeta) => (
            <a href="javascript:void(0)" onClick={() => onRowClick(tableMeta.rowData)}>{value}</a>
          )
        }
      },
      {
        labelName: "License No",
        labelKey: "TL_COMMON_TABLE_COL_LIC_NO"
      },
      {
        labelName: "Trade Name",
        labelKey: "TL_COMMON_TABLE_COL_TRD_NAME"
      },
      {
        labelName: "Owner Name",
        labelKey: "TL_COMMON_TABLE_COL_OWN_NAME"
      },
      {
        labelName: "Application Date",
        labelKey: "TL_COMMON_TABLE_COL_APP_DATE"
      },
      {
        labelName: "Financial Year",
        labelKey: "TL_COMMON_TABLE_COL_FIN_YEAR"
      },
      {
        labelName: "Application Type",
        labelKey: "TL_COMMON_TABLE_COL_APP_TYPE",
        options: {
          filter: false,
          customBodyRender: value => (
            <span>
              {getLocaleLabels(value, value)}
            </span>
          )
        }
      },
      {
        labelName: "Status",
        labelKey: "TL_COMMON_TABLE_COL_STATUS",
        options: {
          filter: false,
          customBodyRender: value => (
            <LabelContainer
              style={
                value.includes("APPROVED") ? { color: "green" } : { color: "red" }
              }
              labelKey={getStatusKey(value).labelKey}
              labelName={getStatusKey(value).labelName}
            />
          )
        }
      },
      {
        labelName: "Tenant Id",
        labelKey: "TENANT_ID",
        options: {
          display: false
        }
      },
      {
        labelName: "Status",
        labelKey: "TL_COMMON_TABLE_COL_STATUS",
        options: {
          display: false
        }
      },

    ],
    title: {
      labelName: "Search Results for Trade License Applications",
      labelKey: "TL_HOME_SEARCH_RESULTS_TABLE_HEADING"
    },
    rows: "",
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
  switch (rowData[7]) {
    case "INITIATED":
      if(rowData[6]=="TL_TYPE_RENEWAL"){
        routeTo(`apply?applicationNumber=${rowData[0]}&licenseNumber=${rowData[1]}&action=EDITRENEWAL&tenantId=${
          rowData[8]
          }`);
      }else{
        routeTo(`apply?applicationNumber=${rowData[0]}&tenantId=${
          rowData[8]
          }`);
      }
      break;
    default:
      routeTo(`search-preview?applicationNumber=${
        rowData[0]
        }&tenantId=${rowData[8]}`);
      break;
  }
};
