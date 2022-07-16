import { getUserSearchedResponse } from "egov-ui-kit/utils/commons";

const appName = process.env.REACT_APP_NAME;

//GET methods
export const getAccessToken = () => {
  return localStorageGet(`token`);
};
export const getUserInfo = () => {
  return localStorageGet("user-info");
};
export const getTenantId = () => {
  return localStorageGet("tenant-id");
};
export const getLocalization = (key) => {
  return localStorage.getItem(key);
};
export const getLocale = () => {
  return localStorage.getItem("locale");
};
export const getModule = () => {
  return localStorage.getItem("module");
};
export const getLocalizationLabels = () => {
  return localStorage.getItem(`localization_${getLocale()}`);
};
export const getStoredModulesList = () => {
  return localStorage.getItem("storedModulesList");
};

//SET methods
export const setUserInfo = (userInfo) => {
  if (process.env.REACT_APP_NAME == "Citizen") {
    localStorageSet("user-info", userInfo, null);
  } else {
    let userObject = JSON.parse(userInfo) || {};
    userObject.roles = userObject.roles && userObject.roles.filter((role) => role.tenantId == userObject.tenantId);
    localStorageSet("user-info", JSON.stringify(userObject), null);
  }
};
export const setAccessToken = (token) => {
  localStorageSet("token", token, null);
};
export const setRefreshToken = (refreshToken) => {
  localStorageSet("refresh-token", refreshToken, null);
};
export const setUserObj = (user = {}) => {
  localStorage.setItem("citizen.userRequestObject", user );
  sessionStorage.setItem("Digit.citizen.userRequestObject", JSON.stringify({ value: { info: JSON.parse(user ) } }));
};
export const setTenantId = (tenantId) => {
  localStorageSet("tenant-id", tenantId, null);
  if (process.env.REACT_APP_NAME != "Citizen") {
    window.sessionStorage.clear();
    Object.keys(window.localStorage)
      .filter((key) => key.startsWith("Digit"))
      .map((key) => localStorage.removeItem(key));
    const userObj = getUserSearchedResponse();
    let user = (userObj && userObj.user && userObj.user[0]) || {};
    user = { ...user, tenantId: tenantId };
    setUserObj(JSON.stringify(user));
    setUserInfo(JSON.stringify({ ...user }));
  }
};
export const setLocale = (locale) => {
  localStorageSet("locale", locale);
  localStorage.setItem("locale", locale);
  sessionStorage.setItem("Digit.locale", JSON.stringify({ value: locale }));
};
export const setModule = (moduleName) => {
  localStorageSet("module", moduleName);
};
export const setReturnUrl = (url) => {
  localStorageSet("returnUrl", url);
};
export const setStoredModulesList = (storedModuleList) => {
  localStorage.setItem("storedModulesList", storedModuleList);
};

//Remove Items (LOGOUT)
export const clearUserDetails = () => {
  window.localStorage.clear();
  window.sessionStorage.clear();
};
//Role specific get-set Methods
export const localStorageGet = (key, path) => {
  const appName = process.env.REACT_APP_NAME;
  let value = null;
  if (path) {
    const data = JSON.parse(window.localStorage.getItem(appName + "." + key)) || null;
    value = get(data, path);
  } else {
    value = window.localStorage.getItem(appName + "." + key) || null;
  }
  return value;
};
export const localStorageSet = (key, data, path) => {
  const appName = process.env.REACT_APP_NAME;
  const storedData = window.localStorage.getItem(appName + "." + key);

  if (path) {
    set(storedData, path, data);
    window.localStorage.setItem(appName + "." + key, storedData);
    window.localStorage.setItem(key, storedData);
  } else {
    window.localStorage.setItem(appName + "." + key, data);
    window.localStorage.setItem(key, data);
  }
};
//Remove Item
export const lSRemoveItem = (key) => {
  const appName = process.env.REACT_APP_NAME;
  window.localStorage.removeItem(appName + "." + key);
};

// get tenantId for Employee/Citizen
export const getTenantIdCommon = () => {
  return process.env.REACT_APP_NAME === "Citizen" ? JSON.parse(getUserInfo()).permanentCity : getTenantId();
};
