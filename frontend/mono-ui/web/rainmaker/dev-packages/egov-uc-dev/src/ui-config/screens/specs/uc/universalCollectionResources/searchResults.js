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
        name : getTextToLocalMapping("Receipt No."),
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

      
      getTextToLocalMapping("Payee Name"),
      getTextToLocalMapping("Service Type"),
      getTextToLocalMapping("Date"),
      getTextToLocalMapping("Amount[INR]"),
      getTextToLocalMapping("Status"),
      {
        name: "receiptKey",
        options: {
          display: false
        }
      },
      {
        name: "tenantId",
        options: {
          display: false
        }
      }
    ],
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
