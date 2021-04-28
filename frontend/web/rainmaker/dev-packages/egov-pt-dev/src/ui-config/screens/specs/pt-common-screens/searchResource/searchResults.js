import { LabelContainer } from "egov-ui-framework/ui-containers";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { getQueryArg, getStatusKey } from "egov-ui-framework/ui-utils/commons";
import React from "react";
import store from "ui-redux/store";
import { getEpochForDate, sortByEpoch } from "../../utils";
import get from "lodash/get";

export const getQueryRedirectUrl = () => {
  let url = getQueryArg(window.location.href, "redirectUrl");
  const isMode = getQueryArg(window.location.href, "mode");
  if (isMode === "MODIFY") {
    const connectionNumber = getQueryArg(window.location.href, "connectionNumber");
    const tenantId = getQueryArg(window.location.href, "tenantId");
    const action = getQueryArg(window.location.href, "action");
    const modeaction = getQueryArg(window.location.href, "modeaction");
    let returnUrl= `${url}&connectionNumber=${connectionNumber}&tenantId=${tenantId}&action=${action}&mode=${isMode}`;
    returnUrl= modeaction?returnUrl+'&modeaction='+modeaction:returnUrl;
    return returnUrl;
  } else {
    url =url.includes('?')?url: url + '?';
    let applicationNo = getQueryArg(window.location.href, "applicationNumber");
    const connectionNo = getQueryArg(window.location.href, "connectionNumber");
    const actionType = getQueryArg(window.location.href, "action");
    url = applicationNo &&!url.includes('applicationNumber') ? url + `&applicationNumber=${applicationNo}` : url;
    url = connectionNo  &&!url.includes('connectionNumber')? url + `&connectionNumber=${connectionNo}` : url;
    url = actionType  &&!url.includes('action')? url + `&action=${actionType}` : url;
    return url;
  }



};


export const searchPropertyTable = {
  uiFramework: "custom-molecules",
  moduleName: "egov-pt",
  componentPath: "Table",
  visible: false,
  props: {
    columns: [
      {
        name: "Unique Property ID",
        labelKey: "PT_COMMON_TABLE_COL_PT_ID",
        options: {
          filter: false,
          customBodyRender: (value) => {
            return (
              <span style={{ color: "black", cursor: "auto" }}>
                {value}
              </span>
            )
          }
        }
      },


      { name: "Owner Name", labelKey: "PT_COMMON_TABLE_COL_OWNER_NAME" },
      { name: "Address", labelKey: "PT_COMMON_COL_ADDRESS" },
      {
        name: "Action",
        labelKey: "PT_COMMON_TABLE_COL_ACTION_LABEL",
        options: {
          filter: false,
          customBodyRender: (value, data) => {
            let styleSelect = {}
            styleSelect.color = "red"
            styleSelect.cursor = (data.rowData[3] !== "INACTIVE") ? "pointer" : "initial";
            return (
              <LabelContainer style={styleSelect} onClick={() => { getSelect(data) }}
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
    title: { labelKey: "PT_HOME_PROPERTY_RESULTS_TABLE_HEADING", labelName: "Search Results for Properties" },
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

const getSelect = data => {
  let storeData = store.getState();
  let isCheckFromWNS = get(storeData, "screenConfiguration.preparedFinalObject.applyScreenMdmsData.isCheckFromWNS", false);
  if (isCheckFromWNS) {
    if (data.rowData[3] != 'SELECT') {
      return false;
    }
    const isMode = getQueryArg(window.location.href, "mode");
    if (isMode === "MODIFY") {
      store.dispatch(
        setRoute(`${getQueryRedirectUrl()}&propertyId=${data.rowData[0]}`)
      )
    } else {
      store.dispatch(
        setRoute(`${getQueryRedirectUrl()}&propertyId=${data.rowData[0]}&tenantId=${data.rowData[4]}`)
      )
    }
  } else {
    // if ((data.rowData[3] !== 'SELECT') || (data.rowData[3] !== 'INWORKFLOW') ) {
    //   return false;
    // }
    let isSelectApp = true, isInWorkflowApp = true;
    if(data.rowData[3] != 'SELECT') isSelectApp = false;
    if(data.rowData[3] != 'INWORKFLOW') isInWorkflowApp = false;
    if(!isSelectApp && !isInWorkflowApp) {
      return false;
    }
    const isMode = getQueryArg(window.location.href, "mode");
    if (isMode === "MODIFY") {
      store.dispatch(
        setRoute(`${getQueryRedirectUrl()}&propertyId=${data.rowData[0]}`)
      )
    } else {
      store.dispatch(
        setRoute(`${getQueryRedirectUrl()}&propertyId=${data.rowData[0]}&tenantId=${data.rowData[4]}`)
      )
    }
  }
}
