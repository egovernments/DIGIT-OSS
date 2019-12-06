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
      getTextToLocalMapping("Receipt No."),
      getTextToLocalMapping("Payee Name"),
      getTextToLocalMapping("Service Type"),
      getTextToLocalMapping("Date"),
      getTextToLocalMapping("Amount[INR]"),
      getTextToLocalMapping("Status"),
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
