import { downloadMultipleFileFromFilestoreIds } from "egov-common/ui-utils/commons";
import { getLocaleLabels } from "egov-ui-framework/ui-utils/commons";
import get from "lodash/get";
import React from "react";
import store from "ui-redux/store";
import { sortByEpoch } from "../../utils";
import {
  cancelGeneratedJob,
  downloadMultipleBills,
} from "../../utils/receiptPdf";

const getStatusColumn = (value, tableMeta) => {
  const meta = (tableMeta && tableMeta.rowData[9]) || {};

  const status = meta.status;
  switch (status) {
    case "DONE":
      return (
        <div class="progress" style={{ marginTop: "15px" }}>
          <div
            class={`progress-bar progress-bar-${"success"}`}
            role="progressbar"
            ariaValuenow={100}
            ariaValuemin="0"
            ariaValuemax={100}
            style={{
              fontSize: "inherit",
              fontWeight: "600",
              color: "black",
              width: `${Number(100).toFixed()}%`,
            }}
          >
            <span style={{ position: "unset" }}>
              {`${Number(100).toFixed()}%`}
            </span>
          </div>
        </div>
      );
    case "INPROGRESS":
      return (
        <div class="progress" style={{ marginTop: "15px" }}>
          <div
            class={`progress-bar progress-bar-${"success"}`}
            role="progressbar"
            ariaValuenow={
              tableMeta.rowData[9] && tableMeta.rowData[9].recordscompleted
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
                ? `${Number(value).toFixed()}%`
                : getLocaleLabels("GRP_BILL_INITIATED", "GRP_BILL_INITIATED")}
            </span>
          </div>
        </div>
      );
    case "FAILED":
    case "EXPIRED":
      return (
        <div class="progress" style={{ marginTop: "15px" }}>
          <div
            class={`progress-bar progress-bar-${"danger"}`}
            role="progressbar"
            ariaValuenow={100}
            ariaValuemin="0"
            ariaValuemax={100}
            style={{
              fontSize: "inherit",
              fontWeight: "600",
              color: "black",
              width: `${Number(100).toFixed()}%`,
            }}
          >
            <span style={{ position: "unset" }}>
              {getLocaleLabels(`GRP_BILL_${status}`, `GRP_BILL_${status}`)}
            </span>
          </div>
        </div>
      );
    case "CANCEL":
      return (
        <div class="progress" style={{ marginTop: "15px" }}>
          <div
            class={`progress-bar progress-bar-${"danger"}`}
            role="progressbar"
            ariaValuenow={100}
            ariaValuemin="0"
            ariaValuemax={100}
            style={{
              fontSize: "inherit",
              fontWeight: "600",
              color: "black",
              width: `${Number(100).toFixed()}%`,
            }}
          >
            <span style={{ position: "unset" }}>
              {getLocaleLabels("GRP_BILL_CANCELLED", "GRP_BILL_CANCELLED")}
            </span>
          </div>
        </div>
      );
    case "DUMMY":
      return (
        <div class="progress" style={{ marginTop: "15px" }}>
          <div
            class={`progress-bar progress-bar-${
              tableMeta.rowData[7] ? "danger" : "success"
            }`}
            role="progressbar"
            ariaValuenow={
              tableMeta.rowData[9] && tableMeta.rowData[9].recordscompleted
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
                  ? getLocaleLabels(
                      value == 100 ? "GRP_BILL_EXPIRED" : "GRP_BILL_FAILED",
                      value == 100 ? "GRP_BILL_EXPIRED" : "GRP_BILL_FAILED"
                    )
                  : `${Number(value).toFixed()}%`
                : getLocaleLabels("GRP_BILL_INITIATED", "GRP_BILL_INITIATED")}
            </span>
          </div>
        </div>
      );
  }
};

const getActionColumn = (value, tableMeta) => {
  const meta = (tableMeta && tableMeta.rowData[9]) || {};

  const status = meta.status;
  switch (status) {
    case "DONE":
      return (
        <span class="jk-tooltip">
          <div
            style={{ color: "#FE7A51", cursor: "pointer" }}
            onClick={() => {
              downloadMultipleFileFromFilestoreIds(
                [value],
                "download",
                tableMeta.rowData[6]
              );
            }}
          >
            <span class="jk-tooltiptext">
              {getLocaleLabels(
                "ABG_DOWNLOAD_EXPIREDIN",
                "ABG_DOWNLOAD_EXPIREDIN"
              )}
            </span>
            {getLocaleLabels("GRP_BILL_ACT_DOWNLOAD", "GRP_BILL_ACT_DOWNLOAD")}
          </div>
        </span>
      );

    case "INPROGRESS":
      let val = (meta.recordscompleted / meta.totalrecords) * 100;
      return val ? (
        <div
          style={{ color: "#FE7A51", cursor: "pointer" }}
          onClick={() => {
            cancelGeneratedJob(store.dispatch, meta.jobid);
          }}
        >
          {getLocaleLabels("GRP_BILL_ACT_CANCEL", "GRP_BILL_ACT_CANCEL")}
        </div>
      ) : (
        <span>{getLocaleLabels("CMN_NA", "CMN_NA")}</span>
      );
    case "FAILED":
    case "EXPIRED":
      return (
        <div
          style={{ color: "#FE7A51", cursor: "pointer" }}
          onClick={() => {
            const state = store.getState();
            const commonPayDetails = get(
              state.screenConfiguration,
              "preparedFinalObject.searchScreenMdmsData.common-masters.uiCommonPay",
              []
            );
            const billkey = get(
              commonPayDetails.filter(
                (item) => item.code == tableMeta.rowData[8].bussinessService
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
          }}
        >
          {getLocaleLabels("GRP_BILL_ACT_RETRY", "GRP_BILL_ACT_RETRY")}
        </div>
      );
    case "CANCEL":
      return <span>{getLocaleLabels("CMN_NA", "CMN_NA")}</span>;
    case "DUMMY":
      return (
        <span class="jk-tooltip">
          {value || meta.success || meta.failed || meta.expired ? (
            <div
              style={{ color: "#FE7A51", cursor: "pointer" }}
              onClick={() => {
                if (meta.success) {
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
              {meta.expired && (
                <span class="jk-tooltiptext">
                  {getLocaleLabels(
                    "ABG_DOWNLOAD_EXPIREDIN",
                    "ABG_DOWNLOAD_EXPIREDIN"
                  )}
                </span>
              )}
              {getLocaleLabels(
                !meta.success ? "GRP_BILL_ACT_RETRY" : "GRP_BILL_ACT_DOWNLOAD",
                !tableMeta.rowData[8].success
                  ? "GRP_BILL_ACT_RETRY"
                  : "GRP_BILL_ACT_DOWNLOAD"
              )}
            </div>
          ) : meta && meta.recordscompleted > 0 ? (
            <div
              style={{ color: "#FE7A51", cursor: "pointer" }}
              onClick={() => {
                cancelGeneratedJob(store.dispatch, meta.jobid);
              }}
            >
              {getLocaleLabels("GRP_BILL_ACT_CANCEL", "GRP_BILL_ACT_CANCEL")}
            </div>
          ) : (
            getLocaleLabels("CMN_NA", "CMN_NA")
          )}
        </span>
      );
  }
};
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
          customBodyRender: (value, tableMeta) => {
            let replaceKey =
              tableMeta.rowData[8].bussinessService == "WS" ? "_WS" : "_SW";
            let replaceWith =
              tableMeta.rowData[8].bussinessService == "WS" ? "_SW" : "_WS";
            let newKey = value.replace(replaceKey, replaceWith);
            return (
              <span>
                {tableMeta.rowData[8].isConsolidated
                  ? `${getLocaleLabels(value, value)} , ${getLocaleLabels(
                      newKey,
                      newKey
                    )}`
                  : getLocaleLabels(value, value)}
              </span>
            );
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
            return getStatusColumn(value, tableMeta);
          },
        },
      },
      {
        labelName: "Action",
        labelKey: "ABG_COMMON_TABLE_COL_ACTION",
        options: {
          filter: false,
          customBodyRender: (value, tableMeta) => {
            const meta = (tableMeta && tableMeta.rowData[9]) || {};
            return meta ? (
              getActionColumn(value, tableMeta)
            ) : (
              <span>{getLocaleLabels("CMN_NA", "CMN_NA")}</span>
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
