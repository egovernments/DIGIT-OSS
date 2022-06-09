import get from "lodash/get";
import set from "lodash/set";
import { getLabel, getSelectField, getCommonContainer, getCommonCard, convertDateToEpoch } from "egov-ui-framework/ui-config/screens/specs/utils";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { localStorageGet, getAccessToken } from "egov-ui-kit/utils/localStorageUtils";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getQueryArg, validateFields } from "egov-ui-framework/ui-utils/commons";
import { httpRequest } from "egov-ui-framework/ui-utils/api";
import { toggleSpinner } from "egov-ui-kit/redux/common/actions";
import store from "../../../../redux/store";
import { prepareFinalObject, handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import commonConfig from "config/common.js";
import cloneDeep from "lodash/cloneDeep";

export const getTodaysDateInYMD = () => {
  let date = new Date();
  let month = date.getMonth() + 1;
  let day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
  date = `${date.getFullYear()}-${month}-${day}`;
  return date;
};
export const getFinancialYearDates = (format, et) => {
  /** Return the starting date and ending date (1st April to 31st March)
   *  of the financial year of the given date in ET. If no ET given then
   *  return the dates for the current financial year */
  var date = !et ? new Date() : new Date(et);
  var curMonth = date.getMonth();
  var financialDates = { startDate: "NA", endDate: "NA" };
  if (curMonth > 3) {
    switch (format) {
      case "dd/mm/yyyy":
        financialDates.startDate = `01/04/${date.getFullYear().toString()}`;
        financialDates.endDate = `31/03/${(date.getFullYear() + 1).toString()}`;
        break;
      case "yyyy-mm-dd":
        financialDates.startDate = `${date.getFullYear().toString()}-04-01`;
        financialDates.endDate = `${(date.getFullYear() + 1).toString()}-03-31`;
        break;
      default: 
    }
  } else {
    switch (format) {
      case "dd/mm/yyyy":
        financialDates.startDate = `01/04/${(date.getFullYear() - 1).toString()}`;
        financialDates.endDate = `31/03/${date.getFullYear().toString()}`;
        break;
      case "yyyy-mm-dd":
        financialDates.startDate = `${(date.getFullYear() - 1).toString()}-04-01`;
        financialDates.endDate = `${date.getFullYear().toString()}-03-31`;
        break;
      default:  
    }
  }
  return financialDates;
};

export const convertEpochToDate = (dateEpoch) => {
  const dateFromApi = new Date(dateEpoch);
  let month = dateFromApi.getMonth() + 1;
  let day = dateFromApi.getDate();
  let year = dateFromApi.getFullYear();
  month = (month > 9 ? "" : "0") + month;
  day = (day > 9 ? "" : "0") + day;
  return `${year}/${month}/${day}`;
};

export const callBackForNext = async (state, dispatch, eventType, isDelete) => {
  store.dispatch(toggleSpinner());
  const isEvent = eventType === "EVENTSONGROUND" ? true : false;
  const uuid = getQueryArg(window.location.href, "uuid");
  const isNative = localStorageGet("isNative");
  const isFormValid = validateFields(
    "components.div.children.createCard.children.createForm.children.cardContent.children.createContainer.children",
    state,
    dispatch,
    "create"
  );
  const eventsData = cloneDeep(get(state.screenConfiguration.preparedFinalObject, "events[0]"));
  const fromEpochDate = get(eventsData, "eventDetails.fromDate");
  const toEpochDate = get(eventsData, "eventDetails.toDate");

  let fromDate = typeof fromEpochDate === "number" ? convertEpochToDate(fromEpochDate).replace(/[\/]/g, "-") : fromEpochDate;
  let toDate = typeof toEpochDate === "number" ? convertEpochToDate(toEpochDate).replace(/[\/]/g, "-") : toEpochDate;

  let fromTime = get(eventsData, "eventDetails.fromTime") ? get(eventsData, "eventDetails.fromTime") : "";
  let toTime = get(eventsData, "eventDetails.toTime") ? get(eventsData, "eventDetails.toTime") : "";

  let fromDateTime = `${fromDate} ${fromTime}`;
  let toDateTime = `${toDate} ${toTime}`;
  if (fromDateTime) {
    fromDateTime = isEvent ? convertDateTimeToEpoch(fromDateTime) : convertDateToEpoch(fromDate, "dayend");
    set(eventsData, "eventDetails.fromDate", fromDateTime);
  }
  if (toDateTime) {
    toDateTime = isEvent ? convertDateTimeToEpoch(toDateTime) : convertDateToEpoch(toDate, "dayend");
    set(eventsData, "eventDetails.toDate", toDateTime);
  }
  set(eventsData, "source", isNative ? "MOBILEAPP" : "WEBAPP");
  set(eventsData, "recepient", null);
  set(eventsData, "eventType", eventType);
  if (isDelete) {
    set(eventsData, "status", "CANCELLED");
  }
  if (uuid) {
    if (toDateTime > new Date().getTime() && get(eventsData, "status") === "INACTIVE") {
      set(eventsData, "status", "ACTIVE");
    }
  }
  const requestBody = {
    RequestInfo: {
      apiId: "org.egov.pt",
      ver: "1.0",
      ts: 1502890899493,
      action: "asd",
      did: "4354648646",
      key: "xyz",
      msgId: "654654",
      requesterId: "61",
      authToken: getAccessToken(),
    },
    events: [eventsData],
  };
  const baseUrl = isEvent ? "/events" : "/notifications";
  if (isFormValid) {
    if (!uuid) {
      let successMessage = eventType === "BROADCAST" ? "MESSAGE_ADD_SUCCESS_MESSAGE_MAIN" : "EVENT_ADD_SUCCESS_MESSAGE_MAIN";
      try {
        await httpRequest("post", "/egov-user-event/v1/events/_create", "_create", [], requestBody);
        store.dispatch(toggleSpinner());
        // dispatch(setRoute(`${baseUrl}/acknowledgement?purpose=${purpose}&status=${status}`));
        dispatch(setRoute(`${baseUrl}/search`));
        dispatch(toggleSnackbar(true, { labelKey: successMessage }, "success"));
      } catch (e) {
        dispatch(toggleSnackbar(true, { labelKey: e.message }, "error"));
        store.dispatch(toggleSpinner());
      }
    } else if (uuid) {
      let successMessage = isDelete ? "MESSAGE_DELETE_SUCCESS_LABEL" : "MESSAGE_UPDATE_SUCCESS_LABEL";
      try {
        await httpRequest("post", "/egov-user-event/v1/events/_update", "_update", [], requestBody);
        store.dispatch(toggleSpinner());
        dispatch(setRoute(`${baseUrl}/search`));
        dispatch(toggleSnackbar(true, { labelKey: successMessage }, "success"));
        // dispatch(setRoute(`${baseUrl}/acknowledgement?purpose=${purpose}&status=${status}`));
      } catch (e) {
        store.dispatch(toggleSpinner());
        dispatch(toggleSnackbar(true, { labelKey: e.message }, "error"));
      }
    }
  } else {
    store.dispatch(toggleSpinner());
    dispatch(toggleSnackbar(true, { labelName: "Invalid Input!", labelKey: "Invalid Input!" }, "error"));
  }
};

export const getEventsByType = async (queryObj) => {
  const requestBody = {
    apiId: "org.egov.pt",
    ver: "1.0",
    ts: 1502890899493,
    action: "asd",
    did: "4354648646",
    key: "xyz",
    msgId: "654654",
    requesterId: "61",
    authToken: getAccessToken(),
  };

  try {
    const payload = await httpRequest("post", "/egov-user-event/v1/events/_search", "_search", queryObj, requestBody);
    if (payload) {
      return payload.events;
    }
  } catch (e) {
  }
};

export const footer = (eventType = "BROADCAST") => {
  const uuid = getQueryArg(window.location.href, "uuid");
  return {
    uiFramework: "custom-atoms",
    componentPath: "Div",
    props: {
      className: "apply-wizard-footer",
    },
    children: {
      saveButton: {
        componentPath: "Button",
        props: {
          variant: "contained",
          color: "primary",
          className: uuid ? "button-wizard-footer" : "single-button-wizard-footer",
          // style: {
          //   minWidth: "200px",
          //   height: "48px",
          //   marginRight: "45px",
          // },
        },
        children: {
          submitButtonLabel: getLabel({
            labelName: uuid ? "SAVE" : eventType === "EVENTSONGROUND" ? "CREATE EVENT" : "ADD MESSAGE",
            labelKey: uuid ? "MESSAGE_SAVE_BUTTOM" : eventType === "EVENTSONGROUND" ? "EVENTS_CREATE_EVENT" : "ADD_MESSAGE_BUTTON",
          }),
        },
        onClickDefination: {
          action: "condition",
          callBack: (state, dispatch) => callBackForNext(state, dispatch, eventType),
        },
      },
      cancelButton: {
        componentPath: "Button",
        props: {
          variant: "contained",
          color: "primary",
          className: "button-wizard-footer",
          // style: {
          //   minWidth: "200px",
          //   height: "48px",
          //   marginRight: "45px",
          // },
        },
        children: {
          submitButtonLabel: getLabel({
            labelName: "CANCEL",
            labelKey: "MESSAGE_CANCEL_BUTTON",
          }),
        },
        onClickDefination: {
          action: "page_change",
          path: eventType === "EVENTSONGROUND" ? "/events/search" : "/notifications/search",
        },
        visible: uuid ? true : false,
      },
    },
  };
};

export const getMdmsData = async (action, state, dispatch) => {
  let mdmsBody = {
    MdmsCriteria: {
      tenantId: commonConfig.tenantId,
      moduleDetails: [
        {
          moduleName: "tenant",
          masterDetails: [
            {
              name: "tenants",
            },
          ],
        },
        {
          moduleName: "mseva",
          masterDetails: [
            {
              name: "EventCategories",
            },
          ],
        },
      ],
    },
  };
  try {
    let payload = null;
    payload = await httpRequest("post", "/egov-mdms-service/v1/_search", "_search", [], mdmsBody);
    const localities = get(state.screenConfiguration, "preparedFinalObject.applyScreenMdmsData.tenant.localities", []);
    dispatch(prepareFinalObject("applyScreenMdmsData", payload.MdmsRes));
  } catch (e) {
  }
};

export const getSingleMessage = async (state, dispatch, messageTenant, uuid) => {
  const queryObject = [
    {
      key: "tenantId",
      value: messageTenant,
    },
    {
      key: "ids",
      value: uuid,
    },
  ];
  const messageResponse = await getEventsByType(queryObject);
  //Thu Aug 08 2019 02:00:00 GMT+0530 (IST)
  const fromEpochDate = get(messageResponse[0], "eventDetails.fromDate");
  const toEpochDate = get(messageResponse[0], "eventDetails.toDate");

  if (get(messageResponse[0], "eventType") === "EVENTSONGROUND") {
    const fromTime = new Date(fromEpochDate)
      .toString()
      .split(" ")[4]
      .substring(0, 5);
    set(messageResponse[0], "eventDetails.fromTime", fromTime);
    const toTime = new Date(toEpochDate)
      .toString()
      .split(" ")[4]
      .substring(0, 5);
    set(messageResponse[0], "eventDetails.toTime", toTime);
  }
  messageResponse && dispatch(prepareFinalObject("events[0]", messageResponse[0]));
};

export const getDeleteButton = (eventType) => {
  const uuid = getQueryArg(window.location.href, "uuid");
  const isDelete = true;
  return {
    componentPath: "Button",
    gridDefination: {
      xs: 12,
      sm: 6,
      align: "right",
    },
    props: {
      variant: "contained",
      color: "primary",
      style: {
        color: "white",
        borderRadius: "2px",
        width: "250px",
        height: "48px",
      },
    },

    children: {
      buttonLabel: getLabel({
        labelName: eventType === "EVENTSONGROUND" ? "DELETE EVENT" : "DELETE MESSAGE",
        labelKey: eventType === "EVENTSONGROUND" ? "DELETE_EVENT_LABEL" : "MESSAGE_DELETE_BUTTON_LABEL",
      }),
    },
    onClickDefination: {
      action: "condition",
      callBack: (state, dispatch) => {
        const eventType = get(state.screenConfiguration.preparedFinalObject, "events[0].eventType");
        callBackForNext(state, dispatch, eventType, isDelete);
      },
    },
    visible: uuid ? true : false,
  };
};

export const ulbFilter = getCommonCard({
  container: getCommonContainer({
    ulb: getSelectField({
      label: {
        labelName: "ULB",
        labelKey: "EVENTS_ULB_LABEL",
      },
      localePrefix: {
        moduleName: "TENANT",
        masterName: "TENANTS",
      },
      optionLabel: "name",
      placeholder: { labelName: "Select City", labelKey: "TL_SELECT_CITY" },
      gridDefination: {
        xs: 12,
        sm: 3,
      },
      cityDropdown: "common.cities",
      // props: {
      //   data: [
      //     {
      //       value: getTenantId(),
      //       label: `TENANT_TENANTS_${getTransformedLocale(getTenantId())}`,
      //     },
      //   ],
      //   optionValue: "value",
      //   optionLabel: "label",
      // },
    }),
  }),
});

export const showHideMapPopup = (state, dispatch) => {
  let toggle = get(
    state.screenConfiguration.screenConfig["create"],
    "components.div.children.createCard.children.createForm.children.cardContent.children.mapsDialog.props.open",
    false
  );
  dispatch(
    handleField("create", "components.div.children.createCard.children.createForm.children.cardContent.children.mapsDialog", "props.open", !toggle)
  );
};

export const getMapLocator = (textSchema) => {
  return {
    uiFramework: "custom-molecules-local",
    moduleName: "employee",
    componentPath: "MapLocator",
    props: {},
  };
};

export const convertDateTimeToEpoch = (dateTimeString) => {
  //example input format : "2018-10-02 03:03"
  // const parts = dateString.match(/(\d{4})-(\d{1,2})-(\d{1,2})/);
  // const DateObj = new Date(Date.UTC(parts[1], parts[2] - 1, parts[3]));
  try {
    return new Date(dateTimeString).getTime();
  } catch (e) {
    return dateTimeString;
  }
};

export const getEpochForDate = (date) => {
  const dateSplit = date.split("/");
  return new Date(dateSplit[2], dateSplit[1] - 1, dateSplit[0]).getTime();
};

export const sortByEpoch = (data, order) => {
  if (order) {
    return data.sort((a, b) => {
      return a[a.length - 1] - b[b.length - 1];
    });
  } else {
    return data.sort((a, b) => {
      return b[b.length - 1] - a[a.length - 1];
    });
  }
};
