import React from "react";
import { LabelContainer } from "egov-ui-framework/ui-containers";
import { getQueryArg, getStatusKey } from "egov-ui-framework/ui-utils/commons";
import { getEpochForDate, sortByEpoch } from "../../utils";

const url = getQueryArg(
  window.location.href,
  "redirectUrl"
);

export const searchPropertyTable = {
  uiFramework: "custom-molecules",
  moduleName:"egov-pt",
  componentPath: "Table",
  visible: false,
  props: {
    columns: [
      {
       name: "Unique Property ID",
       labelKey: "PT_COMMON_TABLE_COL_PT_ID",  
       options: {
        filter: false,
        customBodyRender: (value) =>{
        return(
           <span style={{ color: "black",cursor: "auto" }}>
            {value}
          </span>
        )
      }
      }
    },
     

      {name: "Owner Name", labelKey: "PT_COMMON_TABLE_COL_OWNER_NAME"},
      {name: "Address", labelKey: "PT_COMMON_COL_ADDRESS"},
      {
        name: "Action",
        labelKey: "PT_COMMON_TABLE_COL_ACTION_LABEL",
        options: {
          filter: false,
          customBodyRender: (value,data) =>{
            let styleSelect = {}
                styleSelect.color = "red"
                styleSelect.cursor= (data.rowData[3] !== "INACTIVE")?"pointer":"initial";
          return(
            <LabelContainer style={styleSelect} onClick={() => { getSelect(data)}}
              labelKey={getStatusKey(value).labelKey}
              labelName={getStatusKey(value).labelName}
            />             
          )
        }
        }
      },
      {
        name: "tenantId",
        labelKey: "PT_COMMON_TABLE_COL_TENANTID_LABEL",
        options: {
          display: false
        }
      }
    ],    
    title: {labelKey:"PT_HOME_PROPERTY_RESULTS_TABLE_HEADING", labelName:"Search Results for Properties"},
    rows:"",
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

const getSelect=data=>{
  if(data.rowData[3] === 'INACTIVE'){
    return false;
  }

  if(process.env.REACT_APP_NAME == "Citizen"){
    window.location.href=`/citizen${url}?propertyId=${data.rowData[0]}&tenantId=${data.rowData[4]}`
  }else{
    window.location.href=`/employee${url}?propertyId=${data.rowData[0]}&tenantId=${data.rowData[4]}`
  }
}
