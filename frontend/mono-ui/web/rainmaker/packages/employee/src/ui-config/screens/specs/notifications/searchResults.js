import { LabelContainer } from "egov-ui-framework/ui-containers";
import { handleScreenConfigurationFieldChange as handleField, toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { epochToYmd, getStatusKey, getUserDataFromUuid, transformById } from "egov-ui-framework/ui-utils/commons";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import { routeTo } from "egov-ui-kit/utils/PTCommon/FormWizardUtils/formActionUtils";
import get from "lodash/get";
import React from "react";
import { getEpochForDate, getEventsByType, sortByEpoch } from "../utils";

export const searchApiCall = async (state, dispatch) => {
  dispatch(handleField("search", "components.div.children.searchResults", "visible", false));
  const queryObject = [
    {
      key: "tenantId",
      value: getTenantId(),
    },
    { key: "eventTypes", value: "BROADCAST" },
    { key: "status", value: ["ACTIVE,INACTIVE"] },
  ];
  const events = await getEventsByType(queryObject);

  const uuidArray = [];
  events &&
    events.forEach((element) => {
      return uuidArray.push(element.auditDetails.lastModifiedBy);
    });

  let bodyObject = {
    uuid: uuidArray,
  };
  let response = await getUserDataFromUuid(bodyObject);
  const userResponse = response && transformById(response.user, "uuid");
  try {
    let data =
      events &&
      events.map((item) => {
        //const status = item.eventDetails && item.eventDetails.toDate > currentDate ? item.status : "INACTIVE";
        return {
          ["EVENTS_MESSAGE_LABEL"]: item && item.name,
          ["EVENTS_POSTING_DATE_LABEL"]: item && item.auditDetails && epochToYmd(item.auditDetails.lastModifiedTime),
          ["EVENTS_START_DATE_LABEL"]: item && item.eventDetails ? epochToYmd(item.eventDetails.fromDate) : "-",
          ["EVENTS_END_DATE_LABEL"]: item && item.eventDetails ? epochToYmd(item.eventDetails.toDate) : "-",
          ["EVENTS_POSTEDBY_LABEL"]: get(userResponse, item && item.auditDetails.lastModifiedBy, {}).name,
          ["EVENTS_STATUS_LABEL"]: item && item.status,
          ["ID"]: item && item.id,
          ["TENANT_ID"]: item && item.tenantId,
        };
      });
    dispatch(handleField("search", "components.div.children.searchResults", "visible", true));
    dispatch(handleField("search", "components.div.children.searchResults", "props.data", data));
    dispatch(handleField("search", "components.div.children.searchResults", "props.rows", data.length));
  } catch (error) {
    dispatch(toggleSnackbar(true, error.message, "error"));
  }
};

const onRowClick = (rowData) => {
  routeTo(`create?uuid=${rowData[7]}&tenantId=${rowData[6]}`);
};

export const searchResults = () => {
  return {
    uiFramework: "custom-molecules",
    componentPath: "Table",
    visible: false,
    props: {
      columns: [
        { labelName: "Message", labelKey: "EVENTS_MESSAGE_LABEL" },
        { labelName: "Posting Date", labelKey: "EVENTS_POSTING_DATE_LABEL" },
        { labelName: "Start Date", labelKey: "EVENTS_START_DATE_LABEL" },
        { labelName: "End Date", labelKey: "EVENTS_END_DATE_LABEL" },
        { labelName: "Posted By", labelKey: "EVENTS_POSTEDBY_LABEL" },
        {
          labelName: "Status",
          labelKey: "EVENTS_STATUS_LABEL",
          options: {
            filter: false,
            customBodyRender: (value) => (
              <LabelContainer
                style={value === "ACTIVE" ? { color: "green" } : { color: "red" }}
                labelKey={getStatusKey(value).labelKey}
                labelName={getStatusKey(value).labelName}
              />
            ),
          },
        },
        {
          labelName: "Tenant Id",
          labelKey: "TENANT_ID",
          options: {
            display: false,
          },
        },
        {
          labelName: "Id",
          labelKey: "ID",
          options: {
            display: false,
          },
        },
      ],
      title: { labelName: "Uploaded Messages", labelKey: "EVENTS_UPLOADED_MESSAGES_HEADER" },
      rows: "",
      options: {
        filter: true,
        download: false,
        responsive: "stacked",
        selectableRows: false,
        hover: true,
        rowsPerPageOptions: [10, 15, 20],
        onRowClick: (row, index) => {
          onRowClick(row);
        },
      },
      customSortColumn: {
        column: "Application Date",
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
};
