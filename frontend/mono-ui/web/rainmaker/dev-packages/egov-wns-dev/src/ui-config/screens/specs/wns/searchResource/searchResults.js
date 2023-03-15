import LabelContainer from "egov-ui-framework/ui-containers/LabelContainer";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { getLocaleLabels, getTransformedLocale } from "egov-ui-framework/ui-utils/commons";
import React from "react";
import store from "ui-redux/store";
import { getEpochForDate, sortByEpoch } from "../../utils";
import './index.css';

export const searchResults = {
  uiFramework: "custom-molecules",
  moduleName: "egov-wns",
  componentPath: "Table",
  visible: false,
  props: {
    columns: [
      {
        name: "Service",
        labelKey: "WS_COMMON_TABLE_COL_SERVICE_LABEL",
        options: {
          filter: false,
          customBodyRender: value => (
            <span style={{ color: '#000000' }}>
              <LabelContainer
                labelKey={getTransformedLocale(`WS_${value}`)}
                style={{
                  fontSize: 14,
                }}
              />
            </span>
          )
        }
      },
      {
        name: "Consumer No",
        labelKey: "WS_COMMON_TABLE_COL_CONSUMER_NO_LABEL",
        options: {
          filter: false,
          customBodyRender: (value, index) => (
            <div className="linkStyle" onClick={() => getConnectionDetails(index)}>
              <a>{value}</a>
            </div>
          )
        }
      },
      { name: "Owner Name", labelKey: "WS_COMMON_TABLE_COL_OWN_NAME_LABEL" },
      {
        name: "Status", labelKey: "WS_COMMON_TABLE_COL_STATUS_LABEL", options: {
          filter: false,
          customBodyRender: value => (
            <span style={{ color: '#000000' }}>
              <LabelContainer
                labelKey={getTransformedLocale(`WS_${value}`)}
                style={{
                  fontSize: 14,
                }}
              />
            </span>
          )
        }
      },
      {
        name: "Due", labelKey: "WS_COMMON_TABLE_COL_DUE_LABEL", options: {
          filter: false,
          customBodyRender: value => (
            <span style={{ color: '#000000' }}>
              <LabelContainer
                labelKey={getTransformedLocale(value)}
                style={{
                  fontSize: 14,
                }}
              />
            </span>
          )
        }
      },
      { name: "Address", labelKey: "WS_COMMON_TABLE_COL_ADDRESS" },
      { name: "Due Date", labelKey: "WS_COMMON_TABLE_COL_DUE_DATE_LABEL" },
      {
        name: "Action",
        labelKey: "WS_COMMON_TABLE_COL_ACTION_LABEL",
        options: {
          filter: false,
          customBodyRender: (value, data) => {
            if (data.rowData[4] !== undefined && typeof parseFloat(data.rowData[4]) === 'number' && parseFloat(data.rowData[4]) > 0) {
              return (
                <div className="linkStyle" onClick={() => getViewBillDetails(data)} style={{ color: '#fe7a51', textTransform: 'uppercase' }}>
                  <LabelContainer
                    labelKey="WS_COMMON_COLLECT_LABEL"
                    style={{
                      color: "#fe7a51",
                      fontSize: 14,
                    }}
                  />
                </div>
              )
            }
            else {
              return (getLocaleLabels("NA", "NA"))
            }
          }
        }
      },
      {
        name: "tenantId",
        labelKey: "WS_COMMON_TABLE_COL_TENANTID_LABEL",
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
    title: { labelKey: "WS_HOME_SEARCH_RESULTS_TABLE_HEADING", labelName: "Search Results for Water & Sewerage Connections" },
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

const getConnectionDetails = data => {
  store.dispatch(
    setRoute(`connection-details?connectionNumber=${data.rowData[1]}&tenantId=${data.rowData[8]}&service=${data.rowData[0]}&connectionType=${data.rowData[9]}&due=${data.rowData[4]}`)
  )
}

const getViewBillDetails = data => {
  store.dispatch(
    setRoute(`viewBill?connectionNumber=${data.rowData[1]}&tenantId=${data.rowData[8]}&service=${data.rowData[0]}&connectionType=${data.rowData[9]}`)
  )
}