import React from "react";
import {
  sortByEpoch,
  getEpochForDate
} from "../../utils";
import {download} from "egov-common/ui-utils/commons"

export const searchResults = {
  uiFramework: "custom-molecules",
  componentPath: "Table",
  visible: false,
  props: {
    columns: [

      {
        labelName: "Receipt No.",
        labelKey: "UC_COMMON_TABLE_COL_RECEIPT_NO",
        options: {
          filter: false,
          customBodyRender: (value, tableMeta, updateValue) => (
            <div onClick={value => {
                const receiptQueryString = [
                  { key: "receiptNumbers", value:  tableMeta.rowData[0]},
                  { key: "tenantId", value: tableMeta.rowData[7] }
                ]
                download(receiptQueryString , "download" ,tableMeta.rowData[6]) ;
              }}>
              {value}
            </div>
          )
        }
      },
      {
        labelName: "Payee Name",
        labelKey: "UC_COMMON_TABLE_COL_PAYEE_NAME"
      },
      {
        labelName: "Service Type",
        labelKey: "UC_SERVICE_TYPE_LABEL"
      },
      {
        labelName: "Date",
        labelKey: "UC_COMMON_TABLE_COL_DATE"
      },
      {
        labelName: "Amount[INR]",
        labelKey: "UC_COMMON_TABLE_COL_AMOUNT"
      },
      {
        labelName: "Status",
        labelKey: "UC_COMMON_TABLE_COL_STATUS"
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
      }
    ],
    title: {
      labelKey: "COMMON_TABLE_SEARCH_RESULT_RECIEPT",
      labelName: "Search Results for Receipt",
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
