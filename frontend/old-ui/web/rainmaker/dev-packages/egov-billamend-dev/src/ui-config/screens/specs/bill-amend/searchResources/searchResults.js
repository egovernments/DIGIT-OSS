import { LabelContainer } from "egov-ui-framework/ui-containers";
import { getStatusKey } from "egov-ui-framework/ui-utils/commons";
import { routeTo } from "egov-ui-kit/utils/PTCommon/FormWizardUtils/formActionUtils";
import React from "react";
import {
  getEpochForDate, sortByEpoch
} from "../../utils";

const getConnectionDetails = data => {
  if (data.rowData[0] == "WS" || data.rowData[0] == "SW") {
    routeTo(`/wns/redirect?connectionNumber=${data.rowData[2]}&tenantId=${data.rowData[6]}&businessService=${data.rowData[0]}`)
  } else {
    // routeTo(`/wns/connection-details?connectionNumber=${data.rowData[2]}&tenantId=${data.rowData[6]}&service=${data.rowData[8]}&connectionType=${data.rowData[9]}`)
  }

}

export const searchResults = {
  uiFramework: "custom-molecules",
  componentPath: "Table",
  visible: false,
  props: {
    columns: [
      {
        labelName: "Bill No.",
        labelKey: "BILL_COMMON_SERVICE_TYPE",
        options: {
          filter: false,
          customBodyRender: (value, tableMeta, updateValue) => (
            <span style={{ "color": "rgba(0, 0, 0, 0.87)", "cursor": "text" }} >
              {value}
            </span>
          )
        }
      },
      {
        labelName: "Application No",
        labelKey: "BILL_COMMON_APPLICATION_NO",
        options: {
          filter: false,
          customBodyRender: (value, tableMeta, updateValue) => (
            value == 'NA' ?
              <span style={{ "color": "rgba(0, 0, 0, 0.87)", "cursor": "text" }} >
                {value}
              </span> :
              <a href="javascript:void(0)"
                onClick={() => {
                  let link = `/bill-amend/search-preview?tenantId=${tableMeta.rowData[6]}&applicationNumber=${tableMeta.rowData[1]}&businessService=${tableMeta.rowData[0]}`;
                  routeTo(link);
                }}
              >{value}
              </a>
          )
        }
      },
      {
        labelName: "Consumer Code",
        labelKey: "PAYMENT_COMMON_CONSUMER_CODE",
        options: {
          filter: false,
          customBodyRender: (value, tableMeta, updateValue) => (
            <a href="javascript:void(0)"
              onClick={() => {
                getConnectionDetails(tableMeta)
              }}
            >{value}
            </a>
          )
        }
      },
      {
        labelName: "Consumer Name",
        labelKey: "BILL_COMMON_TABLE_COL_CONSUMER_NAME"
      },
      {
        labelName: "Consumer Name",
        labelKey: "BILL_COMMON_TABLE_CONSUMER_ADDRESS"
      },
      {
        labelName: "Status",
        labelKey: "BILL_COMMON_TABLE_COL_STATUS",
        options: {
          filter: false,
          customBodyRender: value => (
            <LabelContainer
              style={
                value === "ACTIVE" ||value === "CONSUMED" ? { color: "green" } : { color: "red" }
              }
              labelKey={getStatusKey(value).labelKey}
              labelName={getStatusKey(value).labelName}
            />
          )
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
        labelKey: "BUSINESS_SERVICE",
        labelName: "Business Service",
        options: {
          display: false
        }
      },
      {
        labelKey: "SERVICE_CONST",
        labelName: "Service Constant",
        options: {
          display: false
        }
      },
      {
        labelKey: "CONNECTION_TYPE",
        labelName: "Connection Type",
        options: {
          display: false
        }
      },
    ],
    title: {
      labelName: "Search Results for Bill",
      labelKey: "BILL_SEARCH_TABLE_HEADER"
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
