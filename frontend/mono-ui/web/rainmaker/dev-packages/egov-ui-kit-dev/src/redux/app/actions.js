import commonConfig from "config/common";
import { httpRequest } from "egov-ui-kit/utils/api";
import { getCurrentAddress, getTransformedNotifications } from "egov-ui-kit/utils/commons";
import { ACTIONMENU, EVENTSCOUNT, LOCALATION, MDMS, NOTIFICATIONS } from "egov-ui-kit/utils/endPoints";
import { getLocale, getTenantId, localStorageSet, setLocale } from "egov-ui-kit/utils/localStorageUtils";
import { debug } from "util";
import { INBOXESCALTEDRECORDS, INBOXRECORDS, INBOXRECORDSCOUNT } from "../../utils/endPoints";
import { getLocalizationLabels, getModule, getStoredModulesList, setStoredModulesList } from "../../utils/localStorageUtils";
import * as actionTypes from "./actionTypes";

export const updateActiveRoute = (routePath, menuName) => {
  localStorageSet("menuPath", routePath);
  localStorageSet("menuName", menuName);
  return { type: actionTypes.UPDATE_ACTIVE_ROUTE_PATH, routePath };
};

export const setRoute = (route) => {
  return { type: actionTypes.SET_ROUTE, route };
};

export const setPreviousRoute = (route) => {
  return { type: actionTypes.SET_PREVIOUS_ROUTE, route };
};

export const setBottomNavigationIndex = (bottomNavigationIndex) => {
  return { type: actionTypes.CHANGE_BOTTOM_NAVIGATION_INDEX, bottomNavigationIndex };
};

export const setLocalizationLabels = (locale, localizationLabels) => {
  window.localStorage.setItem(`localization_${locale}`, JSON.stringify(localizationLabels));
  setLocale(locale);
  return { type: actionTypes.ADD_LOCALIZATION, locale, localizationLabels };
};

export const toggleSnackbarAndSetText = (open, message = {}, variant) => {
  return {
    type: actionTypes.SHOW_TOAST,
    open,
    message,
    variant,
  };
};

export const fetchLocalizationLabel = (locale = 'en_IN', module, tenantId, isFromModule) => {
  return async (dispatch) => {
    let storedModuleList = [];
    if (getStoredModulesList() !== null) {
      storedModuleList = JSON.parse(getStoredModulesList());
    }
    const moduleName = getModule();
    let localeModule;
    if (moduleName === 'rainmaker-common') {
      localeModule = 'rainmaker-common';
    }
    else if (storedModuleList.includes('rainmaker-common')) {
      localeModule = moduleName;
    }
    else {
      localeModule = moduleName ? `rainmaker-common,${moduleName}` : `rainmaker-common`;
    }
    try {
      let resultArray = [], tenantModule = "", isCommonScreen;
      if (module != null) {
        tenantModule = `rainmaker-${module}`;
      }

      if ((window.location.href.includes("/language-selection") || window.location.href.includes("/user/register") || window.location.href.includes("/user/login") || window.location.href.includes("/withoutAuth"))) {
        if ((moduleName && storedModuleList.includes(moduleName) === false) || moduleName == null) isCommonScreen = true;
      }

      if ((window.location.href.includes("/inbox"))) {
        if (moduleName && storedModuleList.includes(`rainmaker-common`)) isFromModule = false;
      }

      if ((moduleName && storedModuleList.includes(moduleName) === false) || isFromModule || isCommonScreen) {
        const payload1 = await httpRequest(LOCALATION.GET.URL, LOCALATION.GET.ACTION, [
          { key: "module", value: localeModule },
          { key: "locale", value: locale },
          { key: "tenantId", value: commonConfig.tenantId },
        ]);
        resultArray = [...payload1.messages];
      }

      if ((module && storedModuleList.includes(tenantModule) === false)) {
        storedModuleList.push(tenantModule);
        var newList = JSON.stringify(storedModuleList);
        const payload2 = module
          ? await httpRequest(LOCALATION.GET.URL, LOCALATION.GET.ACTION, [
            { key: "module", value: `rainmaker-${module}` },
            { key: "locale", value: locale },
            { key: "tenantId", value: tenantId ? tenantId : commonConfig.tenantId },
          ])
          : [];
        if (payload2 && payload2.messages) {
          setStoredModulesList(newList);
          resultArray = [...resultArray, ...payload2.messages];
        }
      }

      let prevLocalisationLabels = [];
      if (getLocalizationLabels() != null && !isCommonScreen && storedModuleList.length > 0) {
        prevLocalisationLabels = JSON.parse(getLocalizationLabels());
      }
      resultArray = [...prevLocalisationLabels, ...resultArray];
      localStorage.removeItem(`localization_${getLocale()}`);
      dispatch(setLocalizationLabels(locale, resultArray));
    } catch (error) {
    }
  };
};

export const fetchLocalizationLabelForOpenScreens= (locale = 'en_IN', module, tenantId, isFromModule) => {
  return async (dispatch) => {
    let storedModuleList = [];
    if (getStoredModulesList() !== null) {
      storedModuleList = JSON.parse(getStoredModulesList());
    }
    const moduleName = getModule();
    let localeModule;
    if (moduleName === 'rainmaker-common') {
      localeModule = 'rainmaker-common';
    }
    else if (storedModuleList.includes('rainmaker-common')) {
      localeModule = moduleName;
    }
    else {
      localeModule = moduleName ? `rainmaker-common,${moduleName}` : `rainmaker-common`;
    }
    try {
      let resultArray = [], tenantModule = "", isCommonScreen;
      if (module != null) {
        tenantModule = `rainmaker-${module}`;
      }


      if ((module && storedModuleList.includes(tenantModule) === false)) {
        storedModuleList.push(tenantModule);
        const payload2 = module
          ? await httpRequest(LOCALATION.GET.URL, LOCALATION.GET.ACTION, [
            { key: "module", value: `rainmaker-${module}` },
            { key: "locale", value: locale },
            { key: "tenantId", value: tenantId ? tenantId : commonConfig.tenantId },
          ])
          : [];
        if (payload2 && payload2.messages) {
          resultArray = [...resultArray, ...payload2.messages];
        }
      }

      let prevLocalisationLabels = [];
      if (getLocalizationLabels() != null && !isCommonScreen && storedModuleList.length > 0) {
        prevLocalisationLabels = JSON.parse(getLocalizationLabels());
      }
      resultArray = [...prevLocalisationLabels, ...resultArray];
      localStorage.removeItem(`localization_${getLocale()}`);
      dispatch(setLocalizationLabels(locale, resultArray));
    } catch (error) {
    }
  };
};


const setActionItems = (payload) => {
  return {
    type: actionTypes.FETCH_ACTIONMENU,
    payload,
  };
};

const fetchInboxCount = (payload) => {
  return {
    type: actionTypes.FETCH_INBOX_COUNT,
    payload,
  };
};
const fetchInboxRecords = (payload) => {
  return {
    type: actionTypes.FETCH_INBOX_RECORDS,
    payload,
  };
};
const fetchInboxRecordsError = (payload) => {
  return {
    type: actionTypes.FETCH_INBOX_RECORDS_ERROR,
    payload
  };
};
const fetchInboxRecordsPending = () => {
  return {
    type: actionTypes.FETCH_INBOX_RECORDS_PENDING,
  };
};
const fetchRemInboxRecords = (payload) => {
  return {
    type: actionTypes.FETCH_REM_INBOX_RECORDS_COMPLETE,
    payload,
  };
};
const fetchResetInboxRecords = () => {
  return {
    type: actionTypes.FETCH_RESET_INBOX_RECORDS,
  };
};

const fetchRemInboxRecordsError = (payload) => {
  return {
    type: actionTypes.FETCH_REM_INBOX_RECORDS_ERROR,
    payload
  };
};
const fetchRemInboxRecordsPending = () => {
  return {
    type: actionTypes.FETCH_REM_INBOX_RECORDS_PENDING,
  };
};
const fetchActionItemsError = (payload) => {
  return {
    type: actionTypes.FETCH_ACTIONMENU_ERROR,
    payload
  };
};
const fetchActionItemsPending = () => {
  return {
    type: actionTypes.FETCH_ACTIONMENU_PENDING,
  };
};

const setCurrentLocation = (currentLocation) => {
  return {
    type: actionTypes.SET_USER_CURRENT_LOCATION,
    currentLocation,
  };
};

export const addBreadCrumbs = (url) => {
  return { type: actionTypes.ADD_BREADCRUMB_ITEM, url };
};

export const fetchCurrentLocation = () => {
  return async (dispatch) => {
    const currAddress = await getCurrentAddress();
    dispatch(setCurrentLocation(currAddress));
  };
};
export const fetchActionItems = (role, ts) => {
  return async (dispatch, getState) => {
    dispatch(fetchActionItemsPending());
    try {
      const payload = await httpRequest(ACTIONMENU.GET.URL, ACTIONMENU.GET.ACTION, [], role, [], ts);
      let inboxPath = process.env.NODE_ENV === "production" ? "/employee/inbox" : "/inbox";
      if (payload &&
        window.location.pathname == inboxPath &&
        payload.actions &&
        Array.isArray(payload.actions) &&
        payload.actions.some &&
        payload.actions.some((x) => x.name == "rainmaker-common-workflow")) {

        const state = getState();
        const { app } = state;
        const { inbox } = app;
        const { loaded = false, loading = false } = inbox || {};
        // loaded == false && loading == false && dispatch(fetchInboxRecordsCount());
        // loaded == false && loading == false && dispatch(fetchRecords());
      }
      dispatch(setActionItems(payload.actions));
    } catch (error) {
      dispatch(fetchActionItemsError(error.message));
      // dispatch(complaintFetchError(error.message));
    }
  };
};


export const setUiCommonConfig = (payload) => {
  return {
    type: actionTypes.FETCH_UI_COMMON_CONFIG,
    payload,
  };
};

export const setUiCommonConstants = (payload) => {
  return {
    type: actionTypes.FETCH_UI_COMMON_CONSTANTS,
    payload,
  };
};

export const fetchUiCommonConfig = () => {
  debug;
  return async (dispatch) => {
    const requestBody = {
      MdmsCriteria: {
        tenantId: commonConfig.tenantId,
        moduleDetails: [
          {
            moduleName: "common-masters",
            masterDetails: [
              {
                name: "uiCommonConfig",
              },
            ],
          },
        ],
      },
    };
    try {
      const payload = await httpRequest(MDMS.GET.URL, MDMS.GET.ACTION, [], requestBody);
      const { MdmsRes } = payload;
      const commonMasters = MdmsRes["common-masters"];
      const UiCommonConfig = commonMasters["uiCommonConfig"];
      dispatch(setUiCommonConfig(UiCommonConfig[0]));
    } catch (error) {
    }
  };
};

export const fetchUiCommonConstants = () => {
  debug;
  return async (dispatch) => {
    const requestBody = {
      MdmsCriteria: {
        tenantId: commonConfig.tenantId,
        moduleDetails: [
          {
            moduleName: "common-masters",
            masterDetails: [
              {
                name: "uiCommonConstants",
              },
            ],
          },
        ],
      },
    };
    try {
      const payload = await httpRequest(MDMS.GET.URL, MDMS.GET.ACTION, [], requestBody);
      const { MdmsRes } = payload;
      const commonMasters = MdmsRes["common-masters"];
      const UiCommonConstants = commonMasters["uiCommonConstants"];
      dispatch(setUiCommonConstants(UiCommonConstants[0]));
    } catch (error) {
    }
  };
};

export const setNotificationCount = (count) => {
  return {
    type: actionTypes.GET_NOTIFICATION_COUNT,
    count,
  };
};

export const getNotificationCount = (queryObject, requestBody) => {
  return async (dispatch, getState) => {
    try {
      const payload = await httpRequest(EVENTSCOUNT.GET.URL, EVENTSCOUNT.GET.ACTION, queryObject, requestBody);
      dispatch(setNotificationCount(payload.unreadCount));
    } catch (error) {
    }
  };
};

export const setNotificationsComplete = (payload) => {
  return {
    type: actionTypes.GET_NOTIFICATIONS_COMPLETE,
    payload,
  };
};

const setNotificationsPending = () => {
  return {
    type: actionTypes.GET_NOTIFICATIONS_PENDING,
  };
};

const setNotificationsError = () => {
  return {
    type: actionTypes.GET_NOTIFICATIONS_ERROR,
  };
};

export const getNotifications = (queryObject, requestBody) => {
  return async (dispatch, getState) => {
    dispatch(setNotificationsPending());
    try {
      const payload = await httpRequest(NOTIFICATIONS.GET.URL, NOTIFICATIONS.GET.ACTION, queryObject, requestBody);
      const transformedEvents = await getTransformedNotifications(payload.events);
      dispatch(setNotificationsComplete(transformedEvents));
    } catch (error) {
      dispatch(setNotificationsError(error.message));
    }
  };
};

export const fetchInboxRecordsCount = () => {
  return async (dispatch, getState) => {
    try {
      const tenantId = getTenantId();
      const requestBody = [{ key: "tenantId", value: tenantId }];
      const payload = await httpRequest(INBOXRECORDSCOUNT.GET.URL, INBOXRECORDSCOUNT.GET.ACTION, requestBody);
      const state = getState();
      const { app } = state;
      const { inboxRemData } = app;
      const { loaded: remainingDataLoaded = false } = inboxRemData || {};
      remainingDataLoaded == false && payload > 100 && dispatch(fetchRemRecords(payload))
      dispatch(fetchInboxCount(payload));
    } catch (error) {
      dispatch(fetchInboxRecordsError(error.message));

    }
  };
};
export const fetchRecords = () => {
  return async (dispatch, getState) => {
    dispatch(fetchInboxRecordsPending());
    try {
      const tenantId = getTenantId();
      const requestBody = [{ key: "tenantId", value: tenantId }, { key: "offset", value: 0 }, { key: "limit", value: 100 }];
      const escRequestBody = [{ key: "tenantId", value: tenantId }];
      let payload = await httpRequest(INBOXRECORDS.GET.URL, INBOXRECORDS.GET.ACTION, requestBody);
      if (payload.ProcessInstances && payload.ProcessInstances.length > 0 && payload.ProcessInstances.length != 100) {
        let escalatedPayload = await httpRequest(INBOXESCALTEDRECORDS.GET.URL, INBOXESCALTEDRECORDS.GET.ACTION, escRequestBody);
        escalatedPayload.ProcessInstances && escalatedPayload.ProcessInstances.length > 0 &&
          escalatedPayload.ProcessInstances.forEach(data => {
            data.isEscalatedApplication = true;
            payload.ProcessInstances.push(data);
          })
      }
      dispatch(fetchInboxRecords(payload.ProcessInstances));
    } catch (error) {
      dispatch(fetchInboxRecordsError(error.message));
    }
  };
};
export const fetchRemRecords = (count = 0) => {
  return async (dispatch, getState) => {
    dispatch(fetchRemInboxRecordsPending());
    try {
      const tenantId = getTenantId();
      count = localStorage.getItem('jk-test-inbox-record-count') || count;
      const requestBody = [{ key: "tenantId", value: tenantId }, { key: "offset", value: 100 }, { key: "limit", value: count - 100 }];
      const escRequestBody = [{ key: "tenantId", value: tenantId }];
      let payload = await httpRequest(INBOXRECORDS.GET.URL, INBOXRECORDS.GET.ACTION, requestBody);
      if (payload.ProcessInstances && payload.ProcessInstances.length > 0) {
        let escalatedPayload = await httpRequest(INBOXESCALTEDRECORDS.GET.URL, INBOXESCALTEDRECORDS.GET.ACTION, escRequestBody);
        escalatedPayload.ProcessInstances && escalatedPayload.ProcessInstances.length > 0 &&
          escalatedPayload.ProcessInstances.forEach(data => {
            data.isEscalatedApplication = true;
            payload.ProcessInstances.push(data);
          })
      }
      dispatch(fetchRemInboxRecords(payload.ProcessInstances));
    } catch (error) {
      dispatch(fetchRemInboxRecordsError(error.message));
    }
  };
};
export const resetFetchRecords = () => {
  return async (dispatch, getState) => {
    dispatch(fetchResetInboxRecords());
  };
};