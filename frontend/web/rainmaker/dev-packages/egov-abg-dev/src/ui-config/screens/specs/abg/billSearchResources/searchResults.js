import React from "react";
import {
  sortByEpoch,
  getEpochForDate,
  getTextToLocalMapping
} from "../../utils";
import { download, downloadBill } from "egov-common/ui-utils/commons";
import {  getLocaleLabels} from "egov-ui-framework/ui-utils/commons";

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
          customBodyRender: (value, tableMeta, updateValue) => (
            <div
              onClick={() => {
                downloadBill(tableMeta.rowData[1], tableMeta.rowData[10], tableMeta.rowData[9]);
              }}
            >
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
      getTextToLocalMapping("Bill Amount(Rs)"),
      {
        name : getTextToLocalMapping("Status"),
        options:{
          filter: false,
          customBodyRender: value => (
            <span>
               {getLocaleLabels(value.toUpperCase(),value.toUpperCase())}
            </span>
          )

        }
      },
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
              onClick={value => {
                const appName =
                  process.env.REACT_APP_NAME === "Citizen"
                    ? "citizen"
                    : "employee";
                if (tableMeta.rowData[5] === "PAID") {
                  const receiptQueryString = [
                    { key: "billIds", value: tableMeta.rowData[11] },
                    { key: "tenantId", value: tableMeta.rowData[10] }
                  ];
                  download(receiptQueryString , "download" ,tableMeta.rowData[8]);
                } else {
                  const url =
                    process.env.NODE_ENV === "development"
                      ? `/egov-common/pay?consumerCode=${
                          tableMeta.rowData[1]
                        }&tenantId=${tableMeta.rowData[10]}&businessService=${
                          tableMeta.rowData[7]
                        }`
                      : `/${appName}/egov-common/pay?consumerCode=${
                          tableMeta.rowData[1]
                        }&tenantId=${tableMeta.rowData[10]}&businessService=${
                          tableMeta.rowData[7]
                        }`;
                  document.location.href = `${document.location.origin}${url}`;
                }
              }}
            >
              {getLocaleLabels(value,value)}
            </div>
          )
        }
      },
      {
        name: "businessService",
        options: {
          display: false
        }
      },
      {
        name: "receiptKey",
        options: {
          display: false
        }
      },
      {
        name: "billKey",
        options: {
          display: false
        }
      },
      {
        name: "tenantId",
        options: {
          display: false
        }
      },
      {
        name: "Bill Id",
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
