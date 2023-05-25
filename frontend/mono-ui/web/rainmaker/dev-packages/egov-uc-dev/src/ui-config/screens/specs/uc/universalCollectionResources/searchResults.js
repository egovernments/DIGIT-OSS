import React from "react";
import {
  sortByEpoch,
  getEpochForDate,
  getTextToLocalMapping
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
                  { key: "tenantId", value: tableMeta.rowData[7] },
                  { key: "businessService", value:tableMeta.rowData[8] } 
                ]
                download(receiptQueryString , "download" ,tableMeta.rowData[6]||"consolidatedreceipt",'PAYMENT') ;
              }}>
       
              <a href="javascript:void(0)" >{value}</a>
            </div>
          )
        }
      },
      {
        labelName: "Consumer Code",
        labelKey: "UC_COMMON_TABLE_COL_CONSUMERCODE"
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
        labelKey: "UC_COMMON_TABLE_COL_STATUS",
        options: {
          display: false,
          viewColumns  :false
        }
      },
      {
        labelName: "Tenant Id",
        labelKey: "TENANT_ID",
        options: {
          display: false,
          viewColumns  :false
        }
      }, {
        labelName: "Service Type",
        labelKey: "SERVICE",
        options: {
          display: false
        }
      }
      
    ],
    title: {
      labelName: "Search Results for Payments",
      labelKey: "COMMON_TABLE_SEARCH_RESULT_PAYMENTS"
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

const onRowClick = rowData => {
  const receiptQueryString = [
    { key: "receiptNumbers", value:  rowData[0]},
    { key: "tenantId", value: rowData[7] }
  ]
  download(receiptQueryString);
};
