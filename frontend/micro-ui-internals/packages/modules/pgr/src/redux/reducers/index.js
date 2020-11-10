import { combineReducers } from "redux";
import { Enums } from "@egovernments/digit-ui-libraries";
//import ConfigActionTypes from "../../@egovernments/digit-utils/enums/ConfigActionTypes";
import { FETCH_LOCALITIES, CHANGE_LANGUAGE, FETCH_ALL_BUSINESSS_SERVICES, FETCH_BUSINESS_SERVICE_BY_ID } from "../actions/types";

import complaintReducer from "./complaintReducer";

// const { ConfigActionTypes } = Digit.Enums.ConfigActionTypes;
const { ConfigActionTypes } = Enums;

const configReducer = (defaultConfig) => (state = defaultConfig, action) => {
  switch (action.type) {
    case ConfigActionTypes.CONFIG_UPDATE:
      return [...state, action.payload];
    default:
      return state;
  }
};

const languageReducer = (defaultLanguages) => (state = defaultLanguages, action) => {
  switch (action.type) {
    case "FETCH_LANGUAGES":
      return { ...state, languages: [...action.payload] };
    default:
      return state;
  }
};

const formDataReducer = (state = {}, action) => {
  switch (action.type) {
    case "UPDATE_REPEAT":
      const stateKey = `${action.payload.field}-repeats`;
      const prevValue = state[stateKey] || 1;
      return { ...state, [stateKey]: prevValue + 1 };
    case "UPDATE_FEILD":
      return { ...state, [action.payload.field]: action.payload.value };
    default:
      return state;
  }
};

const cityReducer = (defaultCities) => (state = defaultCities, action) => {
  switch (action.type) {
    default:
      return state;
  }
};

const localityReducer = (state = [], action) => {
  switch (action.type) {
    case FETCH_LOCALITIES:
      return {
        ...state,
        localityList: action.payload.localityList,
        city: action.payload.City,
      };
    default:
      return state;
  }
};

const localeReducer = (defaultLocales) => (state = defaultLocales, action) => {
  switch (action.type) {
    default:
      return state;
  }
};

const currentLanguageReducer = (state = {}, action) => {
  switch (action.type) {
    case CHANGE_LANGUAGE:
      return { ...state, language: action.payload };
    default:
      return state;
  }
};

const cityCodeReducer = (defaultCityCode) => (state = defaultCityCode, action) => {
  return state;
};

const stateInfoReducer = (defaultStateInfo) => (state = defaultStateInfo, action) => {
  return state;
};

const businessServiceReducer = (state = {}, action) => {
  switch (action.type) {
    case FETCH_ALL_BUSINESSS_SERVICES:
      return { ...state, businessServices: action.payload };
    case FETCH_BUSINESS_SERVICE_BY_ID:
      return {
        ...state,
        businessService: action.payload.businessServiceDetails,
      };
    default:
      return state;
  }
};

const getRootReducer = (defaultStore) =>
  combineReducers({
    config: configReducer(defaultStore.config),
    formData: formDataReducer,
    locales: localeReducer(defaultStore.locales),
    cities: cityReducer(defaultStore.cities),
    localities: localityReducer,
    currentLanguage: currentLanguageReducer,
    languages: languageReducer(defaultStore.languages),
    cityCode: cityCodeReducer(defaultStore.cityCode),
    stateInfo: stateInfoReducer(defaultStore.stateInfo),
    // businessService: businessServiceReducer(defaultStore.businessServices),
    businessService: businessServiceReducer,
    complaints: complaintReducer,
    // complaints: complaintReducer,
  });

export default getRootReducer;
