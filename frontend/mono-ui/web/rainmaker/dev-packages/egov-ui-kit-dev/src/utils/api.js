import axios from "axios";
import commonConfig from "config/common.js";
import { hideSpinner, showSpinner } from "egov-ui-kit/redux/common/actions";
import {
  getAccessToken,
  getLocale,
  getTenantId,
  localStorageGet,
  localStorageSet,
  setLocale,
  setTenantId,
} from "egov-ui-kit/utils/localStorageUtils";
import some from "lodash/some";
import store from "ui-redux/store";
import { getLocaleLabels } from "egov-ui-framework/ui-utils/commons";
import { addQueryArg, hasTokenExpired, prepareForm } from "./commons";
import { setUserObj } from "./localStorageUtils";

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.data && error.response.data.location) {
      window.location = error.response.data.location;
    } else {
      return Promise.reject(error);
    }
  }
);

const instance = axios.create({
  baseURL: window.location.origin,
  headers: {
    "Content-Type": "application/json",
  },
});

const wrapRequestBody = (requestBody, action, customRequestInfo) => {
  const authToken = getAccessToken();

  let RequestInfo = {
    apiId: "Rainmaker",
    ver: ".01",
    ts: "",
    action: action,
    did: "1",
    key: "",
    msgId: `20170310130900|${getLocale()}`,
    // requesterId: "",
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

export const multiHttpRequest = async (endPoint = [], action, queryObject = [], requestBody = [], headers = [], customRequestInfo = {}) => {
  let apiError = "Api Error";

  if (headers)
    instance.defaults = Object.assign(instance.defaults, {
      headers,
    });

  try {
    const response = await axios.all(
      requestBody.map((requestB, index) => {
        if (queryObject && queryObject[index] && queryObject[index].length) {
          endPoint[index] = addQueryArg(endPoint[index], queryObject[index]);
        }
        return instance.post(endPoint[index], wrapRequestBody(requestB, action, customRequestInfo));
      })
    );
    const responseStatus = parseInt(response && Array.isArray(response) && response.length > 0 && response[0] && response[0].status, 10);
    if (responseStatus === 200 || responseStatus === 201) {
      return response && response.map((resp) => resp.data);
    }
  } catch (error) {
    const { data, status } = error.response[0];
    if (hasTokenExpired(status, data)) {
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

export const httpRequest = async (
  endPoint,
  action,
  queryObject = [],
  requestBody = {},
  headers = [],
  customRequestInfo = {},
  ignoreTenantId = false,
  isGetMethod = false
) => {
  /* const tenantId = getTenantId() || commonConfig.tenantId; */
  /* Fix for central instance to send tenantID in all query params  */
  const tenantId =
    process.env.REACT_APP_NAME === "Citizen"
      ? commonConfig.tenantId
      : (endPoint && endPoint.includes("mdms") ? commonConfig.tenantId : getTenantId()) || commonConfig.tenantId;
  let apiError = "Api Error";

  if (headers)
    instance.defaults = Object.assign(instance.defaults, {
      headers,
    });

  /* if (!some(queryObject, ["key", "tenantId"]) && !ignoreTenantId) { */
  /* Fix for central instance to send tenantID in all query params  */
  if (!some(queryObject, ["key", "tenantId"])) {
    commonConfig.singleInstance &&
      endPoint &&
      !endPoint.includes("tenantId") &&
      queryObject &&
      queryObject.push({
        key: "tenantId",
        value: tenantId,
      });
  }
  if (queryObject && queryObject.length) {
    endPoint = addQueryArg(endPoint, queryObject);
  }

  try {
    if (isGetMethod) {
      const getResponse = await instance.get(endPoint, wrapRequestBody(requestBody, action, customRequestInfo));
      const getResponseStatus = parseInt(getResponse.status, 10);
      if (getResponseStatus === 200 || getResponseStatus === 201) {
        return getResponse.data;
      }
    } else {
      const response = await instance.post(endPoint, wrapRequestBody(requestBody, action, customRequestInfo));
      const responseStatus = parseInt(response.status, 10);
      if (responseStatus === 200 || responseStatus === 201) {
        return response.data;
      }
    }
  } catch (error) {
    const { data, status } = error.response;
    if (hasTokenExpired(status, data)) {
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

export const uploadFile = async (endPoint, module, file, ulbLevel) => {
  // Bad idea to fetch from local storage, change as feasible
  const tenantId = getTenantId() ? (ulbLevel ? commonConfig.tenantId : commonConfig.tenantId) : "";
  const uploadInstance = axios.create({
    baseURL: window.location.origin,
    headers: {
      "Content-Type": "multipart/form-data",
      "auth-token": getAccessToken(),
    },
  });

  const requestParams = {
    tenantId,
    module,
    file,
  };
  const requestBody = prepareForm(requestParams);

  try {
    const tenantInfo = commonConfig.singleInstance ? `?tenantId=${commonConfig.tenantId}` : "";
    const response = await uploadInstance.post(`${endPoint}${tenantInfo}`, requestBody);
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

export const loginRequest = async (username = null, password = null, refreshToken = "", grantType = "password", tenantId = "", userType) => {
  tenantId = tenantId ? tenantId : commonConfig.tenantId;
  const loginInstance = axios.create({
    baseURL: window.location.origin,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: "Basic ZWdvdi11c2VyLWNsaWVudDo=",
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
  userType && params.append("userType", userType);

  try {
    const response = await loginInstance.post("/user/oauth/token", params);
    const responseStatus = parseInt(response.status, 10);
    if (responseStatus === 200 || responseStatus === 201) {
      setUserObj(JSON.stringify(response.data.UserRequest));
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
export const commonApiPost = (
  context,
  queryObject = {},
  body = {},
  doNotOverride = false,
  isTimeLong = true,
  noPageSize = false,
  authToken = "",
  userInfo = "",
  isStateLevel = false,
  offset = 0
) => {
  // const RequestInfo = {
  //   apiId: "Rainmaker",
  //   ver: ".01",
  //   ts: "",
  //   did: "1",
  //   key: "",
  //   msgId: "20170310130900|en_IN",
  //   requesterId: "",
  //   authToken,
  // };
  const RequestInfo = {
    apiId: "emp",
    ver: "1.0",
    ts: "",
    action: "create",
    did: "1",
    key: "abcdkey",
    msgId: "20170310130900",
    requesterId: "",
    authToken,
  };
  var url = context;
  if (url && url[url.length - 1] === "/") url = url.substring(0, url.length - 1);
  if (!doNotOverride) {
    if (url.split("?").length > 1) {
      url += "&tenantId=" + (getTenantId() ? (isStateLevel ? commonConfig.tenantId : commonConfig.tenantId) : "default");
    } else {
      url += "?tenantId=" + (getTenantId() ? (isStateLevel ? commonConfig.tenantId : commonConfig.tenantId) : "default");
    }
  } else {
    url += "?";
  }
  for (var variable in queryObject) {
    if (typeof queryObject[variable] !== "undefined") {
      url += "&" + variable + "=" + queryObject[variable];
    }
  }

  if (/_search/.test(context) && !noPageSize) {
    url += "&pageSize=200";
  } else {
    url += "&pageSize=" + noPageSize;
  }

  url += "&offset=" + offset;

  RequestInfo.authToken = getAccessToken();
  if (isTimeLong) {
    RequestInfo.ts = new Date().getTime();
  }

  if (authToken) {
    RequestInfo["authToken"] = authToken;
  }

  body["RequestInfo"] = RequestInfo;

  if (userInfo) {
    body["RequestInfo"]["userInfo"] = userInfo;
  }

  return instance
    .post(url, body)
    .then(function (response) {
      return response.data;
    })
    .catch(function (response) {
      try {
        if (response && response.response && response.response.data && response.response.data[0] && response.response.data[0].error) {
          var _err = response.response.data[0].error.message || "";
          if (response.response.data[0].error.errorFields && Object.keys(response.response.data[0].error.errorFields).length) {
            for (var i = 0; i < response.response.data[0].error.errorFields.length; i++) {
              _err += "\n " + response.response.data[0].error.errorFields[i].message + " ";
            }
            throw new Error(_err);
          }
        } else if (response && response.response && response.response.data && response.response.data.error) {
          // let _err = common.translate(response.response.data.error.fields[0].code);
          let _err = "";

          _err = response.response.data.error.message
            ? response.response.data.error.fields
              ? "a) " + extractErrorMsg(response.response.data.error, "message", "description") + " : "
              : extractErrorMsg(response.response.data.error, "message", "description")
            : "";
          let fields = response.response.data.error.fields || [];
          for (var i = 0; i < fields.length; i++) {
            _err += i + 1 + ") " + extractErrorMsg(fields[i], "code", "message") + ".";
          }
          throw new Error(_err);
        } else if (response && response.response && response.response.data && response.response.data.Errors) {
          // let _err = common.translate(response.response.data.error.fields[0].code);
          let _err = "";
          // _err=response.response.data.error.message?"a) "+extractErrorMsg(response.response.data.error, "message", "description")+" : ":"";
          // let fields=response.response.data.error.fields;
          if (response.response.data.Errors.length == 1) {
            if(response.response.data.Errors[0].message.includes("InvalidAccessTokenException")){
              throw new Error(getLocaleLabels("InvalidAccessTokenException"));
            }
            _err += getLocaleLabels(response.response.data.Errors[0].message) + ".";
          } else {
            for (var i = 0; i < response.response.data.Errors.length; i++) {
              _err += i + 1 + ") " + getLocaleLabels(response.response.data.Errors[i].message) + ".";
            }
          }

          throw new Error(_err);
        } else if (response && response.response && response.response.data && response.response.data.hasOwnProperty("Data")) {
          let _err = getLocaleLabels(response.response.data.Message) + ".";
          throw new Error(_err);
        } else if (response && response.response && !response.response.data && response.response.status === 400) {
          if (counter == 0) {
            document.title = "eGovernments";
            var locale = getLocale();
            var _tntId = getTenantId() || "default";
            var lang_response = localStorageGet("lang_response");
            localStorage.clear();
            sessionStorage.clear();
            setLocale(locale);
            setTenantId(_tntId);
            localStorageSet("lang_response", lang_response);
            alert("Session expired. Please login again.");
            //localStorage.reload = true;
            throw new Error("");
          }
        } else if (response) {
          throw new Error("Oops! Something isn't right. Please try again later.");
        } else {
          throw new Error("Server returned unexpected error. Please contact system administrator.");
        }
      } catch (e) {
        if (e.message) {
          throw new Error(e.message);
        } else throw new Error("Oops! Something isn't right. Please try again later.");
      }
    });
};

const downloadPdf = (blob, fileName) => {
  if (window.mSewaApp && window.mSewaApp.isMsewaApp() && window.mSewaApp.downloadBase64File) {
    var reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = function () {
      var base64data = reader.result;
      mSewaApp.downloadBase64File(base64data, fileName);
    };
  } else {
    const link = document.createElement("a");
    // create a blobURI pointing to our Blob
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    // some browser needs the anchor to be in the doc
    document.body.append(link);
    link.click();
    link.remove();
    // in case the Blob uses a lot of memory
    setTimeout(() => URL.revokeObjectURL(link.href), 7000);
  }
};

const printPdf = (blob) => {
  if (window.mSewaApp && window.mSewaApp.isMsewaApp() && window.mSewaApp.downloadBase64File) {
    var reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = function () {
      var base64data = reader.result;
      mSewaApp.downloadBase64File(base64data, 'download.pdf');
    };
  } else {
    const fileURL = URL.createObjectURL(blob);
    var myWindow = window.open(fileURL);
    if (myWindow != undefined) {
      myWindow.addEventListener("load", (event) => {
        myWindow.focus();
        myWindow.print();
      });
    }
  }
};

export const downloadPdfFile = async (
  endPoint,
  action,
  queryObject = [],
  requestBody = {},
  customRequestInfo = {},
  ignoreTenantId = false,
  fileName = "download.pdf",
  onSuccess
) => {
  const tenantId = getTenantId() || commonConfig.tenantId;
  const downloadInstance = axios.create({
    baseURL: window.location.origin,
    responseType: "arraybuffer",
    headers: {
      "Content-Type": "application/json",
      Accept: commonConfig.singleInstance ?"application/pdf,application/json":"application/pdf",
    },
  });

  if (!some(queryObject, ["key", "tenantId"]) && !ignoreTenantId) {
    queryObject &&
      queryObject.push({
        key: "tenantId",
        value: tenantId,
      });
  }
  if (queryObject && queryObject.length) {
    endPoint = addQueryArg(endPoint, queryObject);
  }
  try {
    store.dispatch(showSpinner());
    const response = await downloadInstance.post(endPoint, wrapRequestBody(requestBody, action, customRequestInfo));
    const responseStatus = parseInt(response.status, 10);

    if (responseStatus === 201 || responseStatus === 200) {
      fileName == "print"
        ? printPdf(new Blob([response.data], { type: "application/pdf" }))
        : downloadPdf(new Blob([response.data], { type: "application/pdf" }), fileName);
      onSuccess ? onSuccess() : {};
      store.dispatch(hideSpinner());
    }
  } catch (error) {
    store.dispatch(hideSpinner());
    throw new Error(error);
  }
};
