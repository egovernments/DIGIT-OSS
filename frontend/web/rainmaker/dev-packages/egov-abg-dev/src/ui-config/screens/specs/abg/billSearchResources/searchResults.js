import React from "react";
import { Link } from "react-router-dom";
import get from "lodash/get";
import { sortByEpoch, getEpochForDate, gotoApplyWithStep } from "../../utils";
import { generateSingleBill } from "../../utils/receiptPdf";
import { getLocalization } from "egov-ui-kit/utils/localStorageUtils";
// import { generateBill } from "../../utils/recieptPdf";
import {
  getTransformedLocalStorgaeLabels,
  getLocaleLabels
} from "egov-ui-framework/ui-utils/commons";

const getLocalTextFromCode = localCode => {
  return JSON.parse(getLocalization("localization_en_IN")).find(
    item => item.code === localCode
  );
};

export const textToLocalMapping = {
  "Bill No.": getLocaleLabels(
    "Bill No.",
    "ABG_COMMON_TABLE_COL_BILL_NO",
    getTransformedLocalStorgaeLabels()
  ),
  "Consumer Name": getLocaleLabels(
    "Consumer Name",
    "ABG_COMMON_TABLE_COL_CONSUMER_NAME﻿",
    getTransformedLocalStorgaeLabels()
  ),
  "Service Category": getLocaleLabels(
    "Service Category",
    "ABG_COMMON_TABLE_COL_SERVICE_CATEGORY",
    getTransformedLocalStorgaeLabels()
  ),
  "Bill Date": getLocaleLabels(
    "Bill Date",
    "ABG_COMMON_TABLE_COL_BILL_DATE",
    getTransformedLocalStorgaeLabels()
  ),
  "Bill Amount[INR]": getLocaleLabels(
    "Bill Amount[INR]",
    "ABG_COMMON_TABLE_COL_BILL_AMOUNT",
    getTransformedLocalStorgaeLabels()
  ),

  Status: getLocaleLabels(
    "Status",
    "ABG_COMMON_TABLE_COL_STATUS",
    getTransformedLocalStorgaeLabels()
  ),
  Action: getLocaleLabels(
    "Action",
    "ABG_COMMON_TABLE_COL_ACTION",
    getTransformedLocalStorgaeLabels()
  )
};

export const searchResults = {
  uiFramework: "custom-molecules",
  // moduleName: "egov-tradelicence",
  componentPath: "Table",
  visible: false,
  props: {
    // data: [],
    columns: {
      [get(textToLocalMapping, "Bill No.")]: {
        format: rowData => {
          return (
            <Link to={() => generateSingleBill(rowData)}>
              <span
                style={{
                  color: "#FE7A51",
                  cursor: "pointer",
                  textDecoration: "underline"
                }}
              >
                {rowData[get(textToLocalMapping, "Bill No.")]}
              </span>
            </Link>
          );
        }
      },
      [get(textToLocalMapping, "Consumer Name")]: {},
      [get(textToLocalMapping, "Service Category")]: {},
      [get(textToLocalMapping, "Bill Date")]: {},
      [get(textToLocalMapping, "Bill Amount[INR]")]: {},
      [get(textToLocalMapping, "Status")]: {},
      [get(textToLocalMapping, "Action")]: {
        format: rowData => {
          return (
            <span
              style={{
                color: "#FE7A51",
                cursor: "pointer"
              }}
              // onClick={() => getAction(rowData)}
            >
              {rowData[get(textToLocalMapping, "Action")]}
            </span>
            // <span style="cursor:pointer">pointer</span>
          );
        }
      }
    },
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

// const onRowClick = rowData => {
//   switch (rowData[get(textToLocalMapping, "Status")]) {
//     case get(textToLocalMapping, "PAID"):
//       return goToDownloadBill;
//     case get(textToLocalMapping, "PARTIALLY PAID"):
//       return gotoPay;
//     case get(textToLocalMapping, "PARTIALLY PAID"):
//       return gotoPayForFullPayment;
//     case get(textToLocalMapping, "PARTIALLY PAID"):
//       return gotoPayWithUpdatedBillNumber;
//     default:
//       return;
//   }
// };
