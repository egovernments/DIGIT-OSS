import React from "react";
import {
  sortByEpoch,
  getEpochForDate,
  getTextToLocalMapping,
  } from "../../utils";

import {
  generateSingleBill
} from "../../utils/receiptPdf";


export const searchResults = {
  uiFramework: "custom-molecules",
  // moduleName: "egov-tradelicence",
  componentPath: "Table",
  visible: false,
  props: {
    columns: [
      getTextToLocalMapping("Bill No."),
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
          customBodyRender: value => (
            <span
              style={{
                color: "#FE7A51",
                cursor: "pointer"
              }}
            >
              {getTextToLocalMapping(value)}
            </span>
          )
        }
      },
      {
        name: "tenantId",
        options: {
          display: false
        }
      },
     ],
    title: getTextToLocalMapping("Search Results for Bill"),
    options: {
      filter: false,
      download: false,
      responsive: "stacked",
      selectableRows: false,
      hover: true,
      rowsPerPageOptions: [10, 15, 20],
      onRowClick: (row, index) =>  generateSingleBill(row)
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
