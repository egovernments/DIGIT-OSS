import axios from "axios";
import commonConfig from "config/common.js";
import { toggleSpinner } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {
  addQueryArg
} from "egov-ui-framework/ui-utils/commons";
import {
  getAccessToken, getLocale, getTenantId, getUserInfo
} from "egov-ui-kit/utils/localStorageUtils";
import some from "lodash/some";
import store from "ui-redux/store";

const instance = axios.create({
  baseURL: window.location.origin,
  headers: {
    "Content-Type": "application/json",
  },
});

const edcrInstance = axios.create({
  baseURL: window.location.origin,
  headers: {
    "Content-Type": "application/json",
  },
});

export const wrapRequestBody = (requestBody, action, customRequestInfo) => {
  const authToken = getAccessToken();
  let RequestInfo = {
    apiId: "Rainmaker",
    ver: ".01",
    // ts: getDateInEpoch(),
    action: action,
    did: "1",
    key: "",
    msgId: `20170310130900|${getLocale()}`,
    requesterId: "",
    authToken,
  };

  RequestInfo = { ...RequestInfo, ...customRequestInfo };
  return Object.assign(
    {},
    {
      RequestInfo,
    },
    requestBody
  );
};

const wrapEdcrRequestBody = (requestBody, action, customRequestInfo) => {
  const authToken = getAccessToken();
  const userInfo = JSON.parse(getUserInfo());
  let uuid = userInfo.uuid;
  let userInfos = {
    id: uuid,
    tenantId: getTenantId(),
  };

  let Ids =
    process.env.REACT_APP_NAME === "Citizen" && action != "search"
      ? userInfos
      : null;
  let usrInfo = action == "search" ? null : Ids;
  let RequestInfo = {
    apiId: "1",
    ver: "1",
    ts: "01-01-2017 01:01:01",
    action: "create",
    did: "jh",
    key: "",
    msgId: "gfcfc",
    correlationId: "wefiuweiuff897",
    authToken,
    userInfo: usrInfo,
  };

  RequestInfo = { ...RequestInfo, ...customRequestInfo };
  return Object.assign(
    {},
    {
      RequestInfo,
    },
    requestBody
  );
};

export const httpRequest = async (
  method = "get",
  endPoint,
  action,
  queryObject = [],
  requestBody = {},
  headers = [],
  customRequestInfo = {}
) => {
  store.dispatch(toggleSpinner());
  let apiError = "Api Error";

  if (headers)
    instance.defaults = Object.assign(instance.defaults, {
      headers,
    });

  /* Fix for central instance to send tenantID in all query params  */
  const tenantId =
    process.env.REACT_APP_NAME === "Citizen"
      ? commonConfig.tenantId
      : (endPoint && endPoint.includes("mdms")
          ? commonConfig.tenantId
          : getTenantId()) || commonConfig.tenantId;
          
  let isTenantId = true;
  if (queryObject && queryObject.length > 0) {
    queryObject.forEach(valueData => {
      if (valueData && isTenantId && valueData.key == "tenantId") isTenantId = false
    })
  }

  if (!some(queryObject, ["key", "tenantId"]) && commonConfig.singleInstance && isTenantId && endPoint && !endPoint.includes("tenantId")) {
    queryObject &&
      queryObject.push({
        key: "tenantId",
        value: tenantId,
      });
  }
  endPoint = addQueryArg(endPoint, queryObject);
  var response;
  try {
    switch (method) {
      case "post":
        response = await instance.post(
          endPoint,
          wrapRequestBody(requestBody, action, customRequestInfo)
        );
        break;
      default:
        response = await instance.get(endPoint);
    }
    const responseStatus = parseInt(response.status, 10);
    store.dispatch(toggleSpinner());
    if (responseStatus === 200 || responseStatus === 201) {
      return response.data;
    }
  } catch (error) {
    const { data, status } = error.response;
    if (status === 400 && data === "") {
      apiError = "INVALID_TOKEN";
    } else {
      apiError =
        (data.hasOwnProperty("Errors") &&
          data.Errors &&
          data.Errors.length &&
          data.Errors[0].message) ||
        (data.hasOwnProperty("error") &&
          data.error.fields &&
          data.error.fields.length &&
          data.error.fields[0].message) ||
        (data.hasOwnProperty("error_description") && data.error_description) ||
        apiError;
    }
    store.dispatch(toggleSpinner());
  }
  // unhandled error
  throw new Error(apiError);
};

export const edcrHttpRequest = async (
  method = "post",
  endPoint,
  action,
  queryObject = [],
  requestBody = {},
  headers = [],
  customRequestInfo = {}
) => {
  store.dispatch(toggleSpinner());
  let apiError = "No Record Found";
  // const authToken = getAccessToken();
  // headers = { "Content-Type": "application/json", "auth-token": authToken }
  if (headers)
    edcrInstance.defaults = Object.assign(edcrInstance.defaults, {
      headers,
    });

  endPoint = addQueryArg(endPoint, queryObject);
  var response;
  try {
    response = await edcrInstance.post(
      endPoint,
      wrapEdcrRequestBody(requestBody, action, customRequestInfo)
    );
    const responseStatus = parseInt(response.status, 10);
    store.dispatch(toggleSpinner());
    if (responseStatus === 200 || responseStatus === 201) {
      return response.data;
    }
  } catch (error) {
    const { data, status } = error.response;
    if (status === 400 && data === "") {
      apiError = "INVALID_TOKEN";
    } else {
      apiError =
        (data.hasOwnProperty("Errors") &&
          data.Errors &&
          data.Errors.length &&
          data.Errors[0].message) ||
        (data.hasOwnProperty("error") &&
          data.error.fields &&
          data.error.fields.length &&
          data.error.fields[0].message) ||
        (data.hasOwnProperty("error_description") && data.error_description) ||
        apiError;
    }
    store.dispatch(toggleSpinner());
  }
  // unhandled error
  throw new Error(apiError);
};

export const loginRequest = async (username = null, password = null) => {
  let apiError = "Api Error";
  try {
    // api call for login
    alert("Logged in");
    return;
  } catch (e) {
    apiError = e.message;
    // alert(e.message);
  }

  throw new Error(apiError);
};

export const logoutRequest = async () => {
  let apiError = "Api Error";
  try {
    alert("Logged out");
    return;
  } catch (e) {
    apiError = e.message;
    // alert(e.message);
  }

  throw new Error(apiError);
};
