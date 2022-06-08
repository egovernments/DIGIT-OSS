import * as actionTypes from "./actionTypes";
import { initLocalizationLabels } from "./utils";

const locale = window.localStorage.getItem("locale") || "en_IN";
const localizationLabels = initLocalizationLabels(locale);

const initialState = {
  name: "Mseva",
  showMenu: false,
  showActionMenu:true,
  showDailog: false,
  route: "",
  locale,
  bottomNavigationIndex: 0,
  previousRoute: "",
  toast: {
    message: "",
    open: false,
    error: true,
  },
  localizationLabels,
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
    default:
      return state;
  }
};
export default appReducer;
