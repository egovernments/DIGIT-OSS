import {
  sortByEpoch,
  getEpochForDate,
  getTextToLocalMapping
} from "../../utils";
import {download} from "egov-common/ui-utils/commons"

export const searchResult = {
  uiFramework: "custom-molecules",
  componentPath: "Table",
  visible: false,
  props: {
    columns: [
      {
        labelName: "Receipt No.",
        labelKey: "UC_COMMON_TABLE_COL_RECEIPT_NO"
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
        labelName: "Tenant Id",
        labelKey: "TENANT_ID",
        options: {
          display: false
        }
      }
    ],
    title: {
      labelName: "Search Results for Payments",
      labelKey: "COMMON_TABLE_SEARCH_RESULT_PAYMENTS"
    },
    rows:"",
    options: {
      filter: false,
      download: false,
      responsive: "stacked",
      selectableRows: false,
      hover: true,
      rowsPerPageOptions: [10, 15, 20],
      onRowClick: (row, index) => {
        const receiptQueryString = [
          { key: "receiptNumbers", value:  row[0]},
          { key: "tenantId", value: row[6] }
        ]
        download(receiptQueryString);
      }
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
