import React from "react";
import { Link } from "react-router-dom";
import {
  sortByEpoch,
  getEpochForDate,
  getTextToLocalMapping,
  onActionClick
} from "../../utils";


export const searchResults = {
  uiFramework: "custom-molecules",
  // moduleName: "egov-tradelicence",
  componentPath: "Table",
  visible: false,
  props: {
    columns: [
      getTextToLocalMapping("Bill No."),
      getTextToLocalMapping("Consumer Name"),
      getTextToLocalMapping("Service Category"),
      getTextToLocalMapping("Bill Date"),
      getTextToLocalMapping("Bill Amount[INR]"),
      getTextToLocalMapping("Status"),
      {
        name: getTextToLocalMapping("Action"),
        options: {
          filter: false,
          customBodyRender: (value, row) => (
            <Link to={navigateToCommonPay(row.rowData)}>
            <span
              style={{
                color: "#FE7A51",
                cursor: "pointer"
              }}
            >
              {getTextToLocalMapping(value)}
              {console.log('row----', row)}
            </span>
            </Link>
          )
        },
      },
      {
        name: "tenantId",
        options: {
          display: false
        }
      },
      {
        name: "action",
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
      rowsPerPageOptions: [10, 15, 20],
      onRowClick: (row, index) => onActionClick(row)
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
    },
    
  },
  
};

const navigateToCommonPay = (rowData)=>{
  if(Array.isArray(rowData) && rowData.length > 0){
    return `/egov-common/pay?consumerCode=${rowData[0]}&tenantId=${rowData[7]}&businessService=${rowData[2]}`
  }
}
