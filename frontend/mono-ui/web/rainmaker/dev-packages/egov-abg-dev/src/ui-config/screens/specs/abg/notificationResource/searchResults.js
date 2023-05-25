import React from "react";
import { Link } from "react-router-dom";
import get from "lodash/get";
import { sortByEpoch, getEpochForDate } from "../../utils";
import { getLocalization } from "egov-ui-kit/utils/localStorageUtils";

const getLocalTextFromCode = localCode => {
  return JSON.parse(getLocalization("localization_en_IN")).find(
    item => item.code === localCode
  );
};

export const textToLocalMapping = {
  "Job ID No.": get(
    getLocalTextFromCode("NOC_COMMON_TABLE_COL_APP_NO"),
    "message",
    "Job ID No. "
  ),
  "Date Created": get(
    getLocalTextFromCode("NOC_COMMON_TABLE_COL_APP_DATE"),
    "message",
    "Date Created"
  ),
  "Status": get(
    getLocalTextFromCode("NOC_COMMON_TABLE_COL_OWN_NAME"),
    "message",
    "Status"
  ),

  //Download button
};

export const searchResults = {
  uiFramework: "custom-molecules",
  // moduleName: "egov-tradelicence",
  componentPath: "Table",
  visible: false,
  props: {
    // data: [],
    columns: {
      [get(textToLocalMapping, "Job ID No.")]: {
        format: rowData => {
          return (
            <Link to={onRowClick(rowData)}>
              <span
                style={{
                  color: "#FE7A51"
                }}
              >
                {rowData[get(textToLocalMapping, "Job ID No.")]}
              </span>
            </Link>
          );
        }
      },
      [get(textToLocalMapping, "Date Created")]: {},
      [get(textToLocalMapping, "Status")]: {},
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
      column: "Date Created",
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
  switch (rowData[get(textToLocalMapping, "")]) {
    default:
      return `/abg/notification`;
  }
  }
