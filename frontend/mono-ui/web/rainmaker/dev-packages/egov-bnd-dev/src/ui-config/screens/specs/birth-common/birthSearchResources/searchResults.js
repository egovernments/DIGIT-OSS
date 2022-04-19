import React from "react";
import {
  sortByEpoch,
  getEpochForDate,
  getTextToLocalMapping,
} from "../../utils";
import {
  download,
  downloadReceiptFromFilestoreID,
  downloadChallan,
} from "egov-common/ui-utils/commons";
import { getLocaleLabels } from "egov-ui-framework/ui-utils/commons";
import { downloadCert } from "../../utils";
import store from "ui-redux/store";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { showHideConfirmationPopup } from "./birthSearchCard";

export const searchResults = {
  uiFramework: "custom-molecules",
  componentPath: "Table",
  visible: false,
  props: {
    columns: [
      // {
      //   labelName: "Bill No.",
      //   labelKey: "ABG_COMMON_TABLE_COL_BILL_NO",
      //   options: {
      //     filter: false,
      //     customBodyRender: (value, tableMeta, updateValue) => (
      //       <a href="javascript:void(0)"
      //         onClick={() => {
      //           const receiptQueryString = [
      //             {
      //               key: 'challanNo',
      //               value: tableMeta.rowData[1]
      //             },
      //             { key: 'tenantId', value: tableMeta.rowData[10] }];
      //             downloadChallan(receiptQueryString,"download");
      //          // downloadBill(tableMeta.rowData[1], tableMeta.rowData[10], tableMeta.rowData[9],tableMeta.rowData[12]);
      //         }}
      //       >
      //         {value}
      //       </a>
      //     )
      //   }
      // },
      {
        labelName: "Id",
        labelKey: "BND_COMMON_TABLE_ID",
        options: {
          display: false,
          viewColumns: false,
        },
      },
      {
        labelName: "Registration Number",
        labelKey: "BND_COMMON_TABLE_REGNO",
      },
      {
        labelName: "Name",
        labelKey: "BND_COMMON_NAME",
      },
      {
        labelName: "Birth Date",
        labelKey: "BND_BIRTH_DATE",
      },
      {
        labelName: "Gender",
        labelKey: "BND_COMMON_GENDER",
      },
      {
        labelName: "Mother's Name",
        labelKey: "BND_COMMON_MOTHERSNAME",
      },
      {
        labelName: "Father's Name",
        labelKey: "BND_COMMON_FATHERSNAME",
      },
      {
        labelName: "Action",
        labelKey: "BND_COMMON_TABLE_ACTION",
        options: {
          display: process.env.REACT_APP_NAME === "Citizen",
          viewColumns: process.env.REACT_APP_NAME === "Citizen",
          filter: false,
          customBodyRender: (value, tableMeta) =>
            value === "PAY AND DOWNLOAD"
              ? tableMeta.rowData[4] > 0
                ? getActionButton(value, tableMeta)
                : tableMeta.rowData[4] <= 0 && tableMeta.rowData[13]
                ? getActionButton(value, tableMeta)
                : ""
              : getActionButton(value, tableMeta),
        },
      },
      // {
      //   labelName: "Status",
      //   labelKey: "ABG_COMMON_TABLE_COL_STATUS",
      //   options:{
      //     filter: false,
      //     customBodyRender: value => (
      //       <span>
      //          {getLocaleLabels(value.toUpperCase(),value.toUpperCase())}
      //       </span>
      //     )
      //   }
      // },
      // {
      //   labelName: "Action",
      //   labelKey: "ABG_COMMON_TABLE_COL_ACTION",
      //   options: {
      //     filter: false,
      //     customBodyRender: (value, tableMeta) => value === "PAY" ? (tableMeta.rowData[4] > 0 ? getActionButton(value, tableMeta):(tableMeta.rowData[4] <= 0 && tableMeta.rowData[13] ? getActionButton(value, tableMeta) : "")) : getActionButton(value, tableMeta)
      //   }
      // },
      {
        labelName: "Tenant Id",
        labelKey: "TENANT_ID",
        options: {
          display: false,
          viewColumns: false,
        },
      },
      {
        labelName: "Business Service",
        labelKey: "BUSINESS_SERVICE",
        options: {
          display: false,
          viewColumns: false,
        },
      },
      {
        labelName: "BND_VIEW_CERTIFICATE",
        labelKey: "BND_VIEW_CERTIFICATE",
        options: {
          display: process.env.REACT_APP_NAME === "Employee",
          viewColumns: process.env.REACT_APP_NAME === "Employee",
          customBodyRender: (value, tableMeta) =>
            getViewButton(value, tableMeta),
        },
      },

      // {
      //   labelName: "Pay Required",
      //   labelKey: "PAYREQUIRED",
      //   options: {
      //     display: false,
      //     viewColumns  :false
      //   }
      // }
    ],
    title: {
      labelName: "Search Results for Birth",
      labelKey: "BND_SEARCH_TABLE_HEADER",
    },
    rows: "",
    options: {
      filter: false,
      download: false,
      responsive: "stacked",
      selectableRows: false,
      hover: true,
      ignoreFirstColumnHover: true,
      rowsPerPageOptions: [10, 15, 20],
    },
    customSortColumn: {
      column: "Birth Date",
      sortingFn: (data, i, sortDateOrder) => {
        const epochDates = data.reduce((acc, curr) => {
          acc.push([...curr, getEpochForDate(curr[4], "dayend")]);
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

const getActionButton = (value, tableMeta) => {
  return (
    <a
      href="javascript:void(0)"
      style={{
        color: "#FE7A51",
        cursor: "pointer",
      }}
      onClick={(value) => {
        let tenantId = tableMeta.rowData[8];
        let id = tableMeta.rowData[0];
        let action = tableMeta.rowData[7];
        let businessService = tableMeta.rowData[9];

        store.dispatch(
          prepareFinalObject("bnd.birth.download.certificateId", id)
        );
        store.dispatch(
          prepareFinalObject("bnd.birth.download.tenantId", tenantId)
        );
        store.dispatch(
          prepareFinalObject(
            "bnd.birth.download.businessService",
            businessService
          )
        );

        showHideConfirmationPopup(
          store.getState(),
          store.dispatch,
          "getCertificate"
        );
      }}
    >
      {getLocaleLabels(value, value)}
    </a>
  );
};

const getViewButton = (value, tableMeta) => {
  return (
    <a
      href="javascript:void(0)"
      style={{
        color: "#FE7A51",
        cursor: "pointer",
      }}
      onClick={(value) => {
        let id = tableMeta.rowData[0];
        let tenantId = tableMeta.rowData[8];
        let url = `/employee/bnd-common/fullViewCertificate?tenantId=${tenantId}&certificateId=${id}&module=birth`;
        document.location.href = `${document.location.origin}${url}`;
      }}
    >
      {getLocaleLabels(value, value)}
    </a>
  );
};
