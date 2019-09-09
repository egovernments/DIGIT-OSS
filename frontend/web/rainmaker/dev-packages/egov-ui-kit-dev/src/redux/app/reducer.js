import * as actionTypes from "./actionTypes";
import { initLocalizationLabels } from "./utils";
import { stat } from "fs";
import { getLocale, localStorageSet } from "egov-ui-kit/utils/localStorageUtils";

const locale = getLocale() || "en_IN";
const localizationLabels = initLocalizationLabels(locale);

const initialState = {
  name: "Mseva",
  showMenu: false,
  showActionMenu: true,
  showDailog: false,
  route: "",
  locale,
  urls: [],
  menu: "",
  bottomNavigationIndex: 0,
  previousRoute: "",
  toast: {
    message: { labelName: "", labelKey: "" },
    open: false,
    error: true,
  },
  localizationLabels,
  activeRoutePath: "",
  notificationObj: {
    notificationCount: 0,
    loading: false,
    notifications: [],
  },
};

const appReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.ADD_LOCALIZATION:
      return {
        ...state,
        locale: action.locale,
        localizationLabels: action.localizationLabels,
      };
    case actionTypes.CHANGE_BOTTOM_NAVIGATION_INDEX:
      return {
        ...state,
        bottomNavigationIndex: action.bottomNavigationIndex,
      };
    case actionTypes.SET_ROUTE:
      return { ...state, previousRoute: action.route ? window.location.pathname : state.previousRoute, route: action.route };
    case actionTypes.SHOW_TOAST:
      return {
        ...state,
        toast: {
          message: action.message,
          open: action.open,
          error: action.error,
        },
      };
    case actionTypes.SET_USER_CURRENT_LOCATION:
      return { ...state, currentLocation: action.currentLocation };
    case actionTypes.FETCH_ACTIONMENU:
      return { ...state, menu: action.payload };

    case actionTypes.ADD_BREADCRUMB_ITEM:
      if (process.env.NODE_ENV !== "development" && action.url && action.url.title !== "" && action.url.path !== "") {
        action.url.path = action.url.path && action.url.path.split("/citizen").pop();
      }

      localStorageSet("path", action.url.path);
      const index = state.urls.findIndex((url) => {
        return url.title === action.url.title;
      });
      const url =
        window.location.pathname && window.location.pathname.split("/").pop() === "property-tax"
          ? []
          : index > -1
          ? state.urls.splice(index, 1)
          : [...state.urls, action.url];
      localStorageSet("breadCrumbObject", JSON.stringify(url));
      return { ...state, urls: url };
    case actionTypes.FETCH_UI_COMMON_CONFIG: {
      return { ...state, uiCommonConfig: action.payload };
    }
    case actionTypes.FETCH_UI_COMMON_CONSTANTS: {
      return { ...state, uiCommonConstants: action.payload };
    }
    case actionTypes.UPDATE_ACTIVE_ROUTE_PATH: {
      return { ...state, activeRoutePath: action.routePath };
    }
    case actionTypes.SET_PREVIOUS_ROUTE: {
      return { ...state, previousRoute: action.route };
    }
    case actionTypes.GET_NOTIFICATION_COUNT: {
      return { ...state, notificationsCount: action.count };
    }
    case actionTypes.GET_NOTIFICATIONS_COMPLETE: {
      return {
        ...state,
        notificationObj: {
          loading: false,
          notifications: action.payload,
        },
      };
    }
    case actionTypes.GET_NOTIFICATIONS_PENDING:
      return {
        ...state,
        notificationObj: {
          loading: true,
        },
      };
    case actionTypes.GET_NOTIFICATIONS_ERROR:
      return {
        ...state,
        notificationObj: {
          loading: false,
        },
      };
    default:
      return state;
  }
};
export default appReducer;
