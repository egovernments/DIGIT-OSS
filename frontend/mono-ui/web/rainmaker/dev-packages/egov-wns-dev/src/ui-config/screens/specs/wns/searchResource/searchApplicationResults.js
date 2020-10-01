import React from "react";
import { sortByEpoch, getEpochForDate } from "../../utils";
import './index.css';
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import store from "ui-redux/store";

export const searchApplicationResults = {
  uiFramework: "custom-molecules",
  moduleName: "egov-wns",
  componentPath: "Table",
  visible: false,
  props: {
    columns: [
      {
        name: "Consumer No",
        labelKey: "WS_COMMON_TABLE_COL_CONSUMER_NO_LABEL", 
        options: {
          filter: false,
          customBodyRender: (value, data) => {
            if (data.rowData[0] !== "NA" && data.rowData[0] !== null) {
              return (
                <div className="linkStyle" onClick={() => getConnectionDetails(data)}>
                  <a>{value}</a>
                </div>
              )
            } else {
              return (
                <p>{value}</p>
              )
            }
          }
        }
      },
      {
        name: "Application No",
        labelKey: "WS_COMMON_TABLE_COL_APP_NO_LABEL", 
        options: {
          filter: false,
          customBodyRender: (value, data) => {
            if (data.rowData[1] !== "NA" && data.rowData[1] !== null) {
              return (
                <div className="linkStyle" onClick={() => getApplicationDetails(data)}>
                  <a>{value}</a>
                </div>
              )
            } else {
              return (
                <p>{value}</p>
              )
            }
          }
        }
      },
      {
        name: "Application Type",
        labelKey: "WS_COMMON_TABLE_COL_APP_TYPE_LABEL",
        options: {
          filter: false,
          customBodyRender: value => (
            <span style={{ color: '#000000' }}>
              {value}
            </span>
          )
        }
      },
      {name : "Owner Name",labelKey: "WS_COMMON_TABLE_COL_OWN_NAME_LABEL" },
      {name : "Application Status",labelKey: "WS_COMMON_TABLE_COL_APPLICATION_STATUS_LABEL" },
      {name : "Address",labelKey: "WS_COMMON_TABLE_COL_ADDRESS" },
      {
        name: "tenantId",
        labelKey: "WS_COMMON_TABLE_COL_TENANTID_LABEL",
        options: {
          display: false
        }
      },
      {
        name: "service",
        labelKey: "WS_COMMON_TABLE_COL_SERVICE_LABEL", 
        options: {
          display: false
        }
      },
      {
        name: "connectionType",
        labelKey: "WS_COMMON_TABLE_COL_CONNECTIONTYPE_LABEL",
        options: {
          display: false
        }
      }
    ],
    title: {labelKey:"WS_HOME_SEARCH_APPLICATION_RESULTS_TABLE_HEADING", labelName:"Search Results for Water & Sewerage Application"},
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
  let connectionNo = `${data.rowData[0]}`;
  if(connectionNo && connectionNo !== 'NA' && data.rowData[2].includes('MODIFY')) {
    store.dispatch(
      setRoute(`search-preview?applicationNumber=${data.rowData[1]}&tenantId=${data.rowData[6]}&history=true&service=${data.rowData[7]}&mode=MODIFY`)
    )
  } else {
    store.dispatch(
      setRoute(`search-preview?applicationNumber=${data.rowData[1]}&tenantId=${data.rowData[6]}&history=true&service=${data.rowData[7]}`)
    )
  }
}

const getConnectionDetails = data => {
  store.dispatch(
    setRoute(`connection-details?connectionNumber=${data.rowData[0]}&tenantId=${data.rowData[6]}&service=${data.rowData[7]}&connectionType=${data.rowData[8]}`)
  )
}