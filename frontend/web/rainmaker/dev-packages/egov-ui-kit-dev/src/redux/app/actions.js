import * as actionTypes from "./actionTypes";
import { LOCALATION, ACTIONMENU, MDMS, EVENTSCOUNT, NOTIFICATIONS } from "egov-ui-kit/utils/endPoints";
import { httpRequest } from "egov-ui-kit/utils/api";
import { getCurrentAddress, getTransformedNotifications } from "egov-ui-kit/utils/commons";
import commonConfig from "config/common";
import { debug } from "util";
import { setLocale, localStorageSet } from "egov-ui-kit/utils/localStorageUtils";

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

const setLocalizationLabels = (locale, localizationLabels) => {
  window.localStorage.setItem(`localization_${locale}`, JSON.stringify(localizationLabels));
  setLocale(locale);
  return { type: actionTypes.ADD_LOCALIZATION, locale, localizationLabels };
};

export const toggleSnackbarAndSetText = (open, message = {}, error) => {
  return {
    type: actionTypes.SHOW_TOAST,
    open,
    message,
    error,
  };
};

export const fetchLocalizationLabel = (locale, module, tenantId) => {
  return async (dispatch) => {
    const commonModules = "rainmaker-pgr,rainmaker-pt,rainmaker-tl,finance-erp,rainmaker-common,rainmaker-hr,rainmaker-uc,rainmaker-noc";
    try {
      const payload1 = await httpRequest(LOCALATION.GET.URL, LOCALATION.GET.ACTION, [
        { key: "module", value: commonModules },
        { key: "locale", value: locale },
        { key: "tenantId", value: commonConfig.tenantId },
      ]);
      const payload2 = module
        ? await httpRequest(LOCALATION.GET.URL, LOCALATION.GET.ACTION, [
            { key: "module", value: `rainmaker-${module}` },
            { key: "locale", value: locale },
            { key: "tenantId", value: tenantId ? tenantId : commonConfig.tenantId },
          ])
        : [];
      //let resultArray = [...payload1.messages, ...payload2.messages];

      let resultArray = [...payload1.messages];
      if (payload2 && payload2.messages) {
        resultArray = [...resultArray, ...payload2.messages];
      }
      dispatch(setLocalizationLabels(locale, resultArray));
    } catch (error) {
      console.log(error);
    }
  };
};
const setActionItems = (payload) => {
  return {
    type: actionTypes.FETCH_ACTIONMENU,
    payload,
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
    try {
      const payload = await httpRequest(ACTIONMENU.GET.URL, ACTIONMENU.GET.ACTION, [], role, [], ts);

      dispatch(setActionItems(payload.actions));
    } catch (error) {
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
      console.log(error);
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
      console.log(error);
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
      console.log(error);
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
