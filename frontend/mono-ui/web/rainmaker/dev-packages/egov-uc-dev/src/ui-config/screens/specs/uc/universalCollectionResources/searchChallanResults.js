import React from "react";
import { LabelContainer } from "egov-ui-framework/ui-containers";

import { getLocaleLabels, getStatusKey} from "egov-ui-framework/ui-utils/commons";

export const SearchChallanResults = {
  uiFramework: "custom-molecules",
  componentPath: "Table",
  visible: false,
  props: {
    columns: [
      {
        labelName: "Challan No",
        labelKey: "UC_CHALLAN_NO_LABEL",
        options: {
          filter: false,
          customBodyRender: (value, tableMeta) => (
              <a href="javascript:void(0)" onClick={() => onRowClick(tableMeta.rowData)}>{value}</a>
          )
        }
      },
           
      {
        labelName: "Consumer Name",
        labelKey: "UC_COMMON_TABLE_COL_PAYEE_NAME"
      },
      {
        labelName: "Service Type",
        labelKey: "UC_SERVICE_TYPE_LABEL"
      },
     
      {
        labelName: "Status",
        labelKey: "UC_COMMON_TABLE_COL_STATUS",
        options: {
          filter: false,
          customBodyRender: value => (
            <LabelContainer
              style={
                value.includes("CANCELLED") ?  { color: "red" } :{ color: "green" } 
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
          display: false,
          viewColumns  :false
        }
      },
      {
        labelName: "BusinessService",
        labelKey: "BUSINESS_SERVICE",
        options: {
          display: false,
          viewColumns  :false
        }
      },
     

    ],
    title: {
      labelName: "Search Results",
      labelKey: "COMMON_TABLE_SEARCH_RESULT"
    },
    rows : "",
    options: {
      filter: false,
      download: false,
      responsive: "stacked",
      selectableRows: false,
      hover: true,
      rowsPerPageOptions: [10, 15, 20]
    },
    customSortColumn: {}
    
  }
};

const onRowClick = rowData => {
  window.location.href = `search-preview?applicationNumber=${rowData[0]}&businessService=${rowData[5]}&tenantId=${rowData[4]}&status=${rowData[3]}`;

};
