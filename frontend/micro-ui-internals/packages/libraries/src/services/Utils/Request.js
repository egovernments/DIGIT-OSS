import Axios from "axios";

const requestInfo = () => ({
  authToken: Digit.UserService.getUser().token,
});

const userServiceData = () => ({ userInfo: Digit.UserService.getUser().info });

window.Digit = window.Digit || {};
window.Digit = { ...window.Digit, RequestCache: window.Digit.RequestCache || {} };
export const Request = async ({ method = "POST", url, data = {}, headers = {}, useCache = false, params = {}, auth, userService }) => {
  console.log("params:", params);
  console.log("url:", url);
  if (method.toUpperCase() === "POST") {
    data.RequestInfo = {
      apiId: "Rainmaker",
    };
    if (auth) {
      data.RequestInfo = { ...data.RequestInfo, ...requestInfo() };
    }
    if (userService) {
      data.RequestInfo = { ...data.RequestInfo, ...userServiceData() };
    }
  }

  let key = "";
  if (useCache) {
    key = `${method.toUpperCase()}.${url}.${btoa(JSON.stringify(params, null, 0))}.${btoa(JSON.stringify(data, null, 0))}`;
    const value = window.Digit.RequestCache[key];
    if (value) {
      return value;
    }
  } else {
    params._ = Date.now();
  }
  const res = await Axios({ method, url, data, params, headers });
  if (useCache) {
    window.Digit.RequestCache[key] = res.data;
  }
  return res.data;
};

/**
 *
 * @param {*} serviceName
 *
 * preHook:
 * ({params, data}) => ({params, data})
 *
 * postHook:
 * ({resData}) => ({resData})
 *
 */

export const ServiceRequest = async ({
  serviceName,
  method = "POST",
  url,
  data = {},
  headers = {},
  useCache = false,
  params = {},
  auth,
  userService,
}) => {
  const preHookName = `${serviceName}Pre`;
  const postHookName = `${serviceName}Post`;

  let reqParams = params;
  let reqData = data;
  if (window[preHookName] && typeof window[preHookName] === "function") {
    let preHookRes = await window[preHookName]({ params, data });
    reqParams = preHookRes.params;
    reqData = preHookRes.data;
  }
  const resData = await Request({ method, url, data: reqData, headers, useCache, params: reqParams, auth, userService });
  if (window[postHookName] && typeof window[postHookName] === "function") {
    return await window[postHookName](resData);
  }
  return resData;
};
