import { downloadMultipleFileFromFilestoreIds } from "egov-common/ui-utils/commons";
import { getLocaleLabels } from "egov-ui-framework/ui-utils/commons";
import get from "lodash/get";
import React from "react";
import store from "../../../../../ui-redux/store";
import { sortByEpoch } from "../../utils";
import { downloadMultipleBills } from "../../utils/receiptPdf";


export const searchResults = {
  uiFramework: "custom-molecules",
  componentPath: "Table",
  visible: false,
  props: {
    columns: [
      {
        labelName: "Bill No.",
        labelKey: "TL_DATE_LABEL",
        options: {
          filter: false,
          customBodyRender: (value, tableMeta) => {
            return (
              <span style={{ cursor: "initial", color: "black" }}>
                {new Date(Number(value)).toLocaleDateString()}
              </span>
            );
          },
        },
      },

      {
        labelName: "Consumer Name",
        labelKey: "BUSINESS_SERVICE",
        options: {
          filter: false,
          customBodyRender: (value) => {
            return <span>{getLocaleLabels(value, value)}</span>;
          },
        },
      },
      {
        labelName: "Bill Date",
        labelKey: "CS_INBOX_LOCALITY_FILTER",
        options: {
          filter: false,
          customBodyRender: (value) => {
            return <span>{getLocaleLabels(value, value)}</span>;
          },
        },
      },
      {
        labelName: "Bill Amount(Rs)",
        labelKey: "PAYMENT_COMMON_CONSUMER_CODE",
      },
      {
        labelName: "Status",
        labelKey: "ABG_COMMON_TABLE_COL_STATUS",
        options: {
          filter: false,
          customBodyRender: (value, tableMeta) => {
            return (
              <div class="progress" style={{ marginTop: "15px" }}>
                <div
                  class={`progress-bar progress-bar-${
                    tableMeta.rowData[7] ? "danger" : "success"
                  }`}
                  role="progressbar"
                  ariaValuenow={
                    tableMeta.rowData[9] &&
                    tableMeta.rowData[9].recordscompleted
                  }
                  ariaValuemin="0"
                  ariaValuemax={
                    tableMeta.rowData[9] && tableMeta.rowData[9].totalrecords
                  }
                  style={{
                    fontSize: "inherit",
                    fontWeight: "600",
                    color: "black",
                    width: `${Number(value).toFixed()}%`,
                  }}
                >
                  <span style={{ position: "unset" }}>
                    {value
                      ? tableMeta.rowData[7]
                        ? getLocaleLabels("GRP_BILL_FAILED", "GRP_BILL_FAILED")
                        : `${Number(value).toFixed()}%`
                      : getLocaleLabels(
                          "GRP_BILL_INITIATED",
                          "GRP_BILL_INITIATED"
                        )}
                  </span>
                </div>
              </div>
            );
          },
        },
      },
      {
        labelName: "Action",
        labelKey: "ABG_COMMON_TABLE_COL_ACTION",
        options: {
          filter: false,
          customBodyRender: (value, tableMeta) => {
            return (
              <span>
                {value || tableMeta.rowData[7] ? (
                  <div
                    style={{ color: "#FE7A51", cursor: "pointer" }}
                    onClick={() => {
                      if (tableMeta.rowData[7]) {
                        const state = store.getState();

                        const commonPayDetails = get(
                          state.screenConfiguration,
                          "preparedFinalObject.searchScreenMdmsData.common-masters.uiCommonPay",
                          []
                        );
                        const billkey = get(
                          commonPayDetails.filter(
                            (item) =>
                              item.code == tableMeta.rowData[8].bussinessService
                          )[0],
                          "billKey",
                          ""
                        );
                        downloadMultipleBills(
                          [],
                          billkey,
                          tableMeta.rowData[6],
                          tableMeta.rowData[8].locality,
                          tableMeta.rowData[8].isConsolidated,
                          tableMeta.rowData[8].bussinessService,
                          tableMeta.rowData[8].consumercode,
                          store.dispatch
                        );
                      } else {
                        downloadMultipleFileFromFilestoreIds(
                          [value],
                          "download",
                          tableMeta.rowData[6]
                        );
                      }
                    }}
                  >
                    {getLocaleLabels(
                      tableMeta.rowData[7]
                        ? "GRP_BILL_ACT_RETRY"
                        : "GRP_BILL_ACT_DOWNLOAD",
                      tableMeta.rowData[7]
                        ? "GRP_BILL_ACT_RETRY"
                        : "GRP_BILL_ACT_DOWNLOAD"
                    )}
                  </div>
                ) : (
                  "NA"
                )}
              </span>
            );
          },
        },
      },
      {
        name: "connectionType",
        labelKey: "ABG_COMMON_TABLE_TENANT",
        options: {
          display: false,
        },
      },
      {
        name: "connectionType",
        labelKey: "ABG_IS_FAILED",
        options: {
          display: false,
        },
      },
      {
        name: "connectionType",
        labelKey: "ABG_RETRY_OBJ",
        options: {
          display: false,
        },
      },
      {
        name: "connectionType",
        labelKey: "ABG_PROGRESS_OBJ",
        options: {
          display: false,
        },
      },
    ],
    title: {
      labelName: "",
      labelKey: "GRP_BILL_LIST_OF_JOBS",
    },
    rows: "",
    options: {
      filter: false,
      download: false,
      responsive: "stacked",
      selectableRows: false,
      hover: true,
      rowsPerPageOptions: [10, 15, 20],
    },
    customSortColumn: {
      column: getLocaleLabels("TL_DATE_LABEL", "TL_DATE_LABEL"),
      sortingFn: (data, i, sortDateOrder) => {
        const epochDates = data.reduce((acc, curr) => {
          acc.push([curr[0]]);
          return acc;
        }, []);
        const order = sortDateOrder === "asc" ? true : false;
        const finalData = sortByEpoch(epochDates, !order).map((item) => {
          item.pop();
          return item;
        });
        return { data: finalData, currentOrder: !order ? "asc" : "desc" };
      },
    },
  },
};
