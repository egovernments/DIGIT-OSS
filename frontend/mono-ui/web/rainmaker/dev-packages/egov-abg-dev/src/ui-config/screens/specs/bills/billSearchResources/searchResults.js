
import { getLocaleLabels, getTransformedLocale } from "egov-ui-framework/ui-utils/commons";
import { setRoute } from "egov-ui-kit/utils/commons";
import React from "react";
import { getEpochForDate, sortByEpoch } from "../../utils";
import { billDownload } from "../../abg/billSearchResources/searchResults";



export const searchResults = {
  uiFramework: "custom-molecules",
  componentPath: "Table",
  visible: false,
  props: {
    columns: [
      {
        labelName: "Bill No.",
        labelKey: "ABG_COMMON_TABLE_COL_BILL_NO",
        options: {
          filter: false,
          customBodyRender: (value, tableMeta, updateValue) => (
            <a href="javascript:void(0)"
              onClick={() => {
                billDownload(tableMeta.rowData[1], tableMeta.rowData[10], tableMeta.rowData[9], tableMeta.rowData[12], tableMeta.rowData[7]);
              }}
            >
              {value}
            </a>
          )
        }
      },
      {
        labelName: "Consumer Code",
        labelKey: "PAYMENT_COMMON_CONSUMER_CODE",
        options: {
          display: false
        }
      },
      {
        labelName: "Consumer Name",
        labelKey: "ABG_COMMON_TABLE_COL_CONSUMER_NAME"
      },
      {
        labelName: "Bill Date",
        labelKey: "ABG_COMMON_TABLE_COL_BILL_EXP_DATE"
      },
      {
        labelName: "Bill Amount(Rs)",
        labelKey: "ABG_COMMON_TABLE_COL_BILL_AMOUNT"
      },
      {
        labelName: "Status",
        labelKey: "ABG_COMMON_TABLE_COL_STATUS",
        options: {
          filter: false,
          customBodyRender: value => (
            <span>
              {getLocaleLabels(value.toUpperCase(), value.toUpperCase())}
            </span>
          )

        }
      },
      {
        labelName: "Action",
        labelKey: "ABG_COMMON_TABLE_COL_ACTION",
        options: {
          filter: false,
          customBodyRender: (value, tableMeta) => value === "ABG_CANCEL_BILL" ? (tableMeta.rowData[4] > 0 ? getActionButton(value, tableMeta) : (tableMeta.rowData[4] <= 0 && tableMeta.rowData[13] ? getActionButton(value, tableMeta) : "")) : getActionButton(value, tableMeta)
        }
      },
      {
        labelKey: "BUSINESS_SERVICE",
        labelName: "Business Service",
        options: {
          display: false
        }
      },
      {
        labelKey: "RECEIPT_KEY",
        labelName: "Receipt Key",
        options: {
          display: false
        }
      },
      {
        labelName: "Bill Key",
        labelKey: "BILL_KEY",
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
        labelName: "Bill Id",
        labelKey: "BILL_ID",
        options: {
          display: false
        }
      },
      {
        labelName: "Bill Search Url",
        labelKey: "BILL_SEARCH_URL",
        options: {
          display: false
        }
      },
      {
        labelName: "Advance Payment",
        labelKey: "ADVANCE_PAYMENT",
        options: {
          display: false
        }
      }
    ],
    title: {
      labelName: "Search Results for Bill",
      labelKey: "BILL_GENIE_SEARCH_TABLE_HEADER"
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

const getActionButton = (value, tableMeta) => {
  return (
    <a href="javascript:void(0)"
      style={{
        color: "#FE7A51",
        cursor: "pointer"
      }}
      onClick={value => {
        let service = "WATER";
        if (tableMeta.rowData[7] == "SW") {
          service = "SEWERAGE"
        }
        setRoute(`/bills/viewBill?connectionNumber=${tableMeta.rowData[1]}&tenantId=${tableMeta.rowData[10]}&service=${service}`)
      }}
    >
      {getLocaleLabels(value, getTransformedLocale(`${value}`))}
    </a>
  )
}
