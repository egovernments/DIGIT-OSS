import {
  sortByEpoch,
  getEpochForDate,
  getTextToLocalMapping
} from "../../utils";

export const searchResults = {
  uiFramework: "custom-molecules",
  componentPath: "Table",
  visible: true,
  props: {
    data: [],
    columns: [
      getTextToLocalMapping("Application No"),
      getTextToLocalMapping("License No"),
      getTextToLocalMapping("Trade Name"),
      getTextToLocalMapping("Owner Name"),
      getTextToLocalMapping("Application Date"),
      getTextToLocalMapping("Status"),
      {
        name: "tenantId",
        options: {
          display: false
        }
      }
    ],
    // columns: {
    //   [get(textToLocalMapping, "Application No")]: {
    //     format: rowData => {
    //       return (
    //         <Link to={onRowClick(rowData)}>
    //           {rowData[get(textToLocalMapping, "Application No")]}
    //         </Link>
    //       );
    //     }
    //   },
    //   [get(textToLocalMapping, "License No")]: {},
    //   [get(textToLocalMapping, "Trade Name")]: {},
    //   [get(textToLocalMapping, "Owner Name")]: {},
    //   [get(textToLocalMapping, "Application Date")]: {},
    //   [get(textToLocalMapping, "Status")]: {
    //     format: rowData => {
    //       let value = rowData[get(textToLocalMapping, "Status")];
    //       let color = "";
    //       if (value.indexOf(get(textToLocalMapping, "APPROVED")) !== -1) {
    //         color = "green";
    //       } else {
    //         color = "red";
    //       }
    //       return (
    //         <span
    //           style={{
    //             color: color,
    //             fontSize: "14px",
    //             fontWeight: 400
    //           }}
    //         >
    //           {value}
    //         </span>
    //       );
    //     }
    //   }
    // },
    title: getTextToLocalMapping("MY_APPLICATIONS"),
    options: {
      filter: false,
      download: false,
      responsive: "scroll",
      selectableRows: false,
      hover: true,
      rowsPerPageOptions: [10, 15, 20],
      onRowClick: (row, index) => {
        onRowClick(row);
      }
    },
    customSortColumn: {
      column: "Application Date",
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
  switch (rowData[5]) {
    case "INITIATED":
      window.location.href = `apply?applicationNumber=${rowData[0]}&tenantId=${
        rowData[6]
      }`;
      break;
    default:
      window.location.href = `search-preview?applicationNumber=${
        rowData[0]
      }&tenantId=${rowData[6]}`;
      break;
  }
};
