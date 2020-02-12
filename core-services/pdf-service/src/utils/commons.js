import { httpRequest } from "../api/api";
import logger from "../config/logger";
import envVariables from "../EnvironmentVariables";
import get from "lodash/get";

let egovLocHost = envVariables.EGOV_LOCALISATION_HOST;
let defaultLocale = envVariables.DEFAULT_LOCALISATION_LOCALE;
let defaultTenant = envVariables.DEFAULT_LOCALISATION_TENANT;
export const getTransformedLocale = label => {
  return label.toUpperCase().replace(/[.:-\s\/]/g, "_");
};

/**
 * This function returns localisation label from keys based on needs
 * This function does optimisation to fetch one module localisation values only once
 * @param {*} requestInfo - requestinfo from client
 * @param {*} localisationMap - localisation map containing localisation key,label fetched till now
 * @param {*} prefix - prefix to be added before key before fetching localisation ex:-"MODULE_NAME_MASTER_NAME"
 * @param {*} key - key to fetch localisation
 * @param {*} moduleName - "module name for fetching localisation"
 * @param {*} localisationModuleList - "list of modules for which localisation was already fetched"
 * @param {*} isCategoryRequired - ex:- "GOODS_RETAIL_TST-1" = get localisation for "GOODS"
 * @param {*} isMainTypeRequired  - ex:- "GOODS_RETAIL_TST-1" = get localisation for "RETAIL"
 * @param {*} isSubTypeRequired  - - ex:- "GOODS_RETAIL_TST-1" = get localisation for "GOODS_RETAIL_TST-1"
 */
export const findAndUpdateLocalisation = async (
  requestInfo,
  localisationMap,
  prefix,
  key,
  moduleName,
  localisationModuleList,
  isCategoryRequired,
  isMainTypeRequired,
  isSubTypeRequired,
  delimiter = " / "
) => {
  let keyArray = [];
  let localisedLabels = [];
  let isArray = false;
  let locale = requestInfo.msgId;
  if (null != locale) {
    locale = locale.split("|");
    locale = locale.length > 1 ? locale[1] : defaultLocale;
  } else {
    locale = defaultLocale;
  }
  let statetenantid = get(
    requestInfo,
    "userInfo.tenantId",
    defaultTenant
  ).split(".")[0];

  if (key == null) {
    return key;
  } else if (typeof key == "string" || typeof key == "number") {
    keyArray.push(key);
  } else {
    keyArray = key;
    isArray = true;
  }

  if (!localisationModuleList.includes(moduleName)) {
    var res = await httpRequest(
      `${egovLocHost}/localization/messages/v1/_search?locale=${locale}&tenantId=${statetenantid}&module=${moduleName}`,
      { RequestInfo: requestInfo }
    );
    res.messages.map(item => {
      localisationMap[item.code] = item.message;
    });
    localisationModuleList.push(moduleName);
  }
  keyArray.map(item => {
    let labelFromKey = "";

    // append main category in the beginning
    if (isCategoryRequired) {
      labelFromKey = getLocalisationLabel(
        item.split(".")[0],
        localisationMap,
        prefix
      );
    }

    if (isMainTypeRequired) {
      if (isCategoryRequired) labelFromKey = `${labelFromKey}${delimiter}`;
      labelFromKey = getLocalisationLabel(
        item.split(".")[1],
        localisationMap,
        prefix
      );
    }

    if (isSubTypeRequired) {
      if (isMainTypeRequired || isCategoryRequired)
        labelFromKey = `${labelFromKey}${delimiter}`;
      labelFromKey = `${labelFromKey}${getLocalisationLabel(
        item,
        localisationMap,
        prefix
      )}`;
    }

    if (!isCategoryRequired && !isMainTypeRequired && !isSubTypeRequired) {
      labelFromKey = getLocalisationLabel(item, localisationMap, prefix);
    }

    localisedLabels.push(labelFromKey === "" ? item : labelFromKey);
  });
  if (isArray) {
    return localisedLabels;
  }
  return localisedLabels[0];
};

const getLocalisationLabel = (key, localisationMap, prefix) => {
  if (prefix != undefined && prefix != "") {
    key = `${prefix}_${key}`;
  }
  key = getTransformedLocale(key);

  if (localisationMap[key]) {
    return localisationMap[key];
  } else {
    logger.error(`no localisation value found for key ${key}`);
    return key;
  }
};

export const getDateInRequiredFormat = et => {
  if (!et) return "NA";
  var date = new Date(Math.round(Number(et)));
  var formattedDate =
    date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
  return formattedDate;
};

// export const getDateInRequiredFormat=(date)=>{
//     return date.toLocaleDateString('en-GB', {
//       month : '2-digit',
//       day : '2-digit',
//       year : 'numeric'
//   });
//   }

/**
 *
 * @param {*} value - values to be checked
 * @param {*} defaultValue - default value
 * @param {*} path  - jsonpath from where the value was fetched
 */
export const getValue = (value, defaultValue, path) => {
  if (
    value == undefined ||
    value == null ||
    value.length === 0 ||
    (value.length === 1 && (value[0] === null || value[0] === ""))
  ) {
    // logger.error(`no value found for path: ${path}`);
    return defaultValue;
  } else return value;
};
