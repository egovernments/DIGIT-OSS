import React from "react";
import {
  getEpochForDate,
  getTextToLocalMapping,
  sortByEpoch
} from "../../utils";
import { setRoute } from "egov-ui-kit/utils/commons";

export const searchPropertyTable = {
  uiFramework: "custom-molecules-local",
  moduleName: "egov-pt",
  componentPath: "Table",
  visible: false,
  props: {
    className: "propertyTab",
    // data: [],
    columns: [
      getTextToLocalMapping("Property ID"),
      getTextToLocalMapping("Owner Name"),
      getTextToLocalMapping("Address"),
      getTextToLocalMapping("Property Status"),
      getTextToLocalMapping("Amount Due"),
      {
        name: getTextToLocalMapping("Action"),
        options: {
          filter: false,
          customBodyRender: value => (
			<span
			  onClick={() => {
				payAmount();
			  }}
			  style={{
				color: "#FE7A51",
				cursor: "pointer",
				textDecoration: "underline"
			  }}
			>
			  {value > 0 ? "PAY":""}
			</span>
		  )
        }
      },
      {
        name: "tenantId",
        options: {
          display: false
        }
      }
    ],
    title: getTextToLocalMapping("Search Results for Properties"),
    options: {
      filter: false,
      download: false,
      responsive: "stacked",
      selectableRows: false,
      hover: false,
      hint: "",
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

const payAmount = () => {
  const url = "commonPayUrl";
  setRoute(url);
};
