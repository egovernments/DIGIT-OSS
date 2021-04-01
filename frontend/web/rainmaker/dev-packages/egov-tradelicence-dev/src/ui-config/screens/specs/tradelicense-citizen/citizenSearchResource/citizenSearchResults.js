import {
  sortByEpoch,
  getEpochForDate,
  getTextToLocalMapping
} from "../../utils";
import { routeTo } from "egov-ui-kit/utils/PTCommon/FormWizardUtils/formActionUtils";

export const searchResults = {
  uiFramework: "custom-molecules",
  componentPath: "Table",
  visible: true,
  props: {
    data: [],
    columns: [
      {
        labelName: "Application No",
        labelKey: "TL_COMMON_TABLE_COL_APP_NO",
        options: {
          filter: false,
          customBodyRender: (value, tableMeta) => (
              <a href="javascript:void(0)" onClick={() => onRowClick(tableMeta.rowData)}>{value}</a>
          )
        }
      },
      {
        labelName: "License No",
        labelKey: "TL_COMMON_TABLE_COL_LIC_NO"
      },
      {
        labelName: "Trade Name",
        labelKey: "TL_COMMON_TABLE_COL_TRD_NAME"
      },
      {
        labelName: "Owner Name",
        labelKey: "TL_COMMON_TABLE_COL_OWN_NAME"
      },
      {
        labelName: "Application Date",
        labelKey: "TL_COMMON_TABLE_COL_APP_DATE"
      },
      {
        labelName: "Status",
        labelKey: "TL_COMMON_TABLE_COL_STATUS"
      },
      {
        labelName: "Tenant Id",
        labelKey: "TENANT_ID",
        options: {
          display: false
        }
      }
    ],
    // columns: {
    //   [get(textToLocalMapping, "Application No")]: {
    //     format: rowData => {
    //       return (
    //         <Link to={onRowClick(rowData)}>
    //           {rowData[get(textToLocalMapping, "Application No")]}
    //         </Link>
    //       );
    //     }
    //   },
    //   [get(textToLocalMapping, "License No")]: {},
    //   [get(textToLocalMapping, "Trade Name")]: {},
    //   [get(textToLocalMapping, "Owner Name")]: {},
    //   [get(textToLocalMapping, "Application Date")]: {},
    //   [get(textToLocalMapping, "Status")]: {
    //     format: rowData => {
    //       let value = rowData[get(textToLocalMapping, "Status")];
    //       let color = "";
    //       if (value.indexOf(get(textToLocalMapping, "APPROVED")) !== -1) {
    //         color = "green";
    //       } else {
    //         color = "red";
    //       }
    //       return (
    //         <span
    //           style={{
    //             color: color,
    //             fontSize: "14px",
    //             fontWeight: 400
    //           }}
    //         >
    //           {value}
    //         </span>
    //       );
    //     }
    //   }
    // },
    title: {
      labelName: "MY_APPLICATIONS",
      labelKey: "TL_MY_APPLICATIONS"
    },
    options: {
      filter: false,
      download: false,
      responsive: "scroll",
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

const onRowClick = rowData => {
  switch (rowData[5]) {
    case "INITIATED":
      routeTo(`apply?applicationNumber=${rowData[0]}&tenantId=${
        rowData[6]
      }`);
      break;
    default:
      routeTo(`search-preview?applicationNumber=${
        rowData[0]
      }&tenantId=${rowData[6]}`);
      break;
  }
};
