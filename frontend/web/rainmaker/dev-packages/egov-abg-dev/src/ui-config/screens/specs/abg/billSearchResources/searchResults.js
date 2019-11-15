import React from "react";
import {
  sortByEpoch,
  getEpochForDate,
  getTextToLocalMapping
} from "../../utils";
import { generateSingleBill } from "../../utils/receiptPdf";

export const searchResults = {
  uiFramework: "custom-molecules",
  componentPath: "Table",
  visible: false,
  props: {
    columns: [
      {
        name: getTextToLocalMapping("Bill No."),
        options: {
          filter: false,
          customBodyRender: (value) => (
            <div onClick={() => generateSingleBill(value)}>
              <a>{value}</a>
            </div>
          )
        }
      },
      {
        name: "Consumer Code",
        options: {
          display: false
        }
      },
      getTextToLocalMapping("Consumer Name"),
      getTextToLocalMapping("Bill Date"),
      getTextToLocalMapping("Bill Amount[INR]"),
      getTextToLocalMapping("Status"),
      {
        name: getTextToLocalMapping("Action"),
        options: {
          filter: false,

          customBodyRender: (value, tableMeta, updateValue) => (
            <div
              style={{
                color: "#FE7A51",
                cursor: "pointer"
              }}
              onClick={() => {
                const url =
                  process.env.NODE_ENV === "development"
                    ?`/egov-common/pay?consumerCode=${
                        tableMeta.rowData[1]
                      }&tenantId=${tableMeta.rowData[7]}&businessService=${
                        tableMeta.rowData[0].split("-")[0]
                      }` 
                    :
                    `/employee/egov-common/pay?consumerCode=${
                        tableMeta.rowData[1]
                      }&tenantId=${tableMeta.rowData[7]}&businessService=${
                        tableMeta.rowData[0].split("-")[0]
                      }` ;
                window.location.href = `${window.origin}${url}`;
              }}
            >
            {getTextToLocalMapping(value).toUpperCase()}
            </div>
          )
        }
      },
      {
        name: "tenantId",
        options: {
          display: false
        }
      }
    ],
    title: getTextToLocalMapping("Search Results for Bill"),
    options: {
      filter: false,
      download: false,
      responsive: "stacked",
      selectableRows: false,
      hover: true,
      rowsPerPageOptions: [10, 15, 20]
    },
    customSortColumn: {
      column: "Bill Date",
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
