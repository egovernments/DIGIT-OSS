import { download } from "egov-common/ui-utils/commons";
import { getLocaleLabels, getTransformedLocale } from "egov-ui-framework/ui-utils/commons";
import { setRoute } from "egov-ui-kit/utils/commons";
import React from "react";
import {
  getEpochForDate, sortByEpoch
} from "../../utils";

export const searchResults = {
  uiFramework: "custom-molecules",
  componentPath: "Table",
  visible: false,
  props: {
    columns: [

      {
        labelName: "Receipt No.",
        labelKey: "CR_COMMON_TABLE_COL_RECEIPT_NO",
        options: {
          filter: false,
          customBodyRender: (value, tableMeta, updateValue) => (
            <div onClick={value => {
              const receiptQueryString = [
                { key: "receiptNumbers", value: tableMeta.rowData[0] },
                { key: "tenantId", value: tableMeta.rowData[8] },
                { key: "businessService", value: tableMeta.rowData[9] }
              ]
              download(receiptQueryString, "download", tableMeta.rowData[7] || 'consolidatedreceipt', 'PAYMENT');
            }} style={{ color: '#2196F3' }}>
              {value}
            </div>
          )
        }
      },

      {
        labelName: "Date",
        labelKey: "CR_COMMON_TABLE_COL_DATE"
      },
      {
        labelName: "Consumer code",
        labelKey: "CR_COMMON_TABLE_CONSUMERCODE"
      },
      {
        labelName: "Payee Name",
        labelKey: "CR_COMMON_TABLE_COL_PAYEE_NAME"
      },
      {
        labelName: "Service Type",
        labelKey: "CR_SERVICE_TYPE_LABEL"
      },
      {
        labelName: "Status",
        labelKey: "CR_COMMON_TABLE_COL_STATUS",
        options: {
          filter: false,
          customBodyRender: value => (
            <span style={{ color: '#000000' }}>
              {getLocaleLabels("NA", getTransformedLocale(`RC_${value}`))}
            </span>
          )
        }
      },
      {
        labelName: "Action",
        labelKey: "CR_COMMON_TABLE_ACTION",
        options: {
          filter: false,
          customBodyRender: (value, tableMeta, updateValue) => (
            <div onClick={value => {
              if (tableMeta.rowData[6] == 'CANCEL') {

                setRoute(`/receipts/viewReceipt?receiptNumbers=${tableMeta.rowData[0]}&tenantId=${tableMeta.rowData[8]}&businessService=${tableMeta.rowData[9]}`);
              }
            }} style={{ color: tableMeta.rowData[6] == 'CANCEL' ? 'rgb(254, 122, 81)' : "inherit", cursor: tableMeta.rowData[6] == 'CANCEL' ? 'pointer' : "initial" }}>
              {getLocaleLabels("NA", `RC_${value}`)}
            </div>
          )
        }
      },
      {
        labelName: "Receipt Key",
        labelKey: "RECEIPT_KEY",
        options: {
          display: false
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
        labelName: "SERVICE TYPE",
        labelKey: "SERVICE_TYPE",
        options: {
          display: false
        }
      },

    ],
    title: {
      labelKey: "COMMON_TABLE_SEARCH_RESULT_RECIEPT",
      labelName: "COMMON_TABLE_SEARCH_RESULT_RECIEPT",
    },
    rows: "",
    options: {
      filter: false,
      download: false,
      responsive: "stacked",
      selectableRows: false,
      hover: true,
      rowsPerPageOptions: [10, 15, 20],
    },
    customSortColumn: {
      column: "Date",
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
