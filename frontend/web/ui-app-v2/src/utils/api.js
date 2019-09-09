import axios from "axios";
import { prepareForm, fetchFromLocalStorage, addQueryArg } from "./commons";
import some from "lodash/some";
import commonConfig from "config/common.js";

const instance = axios.create({
  baseURL: window.location.origin,
  headers: {
    "Content-Type": "application/json",
  },
});

const wrapRequestBody = (requestBody, action) => {
  const authToken = fetchFromLocalStorage("token");

  const RequestInfo = {
    apiId: "Rainmaker",
    ver: ".01",
    ts: "",
    action: action,
    did: "1",
    key: "",
    msgId: "20170310130900|en_IN",
    requesterId: "",
    authToken,
  };

  return Object.assign(
    {},
    {
      RequestInfo,
    },
    requestBody
  );
};

export const httpRequest = async (endPoint, action, queryObject = [], requestBody = {}, headers = []) => {
  const tenantId = fetchFromLocalStorage("tenant-id") || commonConfig.tenantId;
  let apiError = "Api Error";

  if (headers)
    instance.defaults = Object.assign(instance.defaults, {
      headers,
    });

  if (!some(queryObject, ["key", "tenantId"])) {
    queryObject.push({
      key: "tenantId",
      value: tenantId,
    });
  }

  endPoint = addQueryArg(endPoint, queryObject);
  try {
    const response = await instance.post(endPoint, wrapRequestBody(requestBody, action));
    const responseStatus = parseInt(response.status, 10);
    if (responseStatus === 200 || responseStatus === 201) {
      return response.data;
    }
  } catch (error) {
    const { data, status } = error.response;
    if (status == 400 && data == "") {
      apiError = "INVALID_TOKEN";
    } else {
      apiError =
        (data.hasOwnProperty("Errors") && data.Errors && data.Errors.length && data.Errors[0].message) ||
        (data.hasOwnProperty("error") && data.error.fields && data.error.fields.length && data.error.fields[0].message) ||
        (data.hasOwnProperty("error_description") && data.error_description) ||
        apiError;
    }
  }
  // unhandled error
  throw new Error(apiError);
};

export const uploadFile = async (endPoint, module, file) => {
  const tenantId = fetchFromLocalStorage("tenant-id");
  const uploadInstance = axios.create({
    baseURL: window.location.origin,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  const requestParams = {
    tenantId,
    module,
    file,
  };
  const requestBody = prepareForm(requestParams);

  try {
    const response = await uploadInstance.post(endPoint, requestBody);
    const responseStatus = parseInt(response.status, 10);
    let fileStoreIds = [];

    if (responseStatus === 201) {
      const responseData = response.data;
      const files = responseData.files || [];
      fileStoreIds = files.map((f) => f.fileStoreId);
      return fileStoreIds[0];
    }
  } catch (error) {
    throw new Error(error);
  }
};

export const loginRequest = async (username = null, password = null, refreshToken, grantType = "password") => {
  const tenantId = fetchFromLocalStorage("tenant-id") || commonConfig.tenantId;
  const loginInstance = axios.create({
    baseURL: window.location.origin,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: "Basic ZWdvdi11c2VyLWNsaWVudDplZ292LXVzZXItc2VjcmV0",
    },
  });

  let apiError = "Api Error";
  var params = new URLSearchParams();
  username && params.append("username", username);
  password && params.append("password", password);
  refreshToken && params.append("refresh_token", refreshToken);
  params.append("grant_type", grantType);
  params.append("scope", "read");
  params.append("tenantId", tenantId);

  try {
    const response = await loginInstance.post("/user/oauth/token", params);
    const responseStatus = parseInt(response.status, 10);
    if (responseStatus === 200 || responseStatus === 201) {
      return response.data;
    }
  } catch (error) {
    const { data, status } = error.response;
    if (status === 400) {
      apiError = (data.hasOwnProperty("error_description") && data.error_description) || apiError;
    }
  }

  throw new Error(apiError);
};
