import React from "react";
import { sortByEpoch, getEpochForDate, getTextToLocalMapping } from "../../utils";
import './index.css'

export const searchApplicationResults = {
  uiFramework: "custom-molecules",
  moduleName: "egov-wns",
  componentPath: "Table",
  visible: false,
  props: {
    columns: [
      {
        name: getTextToLocalMapping("Consumer No"),
        options: {
          filter: false,
          customBodyRender: (value, index) => (
            <div className="linkStyle" onClick={() => getConnectionDetails(index)}>
              <a>{value}</a>
            </div>
          )
        }
      },
      {
        name: getTextToLocalMapping("Application No"),
        options: {
          filter: false,
          customBodyRender: (value, index) => (
            <div className="linkStyle" onClick={() => getApplicationDetails(index)}>
              <a>{value}</a>
            </div>
          )
        }
      },
      {
        name: getTextToLocalMapping("Application Type"),
        options: {
          filter: false,
          customBodyRender: value => (
            <span style={{ color: '#000000' }}>
              {value}
            </span>
          )
        }
      },
      getTextToLocalMapping("Owner Name"),
      getTextToLocalMapping("Application Status"),
      getTextToLocalMapping("Address"),
      {
        name: "tenantId",
        options: {
          display: false
        }
      },
      {
        name: "service",
        options: {
          display: false
        }
      }
    ],
    title: getTextToLocalMapping(
      "Search Results for Water & Sewerage Connections"
    ),
    options: {
      filter: false,
      download: false,
      responsive: "stacked",
      selectableRows: false,
      hover: true,
      rowsPerPageOptions: [10, 15, 20]
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

const getApplicationDetails = data => {
  window.location.href = `search-preview?applicationNumber=${data.rowData[1]}&tenantId=${data.rowData[6]}&history=true&service=${data.rowData[2]}`
}

const getConnectionDetails = data => {
  window.location.href = `connection-details?connectionNumber=${data.rowData[1]}&tenantId=${data.rowData[6]}&service=${data.rowData[0]}&connectionType=${data.rowData[9]}`
}