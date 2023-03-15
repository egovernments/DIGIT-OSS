import { FILE_DOWNLOAD_ENDPOINT } from "../constants/ApiEndpoints";

export const slugify = term => {
  return term.toLowerCase().replace(/\s+/, "-");
};

export const persistInLocalStorage = obj => {
  Object.keys(obj).forEach(objKey => {
    const objValue = obj[objKey];
    window.localStorage.setItem(objKey, objValue);
  }, this);
};

export const fetchFromLocalStorage = key => {
  return window.localStorage.getItem(key) || null;
};

export const getRequestUrl = (url, params) => {
  var query = Object.keys(params)
    .map(k => encodeURIComponent(k) + "=" + encodeURIComponent(params[k]))
    .join("&");

  return url + "?" + query;
};

export const prepareFormData = params => {
  var formData = new FormData();

  for (var k in params) {
    formData.append(k, params[k]);
  }
  return formData;
};

export const getDateFromEpoch = epoch => {
  const dateObj = new Date(epoch);
  const year = dateObj.getFullYear();
  const month = dateObj.getMonth() + 1;
  const day = dateObj.getDate();
  return day + "-" + month + "-" + year;
};

export const getFileDownloadLink = (tenantId, fileStoreId) => {
  const requestParams = { tenantId, fileStoreId };
  let downloadLink = getRequestUrl(FILE_DOWNLOAD_ENDPOINT, requestParams);
  // for developement prepend the dev environment
  if (process.env.NODE_ENV === "development") {
    downloadLink = "http://egov-micro-dev.egovernments.org" + downloadLink;
  }
  return downloadLink;
};

export const convertDateToEpoch = (dateString, dayStartOrEnd) => {
  //example input format : "2018-10-02"
  try {
    const parts = dateString.match(/(\d{4})-(\d{1,2})-(\d{1,2})/);
    const DateObj = new Date(Date.UTC(parts[1], parts[2] - 1, parts[3]));
    DateObj.setMinutes(DateObj.getMinutes() + DateObj.getTimezoneOffset());
    if (dayStartOrEnd === "dayend") {
      DateObj.setHours(DateObj.getHours() + 24);
      DateObj.setSeconds(DateObj.getSeconds() - 1);
    }
    return DateObj.getTime();
  } catch (e) {
    return dateString;
  }
};
