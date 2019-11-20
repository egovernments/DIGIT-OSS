import React from "react";
import { handleScreenConfigurationFieldChange as handleField, toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {
  getLocaleLabels,
  getTransformedLocalStorgaeLabels,
  epochToYmd,
  getUserDataFromUuid,
  transformById,
} from "egov-ui-framework/ui-utils/commons";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import { getEventsByType, sortByEpoch, getEpochForDate } from "../utils";
import get from "lodash/get";

export const searchApiCall = async (state, dispatch) => {
  const localisationLabels = getTransformedLocalStorgaeLabels();
  const queryObject = [
    {
      key: "tenantId",
      value: getTenantId(),
    },
    { key: "eventTypes", value: "EVENTSONGROUND" },
  ];
  const events = await getEventsByType(queryObject);
  //var currentDate = new Date().getTime();
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
        //const status = item.eventDetails.toDate > currentDate ? item.status : "INACTIVE";
        return {
          [getLocaleLabels("Message", "EVENTS_EVENT_NAME_LABEL", localisationLabels)]: item.name,
          [getLocaleLabels("Event Category", "EVENTS_EVENT_CATEGORY_LABEL", localisationLabels)]: item.eventCategory
            ? getLocaleLabels(item.eventCategory, `MSEVA_EVENTCATEGORIES_${item.eventCategory}`, localisationLabels)
            : "-",
          [getLocaleLabels("Start Date", "EVENTS_START_DATE_LABEL", localisationLabels)]: item.eventDetails
            ? epochToYmd(item.eventDetails.fromDate)
            : "-",
          [getLocaleLabels("End Date", "EVENTS_END_DATE_LABEL", localisationLabels)]: item.eventDetails ? epochToYmd(item.eventDetails.toDate) : "-",
          [getLocaleLabels("Posted By", "EVENTS_POSTEDBY_LABEL", localisationLabels)]: get(userResponse, item.auditDetails.lastModifiedBy).name,
          [getLocaleLabels("Status", "EVENTS_STATUS_LABEL", localisationLabels)]: getLocaleLabels(
            item.status,
            `EVENTS_${item.status}_LABEL`,
            localisationLabels
          ),
          id: item.id,
          tenantId: item.tenantId,
        };
      });
    dispatch(handleField("search", "components.div.children.searchResults", "props.data", data));
  } catch (error) {
    dispatch(toggleSnackbar(true, error.message, "error"));
    console.log(error);
  }
};

const onRowClick = (rowData) => {
  window.location.href = `create?uuid=${rowData[7]}&tenantId=${rowData[6]}`;
};

export const searchResults = () => {
  const localisationLabels = getTransformedLocalStorgaeLabels();
  return {
    uiFramework: "custom-molecules",
    componentPath: "Table",
    props: {
      columns: [
        getLocaleLabels("Event Name", "EVENTS_EVENT_NAME_LABEL", localisationLabels),
        getLocaleLabels("Event Category", "EVENTS_EVENT_CATEGORY_LABEL", localisationLabels),
        getLocaleLabels("Start Date", "EVENTS_START_DATE_LABEL", localisationLabels),
        getLocaleLabels("End Date", "EVENTS_END_DATE_LABEL", localisationLabels),
        getLocaleLabels("Posted By", "EVENTS_POSTEDBY_LABEL", localisationLabels),
        {
          name: getLocaleLabels("Status", "EVENTS_STATUS_LABEL", localisationLabels),
          options: {
            filter: false,
            customBodyRender: (value) => <span style={value === "Active" ? { color: "#4CAF50" } : { color: "#F44336" }}> {value}</span>,
          },
        },
        {
          name: "tenantId",
          options: {
            display: false,
          },
        },
        {
          name: "id",
          options: {
            display: false,
          },
        },
      ],
      title: (
        <span
          style={{
            color: "rgba(0, 0, 0, 0.87)",
            fontWeight: 900,
          }}
        >
          {getLocaleLabels("Created Events", "EVENTS_CREATED_EVENTS_HEADER", localisationLabels)}
        </span>
      ),

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
