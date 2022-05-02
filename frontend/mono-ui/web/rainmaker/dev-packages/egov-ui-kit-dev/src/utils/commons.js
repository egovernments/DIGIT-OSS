import axios from "axios";
import commonConfig from "config/common.js";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { httpRequest as httpRequestNew } from "egov-ui-framework/ui-utils/api";
import { getFileUrlFromAPI } from "egov-ui-framework/ui-utils/commons";
import { toggleSnackbarAndSetText } from "egov-ui-kit/redux/app/actions";
import { setFieldProperty } from "egov-ui-kit/redux/form/actions";
import { httpRequest } from "egov-ui-kit/utils/api";
import { TENANT } from "egov-ui-kit/utils/endPoints";
import { getAccessToken, getTenantId, getUserInfo, localStorageGet, localStorageSet } from "egov-ui-kit/utils/localStorageUtils";
import { searchAndDownloadPdf, searchAndPrintPdf } from "egov-ui-kit/utils/pdfUtils/generatePDF";
import Label from "egov-ui-kit/utils/translationNode";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import set from "lodash/set";
import React from "react";
import { FETCHBILL, PAYMENTSEARCH } from "./endPoints";
import { routeTo } from "./PTCommon/FormWizardUtils/formActionUtils";
import { getPropertyInfoScreenUrl } from "./PTCommon/FormWizardUtils/formUtils";

export const statusToMessageMapping = {
  rejected: "Rejected",
  closed: "Closed",
  open: "Opened",
  "re-assign": "Re-assigned",
  assigned: "Assigned",
  resolved: "Resolved",
  reassignrequested: "Re-assign Requested",
};

//status messages in home page and my complaints page
export const statusToLocalisationKeyMapping = {
  rejected: "CS_COMMON_STATUS_REJECTED",
  closed: "CS_COMMON_STATUS_CLOSED",
  open: "CS_COMMON_STATUS_SUBMITTED",
  reopened: "CS_COMMON_STATUS_REOPENED",
  reassigned: "CS_COMMON_STATUS_REASSIGNED",
  assigned: "CS_COMMON_STATUS_ASSIGNED",
  resolved: "CS_COMMON_STATUS_RESOLVED",
  reassignrequested: "CS_COMMON_STATUS_REASSIGN_REQUESTED",
};

export const displayStatus = (status) => {
  return status ? statusToMessageMapping[status && status.toLowerCase()] : "";
};

export const displayLocalizedStatusMessage = (status) => {
  return status ? statusToLocalisationKeyMapping[status && status.toLowerCase()] : "";
};
export const transformById = (payload, id) => {
  return (
    payload &&
    payload.reduce((result, item) => {
      if (!item.hasOwnProperty("active") || (item.hasOwnProperty("active") && item.active)) {
        result[item[id]] = {
          ...item,
        };
      }

      return result;
    }, {})
  );
};

export const hyphenSeperatedDateTime = (d) => {
  return d;
};

export const getSingleCodeObject = (dataKey, tempObj, MDMSdata, keys) => {
  keys.forEach((key) => {
    let splittedKey = key.split(".");
    tempObj[splittedKey[splittedKey.length - 1]] = MDMSdata[dataKey][key];
    tempObj[splittedKey[splittedKey.length - 1]].code = splittedKey[splittedKey.length - 1];
  });
  return tempObj;
};

export const getCategoryObject = (categoryCode, MDMSdata, dataKey, key, parentKey, parentKeyValue) => {
  let tempObj = {};
  tempObj[categoryCode] = MDMSdata[dataKey][key];
  tempObj[categoryCode].code = categoryCode;
  tempObj[categoryCode][parentKey] = parentKeyValue;
  return tempObj;
};

export const getUsageCategory = (dataKey, tempObj, MDMSdata, keys) => {
  keys.forEach((key) => {
    let splittedKey = key.split(".");
    let categoryCode = splittedKey.pop();
    if (splittedKey.length === 0) {
      tempObj["UsageCategoryMajor"] = { ...tempObj["UsageCategoryMajor"], ...getCategoryObject(categoryCode, MDMSdata, dataKey, key) };
    } else if (splittedKey.length === 1) {
      tempObj["UsageCategoryMinor"] = {
        ...tempObj["UsageCategoryMinor"],
        ...getCategoryObject(categoryCode, MDMSdata, dataKey, key, "usageCategoryMajor", splittedKey[splittedKey.length - 1]),
      };
    } else if (splittedKey.length === 2) {
      tempObj["UsageCategorySubMinor"] = {
        ...tempObj["UsageCategorySubMinor"],
        ...getCategoryObject(categoryCode, MDMSdata, dataKey, key, "usageCategoryMinor", splittedKey[splittedKey.length - 1]),
      };
    } else if (splittedKey.length === 3) {
      tempObj["UsageCategoryDetail"] = {
        ...tempObj["UsageCategoryDetail"],
        ...getCategoryObject(categoryCode, MDMSdata, dataKey, key, "usageCategorySubMinor", splittedKey[splittedKey.length - 1]),
      };
    }
  });
  return tempObj;
};

export const getTransformedDropdown = (MDMSdata, dataKeys) => {
  dataKeys.forEach((dataKey) => {
    if (MDMSdata && MDMSdata.hasOwnProperty(dataKey)) {
      let keys = MDMSdata[dataKey] && Object.keys(MDMSdata[dataKey]);
      let tempObj = {};
      if (keys && keys.length > 0) {
        if (dataKey !== "UsageCategory") {
          MDMSdata[dataKey] = getSingleCodeObject(dataKey, tempObj, MDMSdata, keys);
        } else {
          MDMSdata = { ...MDMSdata, ...getUsageCategory(dataKey, tempObj, MDMSdata, keys) };
        }
      }
    }
  });
  return MDMSdata;
};

export const generalMDMSDataRequestObj = (tenantId) => {
  let requestBody = {
    MdmsCriteria: {
      tenantId: tenantId,
      moduleDetails: [
        {
          moduleName: "PropertyTax",
          masterDetails: [
            {
              name: "Floor",
            },
            {
              name: "OccupancyType",
            },
            {
              name: "OwnerShipCategory",
            },
            {
              name: "OwnerType",
            },
            {
              name: "PropertySubType",
            },
            {
              name: "PropertyType",
            },
            {
              name: "SubOwnerShipCategory",
            },
            {
              name: "UsageCategory",
            },
          ],
        },
      ],
    },
  };
  return requestBody;
};

export const getGeneralMDMSDataDropdownName = () => {
  let keys = ["Floor", "OccupancyType", "OwnerShipCategory", "OwnerType", "PropertySubType", "PropertyType", "SubOwnerShipCategory", "UsageCategory"];
  return keys;
};

export const getQueryArg = (url, name) => {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return "";
  return decodeURIComponent(results[2].replace(/\+/g, " "));
};

export const addQueryArg = (url, queries = []) => {
  const urlParts = url.split("?");
  const path = urlParts[0];
  let queryParts = urlParts.length > 1 ? urlParts[1].split("&") : [];
  queries.forEach((query) => {
    const key = query.key;
    const value = query.value;
    const newQuery = `${key}=${value}`;
    queryParts.push(newQuery);
  });
  const newUrl = path + "?" + queryParts.join("&");
  return newUrl;
};

export const isFieldEmpty = (field) => {
  if (field === undefined || field === null) {
    return true;
  }
  if (typeof field !== "object") {
    field = field.toString().trim();
    return isEmpty(field);
  }
  return false;
};

export const slugify = (term) => {
  return term.toLowerCase().replace(/\s+/, "-");
};

export const persistInLocalStorage = (obj) => {
  Object.keys(obj).forEach((objKey) => {
    const objValue = obj[objKey];
    localStorageSet(objKey, objValue);
  }, this);
};

export const fetchFromLocalStorage = (key) => {
  return localStorageGet(key) || null;
};

export const getRequestUrl = (url, params) => {
  let query = Object.keys(params)
    .map((k) => encodeURIComponent(k) + "=" + encodeURIComponent(params[k]))
    .join("&");
  return url + "?" + query;
};

export const prepareForm = (params) => {
  let formData = new FormData();
  for (var k in params) {
    formData.append(k, params[k]);
  }
  return formData;
};

const getMonthName = (monthIndex) => {
  switch (monthIndex) {
    case 1:
      return "Jan";
    case 2:
      return "Feb";
    case 3:
      return "Mar";
    case 4:
      return "Apr";
    case 5:
      return "May";
    case 6:
      return "Jun";
    case 7:
      return "Jul";
    case 8:
      return "Aug";
    case 9:
      return "Sep";
    case 10:
      return "Oct";
    case 11:
      return "Nov";
    case 12:
      return "Dec";
    default:
      return "";
  }
};

const getCurrLocation = () => {
  return new Promise((resolve) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const currLoc = {};
        currLoc.lat = position.coords.latitude.toFixed(6);
        currLoc.lng = position.coords.longitude.toFixed(6);
        resolve(currLoc);
      });
    }
  });
};

export const getCurrentAddress = async () => {
  var currLoc = await getCurrLocation();
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${currLoc.lat},${currLoc.lng}&key=${commonConfig.MAP_API_KEY}`;
  try {
    return axios.get(url).then((res) => {
      if (res.data.status === "OK") {
        if (res.data.results[0]) {
          var currAddress = {};
          currAddress.lat = currLoc.lat;
          currAddress.lng = currLoc.lng;
          currAddress.address = res.data.results[0].formatted_address;
          return currAddress;
        }
      }
    });
  } catch (error) {
  }
};

export const mapCompIDToName = (IDObj, compID) => {
  return IDObj[compID] ? IDObj[compID].serviceCode : "Default";
};

export const getDateFromEpoch = (epoch) => {
  const dateObj = new Date(epoch);
  const year = dateObj.getFullYear().toString().slice(2, 4);
  const month = getMonthName(dateObj.getMonth() + 1);
  const day = dateObj.getDate();
  return day + "-" + month + "-" + year;
};

export const epochToDate = (et) => {
  if (!et) return null;
  var date = new Date(Math.round(Number(et)));
  var formattedDate = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
  return formattedDate;
};

export const getBodyClassFromPath = (path) => {
  let bodyClass = path
    .split("/")
    .filter((part) => part.trim().length > 0)
    .join("-");
  return bodyClass;
};

// remove the previous tokens; temp fix
// forEach not present in the prototype chain of some older browsers
export const addBodyClass = (path) => {
  const bodyClass = getBodyClassFromPath(path);
  try {
    document.body.classList.forEach((className) => document.body.classList.remove(className));
    bodyClass && document.body.classList.add(bodyClass);
  } catch (error) {}
};

export const prepareFormData = (form) => {
  const formFields = form.fields;
  return Object.keys(formFields).reduce((formData, fieldKey) => {
    const { file, jsonPath } = formFields[fieldKey];
    let { value } = formFields[fieldKey];
    if (file) {
      value = ((form.files && form.files[fieldKey]) || []).map((fieldFile) => fieldFile.fileStoreId);
    }
    return set(formData, jsonPath, value);
  }, {});
};

export const getUlbGradeLabel = (ulbGrade) => {
  if (ulbGrade) {
    let ulbWiseHeaderName = ulbGrade.toUpperCase();
    if (ulbWiseHeaderName.indexOf(" ") > 0) {
      ulbWiseHeaderName = ulbWiseHeaderName.split(" ").join("_");
    }
    return "ULBGRADE" + "_" + ulbWiseHeaderName;
  }
};

export const getTranslatedLabel = (labelKey, localizationLabels) => {
  let translatedLabel = null;
  if (localizationLabels && localizationLabels.hasOwnProperty(labelKey)) {
    translatedLabel = localizationLabels[labelKey];
    if (translatedLabel && typeof translatedLabel === "object" && translatedLabel.hasOwnProperty("message"))
      translatedLabel = translatedLabel.message;
  }
  return translatedLabel || labelKey;
};

export const fetchImages = (actionArray) => {
  let imageArray = [];
  actionArray.forEach((action, index) => {
    action.action === "open" && action.media && imageArray.push(action.media);
  });
  return imageArray[0] ? imageArray[0] : [];
};

// export const getUserInfo = () => {
//   let userInfo = getUserInfo();
//   try {
//     userInfo = JSON.parse(userInfo);
//   } catch (error) {
//     userInfo = null;
//   }
//   return userInfo;
// };

export const getCityNameByCode = (code, localizationLabels) => {
  const tenantId = code && code.replace(".", "_").toUpperCase();
  return code && getTranslatedLabel(`TENANT_TENANTS_${tenantId}`, localizationLabels);
};

export const isImage = (url) => {
  const acceptedImageTypes = ["jpg", "jpeg", "png"];
  const urlParts = url && url.split("?");
  const imageType = urlParts && urlParts.length && urlParts[0].split(".") && urlParts[0].split(".").length && urlParts[0].split(".").pop();
  return (imageType && acceptedImageTypes.indexOf(imageType) !== -1) || false;
};

//using in Employee Screens

const dateDiffInDays = (a, b) => {
  var millsPerDay = 1000 * 60 * 60 * 24;
  var utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  var utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
  return Math.floor((utc2 - utc1) / millsPerDay);
};

// export const getCommaSeperatedAddress = (buildingName, street) => {
//   return buildingName && street ? `${buildingName}, ${street}` : "NA";
// };

export const getTransformedStatus = (status) => {
  let transformedStatus = "";
  switch (status && status.toLowerCase()) {
    case "open":
    case "new":
    case "reassignrequested":
      transformedStatus = "UNASSIGNED";
      break;
    case "resolved":
    case "rejected":
    case "closed":
      transformedStatus = "CLOSED";
      break;
    case "assigned":
      transformedStatus = "ASSIGNED";
      break;
    default:
      transformedStatus = "UNASSIGNED";
      break;
  }
  return transformedStatus;
};

export const getFileSize = (file) => {
  const size = parseFloat(file.size / 1024).toFixed(2);
  return size;
};

export const isFileImage = (file) => {
  const mimeType = file["type"];
  return (mimeType && mimeType.split("/")[0] == "image") || false;
};

export const getNameFromId = (obj, id, defaultValue) => {
  return obj && id && obj[id] ? obj[id].name : defaultValue;
};

export const getPropertyFromObj = (obj, id, property, defaultValue) => {
  return obj && obj[id] ? obj[id][property] : defaultValue;
};

export const returnSLAStatus = (slaHours, submittedTime) => {
  const millsToAdd = slaHours * 60 * 60 * 1000;
  const toBeFinishedBy = millsToAdd + submittedTime;
  let slaStatement = "";
  const daysCount = dateDiffInDays(new Date(Date.now()), new Date(toBeFinishedBy));
  if (daysCount < 0) {
    slaStatement = Math.abs(daysCount) === 1 ? "CS_OVERDUE_BY_DAY" : "CS_OVERDUE_BY_DAYS";
    //slaStatement = Math.abs(daysCount) === 1 ? `Overdue by ${Math.abs(daysCount)} day` : `Overdue by ${Math.abs(daysCount)} days`;
  } else {
    slaStatement = Math.abs(daysCount) === 1 ? "CS_DAY_LEFT" : "CS_DAYS_LEFT";
    //slaStatement = Math.abs(daysCount) === 1 ? `${Math.abs(daysCount)} day left` : `${Math.abs(daysCount)} days left`;
  }
  return {
    slaStatement,
    daysCount,
  };
};

export const getCommaSeperatedAddress = (address, cities) => {
  let name = address && address.locality && address.locality.name ? address.locality.name : "";
  let cityName = address && address.city ? address.city : "";
  let pincode = address && address.pincode ? address.pincode : "";
  // cities &&
  //   cities.forEach((city) => {
  //     if (city.code === cityValue) {
  //       cityName = city.name;
  //     }
  //   });
  const addressKeys = ["doorNo", "buildingName", "street"];
  let addressArray = addressKeys.reduce((result, curr) => {
    if (address && address[curr]) {
      result.push(address[curr]);
    }
    return [...result];
  }, []);
  addressArray = pincode ? [...addressArray, name, cityName, pincode] : [...addressArray, name, cityName];
  return addressArray.join(", ");
};

export const getLatestCreationTime = (complaint) => {
  for (let i = 0; i < complaint.actions.length; i++) {
    if (complaint.actions[i].action === "reopen") {
      return complaint.actions[i].when;
    }
  }
  return complaint.auditDetails.createdTime;
};

export const transformLocalizationLabels = (localizationLabels) => {
  let labelsById = transformById(localizationLabels, "code");
  return labelsById;
};

export const flatten = (arr) => {
  return arr.reduce((flat, toFlatten) => {
    return flat.concat(Array.isArray(toFlatten) ? this.flatten(toFlatten) : toFlatten);
  }, []);
};

export const getTenantForLatLng = async (lat, lng) => {
  let queryObjList = [
    { key: "lat", value: lat },
    { key: "lng", value: lng },
    { key: "tenantId", value: commonConfig.tenantId },
  ];
  let response;
  if (lat && lng) {
    try {
      response = await httpRequest(TENANT.POST.URL, TENANT.POST.ACTION, queryObjList);
      return response.Tenant.code;
    } catch (error) {
      //throw and error
      throw new Error(error.message);
    }
  }
};

export const findLatestAssignee = (actionArray) => {
  for (let i = 0; i < actionArray.length; i++) {
    if (actionArray[i].status === "assigned") {
      return actionArray[i].assignee;
    }
  }
  return null;
};

const getLatestAction = (actionArr) => {
  return actionArr.reduce((result, current) => {
    if (current.when > result) {
      result = current.when;
    }
    return result;
  }, 0);
};

// export const getAddressDetail = (addressDetail) => {
//   const { houseNoAndStreetName, landmark, mohalla, city } = addressDetail;
//   return houseNoAndStreetName && landmark
//     ? `${houseNoAndStreetName},${mohalla},${landmark},${city}`
//     : !houseNoAndStreetName && landmark
//     ? `${mohalla},${landmark},${city}`
//     : houseNoAndStreetName && !landmark
//     ? `${houseNoAndStreetName},${mohalla},${city}`
//     : `${mohalla},${city}`;
// };

export const transformComplaintForComponent = (complaints, role, employeeById, citizenById, categoriesById, displayStatus) => {
  const defaultPhoneNumber = "";
  const transformedComplaints = Object.values(complaints.byId).map((complaintDetail, index) => {
    let filedUserName = complaintDetail && complaintDetail.citizen && complaintDetail.citizen.name;
    let isFiledByCSR =
      complaintDetail &&
      complaintDetail.actions &&
      complaintDetail.actions[complaintDetail.actions.length - 1].by &&
      complaintDetail.actions[complaintDetail.actions.length - 1].by.split(":")[1] &&
      complaintDetail.actions[complaintDetail.actions.length - 1].by.split(":")[1] === "Citizen Service Representative";
    return {
      header: getPropertyFromObj(complaints.categoriesById, complaintDetail.serviceCode, "serviceCode", "NA"),
      date: complaintDetail.auditDetails.createdTime,
      latestCreationTime: getLatestCreationTime(complaintDetail),
      complaintNo: complaintDetail.serviceRequestId,
      images: fetchImages(complaintDetail.actions).filter((imageSource) => isImage(imageSource)),
      complaintStatus: complaintDetail.status && getTransformedStatus(complaintDetail.status),
      rawStatus: complaintDetail.status && complaintDetail.status,
      address: complaintDetail.address ? complaintDetail.address : "",
      addressDetail: complaintDetail.addressDetail ? complaintDetail.addressDetail : {},
      reassign: complaintDetail.status === "reassignrequested" ? true : false,
      reassignRequestedBy:
        complaintDetail.status === "reassignrequested"
          ? getPropertyFromObj(employeeById, complaintDetail.actions[0].by.split(":")[0], "name", "NA")
          : "NA",
      latestActionTime: complaintDetail && complaintDetail.actions && getLatestAction(complaintDetail.actions),
      submittedBy: filedUserName ? (isFiledByCSR ? `${filedUserName} (Citizen Service Desk)` : filedUserName) : "NA",
      citizenPhoneNumber: complaintDetail && complaintDetail.citizen && complaintDetail.citizen.mobileNumber,
      assignedTo: complaintDetail && getPropertyFromObj(employeeById, findLatestAssignee(complaintDetail.actions), "name", "NA"),
      employeePhoneNumber:
        employeeById && employeeById[findLatestAssignee(complaintDetail.actions)]
          ? employeeById[findLatestAssignee(complaintDetail.actions)].mobileNumber
          : defaultPhoneNumber,
      status:
        role === "citizen"
          ? displayStatus(complaintDetail.status, complaintDetail.assignee, complaintDetail.actions.filter((complaint) => complaint.status)[0].action)
          : getTransformedStatus(complaintDetail.status) === "CLOSED"
          ? complaintDetail.rating
            ? displayStatus(`${complaintDetail.rating}/5`)
            : displayStatus(complaintDetail.actions[0].status)
          : displayStatus(
              returnSLAStatus(
                getPropertyFromObj(categoriesById, complaintDetail.serviceCode, "slaHours", "NA"),
                getLatestCreationTime(complaintDetail)
              ).slaStatement
            ),
      SLA: returnSLAStatus(getPropertyFromObj(categoriesById, complaintDetail.serviceCode, "slaHours", "NA"), getLatestCreationTime(complaintDetail))
        .daysCount,
    };
  });
  return transformedComplaints;
};

export const startSMSRecevier = () => {
  try {
    if (typeof androidAppProxy !== "undefined") {
      window.androidAppProxy.requestSMS();
    }
  } catch (error) {}
};

export const upperCaseFirst = (word) => {
  return word[0].toUpperCase() + word.slice(1, word.length);
};

//Specific for MDMS Screens
export const mergeMDMSDataArray = (oldData, newRow) => {
  const rawData = [...oldData];
  rawData.forEach((item, index) => {
    if (item.code === newRow.code) {
      //Update Case
      rawData.splice(index, 1);
    }
  });
  const mergedData = [newRow, ...rawData];
  return mergedData;
};

export const fetchDropdownData = async (dispatch, dataFetchConfig, formKey, fieldKey, state, boundary) => {
  const { url, action, requestBody, queryParams, hierarchyType } = dataFetchConfig;
  try {
    if (url) {
      let localizationLabels = {};
      if (state && state.app) localizationLabels = (state.app && state.app.localizationLabels) || {};
      const payloadSpec = await httpRequest(url, action, queryParams || [], requestBody);
      const dropdownData = boundary
        ? // ? jp.query(payloadSpec, dataFetchConfig.dataPath)
          payloadSpec.TenantBoundary[0].boundary
        : dataFetchConfig.dataPath.reduce((dropdownData, path) => {
            dropdownData = [...dropdownData, ...get(payloadSpec, path)];
            return dropdownData;
          }, []);
      const ddData =
        dropdownData &&
        dropdownData.length > 0 &&
        dropdownData.reduce((ddData, item) => {
          let option = {};
          if (fieldKey === "mohalla" && item.code) {
            const mohallaCode = `${queryParams[0].value.toUpperCase().replace(/[.]/g, "_")}_${hierarchyType}_${item.code
              .toUpperCase()
              .replace(/[._:-\s\/]/g, "_")}`;
            option = {
              label: getTranslatedLabel(mohallaCode, localizationLabels),
              value: item.code,
            };
          } else {
            option = {
              label: item.name,
              value: item.code,
            };
          }

          // let option = {
          //   label:
          //     fieldKey === "mohalla"
          //       ? `${queryParams[0].value.toUpperCase().replace(/[.]/g, "_")}_${hierarchyType}_${item.code.toUpperCase().replace(/[._:-\s\/]/g, "_")}`
          //       : item.name,
          //   value: item.code,
          // };
          //Only for boundary
          item.area && (option.area = item.area);
          ddData.push(option);
          return ddData;
        }, []);
      dispatch(setFieldProperty(formKey, fieldKey, "dropDownData", ddData));
    }
  } catch (error) {
    const { message } = error;
    if (fieldKey === "mohalla") {
      dispatch(
        toggleSnackbarAndSetText(
          true,
          { labelName: "There is no admin boundary data available for this tenant", labelKey: "ERR_NO_ADMIN_BOUNDARY_FOR_TENANT" },
          "error"
        )
      );
    } else {
      dispatch(toggleSnackbarAndSetText(true, { labelName: message, labelKey: message }, "error"));
    }
    return;
  }
};

export const trimObj = (obj) => {
  if (!Array.isArray(obj) && typeof obj != "object") return obj;
  for (var key in obj) {
    obj[key.trim()] = typeof obj[key] === "string" ? obj[key].trim() : trimObj(obj[key]);
    if (key === "") delete obj[key];
  }
  return obj;
};

export const hasTokenExpired = (status, data) => {
  if (status === 401) {
    if (data && data.Errors && Array.isArray(data.Errors) && data.Errors.length > 0 && data.Errors[0].code === "InvalidAccessTokenException")
      return true;
  }
  return false;
};

const getEndpointfromUrl = (url, name) => {
  if(url&&url.includes("digit-ui")  )
  {
    return url;
  }
  let result = url.split(`${name}=`)[1];
  return result;
};

const getTimeFormat = (epochTime) => {
  epochTime = new Date(epochTime);
  const Period = epochTime.getHours() < 12 ? "AM" : "PM";
  const Format = epochTime.getHours() % 12 > 0 ? epochTime.getHours() % 12 : 12;
  return Format.toString() + ":" + epochTime.toString().split(":")[1] + " " + Period;
};
const getDateFormat = (epochTime) => {
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
  epochTime = new Date(epochTime);
  const day = epochTime.getDate();
  const Month = epochTime.getMonth();
  return day.toString() + " " + monthNames[Month];
};

const getEventSLA = (item) => {
  const days = (Date.now() - item.auditDetails.lastModifiedTime) / (1000 * 60 * 60 * 24);
  let sla;

  if (item.eventType === "EVENTSONGROUND") {
    const disp =
      getDateFormat(item.eventDetails.fromDate) +
      " " +
      getTimeFormat(item.eventDetails.fromDate) +
      "-" +
      getDateFormat(item.eventDetails.toDate) +
      " " +
      getTimeFormat(item.eventDetails.toDate);
    sla = (
      // <div style={{ display: "flex" }}>
      //   <Icon name="access-time" action="device" viewBox="0 0 24 24" style={{ height: "20px", width: "35px" }} />
      <Label leftWrapperStyle fontSize={13} color="rgba(0, 0, 0, 0.60)" label={disp} containerStyle={{ marginBottom: 5, marginLeft: -7 }} />
      // </div>
    );
  } else {
    if (days >= 60) sla = <Label label="CS_SLA_MONTH" dynamicArray={[Math.floor(days / 30)]} fontSize={12} />;
    else if (days >= 30) sla = <Label label="CS_SLA_MONTH_ONE" dynamicArray={[Math.floor(days / 30)]} fontSize={12} />;
    else if (days >= 14) sla = <Label label="CS_SLA_WEEK" dynamicArray={[Math.floor(days / 7)]} fontSize={12} />;
    else if (days >= 7) sla = <Label label="CS_SLA_WEEK_ONE" dynamicArray={[Math.floor(days / 7)]} fontSize={12} />;
    else if (days >= 2) sla = <Label label="CS_SLA_DAY" dynamicArray={[Math.floor(days)]} fontSize={12} />;
    else if (days >= 1) sla = <Label label="CS_SLA_DAY_ONE" dynamicArray={[Math.floor(days)]} fontSize={12} />;
    else if ((days % 1) * 24 >= 2) sla = <Label label="CS_SLA_TIME" dynamicArray={[Math.floor((days % 1) * 24)]} fontSize={12} />;
    else if ((days % 1) * 24 >= 1) sla = <Label label="CS_SLA_TIME_ONE" dynamicArray={[Math.floor((days % 1) * 24)]} fontSize={12} />;
    else if ((days % 1) * 24 * 60 >= 2) sla = <Label label="CS_SLA_MINUTE" dynamicArray={[Math.floor((days % 1) * 24 * 60)]} fontSize={12} />;
    else if ((days % 1) * 24 * 60 >= 1) sla = <Label label="CS_SLA_MINUTE_ONE" dynamicArray={[Math.floor((days % 1) * 24 * 60)]} fontSize={12} />;
    else sla = <Label label="CS_SLA_NOW" fontSize={12} />;
  }

  return sla;
};

const getEventDate = (eventDate) => {
  const month = new Date(eventDate).toString().split(" ")[1].toUpperCase();
  const day = new Date(eventDate).getDate();
  return month + ":" + day;
};

const setDocuments = (fileUrl) => {
  return {
    title: "",
    link: (fileUrl && fileUrl.split(",")[0]) || "",
    linkText: "View",
    name: decodeURIComponent(fileUrl.split(",")[0].split("?")[0].split("/").pop().slice(13)) || `Document`,
  };
};

export const getTransformedNotifications = async (notifications) => {
  let data = [];
  let fileStoreIdArray = {};
  let fieStoreIdString = [];
  for (var i = 0; i < notifications.length; i++) {
    let item = notifications[i];
    if (item.eventDetails && item.eventDetails.documents) {
      item.eventDetails.documents.forEach((element) => {
        fieStoreIdString.push(element.fileStoreId);
        if (!get(fileStoreIdArray, item.id)) set(fileStoreIdArray, item.id, []);
        fileStoreIdArray[item.id].push(element.fileStoreId);
      });
    }

    data.push({
      actions: item.actions,
      name: item.name,
      description: item.description,
      eventCategory: item.eventCategory,
      address: item.eventDetails && item.eventDetails.address,
      SLA: item.auditDetails && item.auditDetails.lastModifiedTime && getEventSLA(item),
      buttons:
        item.actions && item.actions.actionUrls
          ? item.actions.actionUrls.map((actionUrls) => ({
              label: actionUrls.code,
              route: getEndpointfromUrl(actionUrls.actionUrl, "redirectTo"),
            }))
          : [],
      eventDate: (item.eventDetails && getEventDate(item.eventDetails.fromDate)) || "",
      eventToDate: (item.eventDetails && getEventDate(item.eventDetails.toDate)) || "",
      type: item.eventType,
      id: item.id,
      tenantId: item.tenantId,
      locationObj: item.eventDetails && { lat: item.eventDetails.latitude || 12.9199988, lng: item.eventDetails.longitude || 77.67078 },
      entryFees: item.eventDetails && item.eventDetails.fees,
      referenceId: item.referenceId,
    });
  }
  const fileUrls = await getFileUrlFromAPI(fieStoreIdString.join(","));
  const finalArray =
    data &&
    data.reduce((result, item) => {
      const doc =
        get(fileStoreIdArray, item.id) &&
        get(fileStoreIdArray, item.id).map((item, index) => {
          return setDocuments(get(fileUrls, item));
        });
      result.push({
        ...item,
        documents: doc,
      });
      return result;
    }, []);
  return finalArray;
};

export const onNotificationClick = async (history) => {
  try {
    const permanentCity = JSON.parse(getUserInfo()).permanentCity;
    let queryObject = [
      {
        key: "tenantId",
        value: permanentCity ? permanentCity : getTenantId(),
      },
    ];
    const requestBody = {
      RequestInfo: {
        apiId: "org.egov.pt",
        ver: "1.0",
        ts: 1502890899493,
        action: "asd",
        did: "4354648646",
        key: "xyz",
        msgId: "654654",
        requesterId: "61",
        authToken: getAccessToken(),
      },
    };

    await httpRequest("/egov-user-event/v1/events/lat/_update", "_update", queryObject, requestBody);
    history.push("/notifications");
  } catch (e) {
    toggleSnackbarAndSetText(true, { labelName: "Count update error", labelKey: "Count update error" }, "error");
  }
};

export const getTotalAmountDue = (payload) => {
  return payload && payload.Bill && payload.Bill.length > 0 && payload.Bill[0].totalAmount ? payload.Bill[0].totalAmount : 0;
};

export const setRoute = (link) => {
  // let moduleName = process.env.REACT_APP_NAME === "Citizen" ? '/citizen' : '/employee';
  // window.location.href =
  //   process.env.NODE_ENV === "production"
  //     ? moduleName + link
  //     : link;

  routeTo(link);
};

export const navigateToApplication = (businessService, propsHistory, applicationNo, tenantId, propertyId) => {
  if (businessService == "PT.MUTATION") {
    setRoute(`/pt-mutation/search-preview?applicationNumber=${applicationNo}&propertyId=${propertyId}&tenantId=${tenantId}`);
  } else if (businessService == "PT.CREATE") {
    setRoute(`/property-tax/application-preview?propertyId=${propertyId}&applicationNumber=${applicationNo}&tenantId=${tenantId}&type=property`);
  } else if (businessService == "PT.UPDATE") {
    setRoute(
      `/property-tax/application-preview?propertyId=${propertyId}&applicationNumber=${applicationNo}&tenantId=${tenantId}&type=updateProperty`
    );
  } else if (businessService == "PT.LEGACY") {
    setRoute(`/property-tax/application-preview?propertyId=${propertyId}&applicationNumber=${applicationNo}&tenantId=${tenantId}&type=legacy`);
  } else {
    setRoute(getPropertyInfoScreenUrl(propertyId, tenantId));
  }
};

export const getApplicationType = async (applicationNumber, tenantId, creationReason) => {
  const queryObject = [
    { key: "businessIds", value: applicationNumber },
    { key: "history", value: true },
    { key: "tenantId", value: tenantId },
  ];
  try {
    if (creationReason) {
      if (creationReason == "MUTATION") {
        return "PT.MUTATION";
      } else if (creationReason == "CREATE") {
        return "PT.CREATE";
      } else if (creationReason == "LEGACY_ENTRY") {
        return "PT.LEGACY";
      } else if (creationReason == "UPDATE") {
        return "PT.UPDATE";
      } else {
        return "NA";
      }
    } else {
      const payload = await httpRequest("egov-workflow-v2/egov-wf/process/_search", "_search", queryObject);
      if (payload && payload.ProcessInstances.length > 0) {
        return payload.ProcessInstances[0].businessService;
      }
    }
  } catch (e) {
  }
};

export const isDocumentValid = (docUploaded, requiredDocCount) => {
  const totalDocsKeys = Object.keys(docUploaded) || [];
  let isValid = true;
  for (let key = 0; key < totalDocsKeys.length; key++) {
    if (docUploaded[key].isDocumentRequired) {
      if (docUploaded[key].documents && docUploaded[key].dropdown && docUploaded[key].dropdown.value) {
        isValid = true;
      } else {
        isValid = false;
        break;
      }
    } else {
      if (docUploaded[key].documents && (!docUploaded[key].dropdown || !docUploaded[key].dropdown.value)) {
        isValid = false;
        break;
      }
    }
  }
  return isValid;
};

export const getMohallaData = (payload, tenantId) => {
  return (
    payload &&
    payload.TenantBoundary[0] &&
    payload.TenantBoundary[0].boundary &&
    payload.TenantBoundary[0].boundary.reduce((result, item) => {
      result.push({
        ...item,
        name: `${tenantId.toUpperCase().replace(/[.]/g, "_")}_REVENUE_${item.code.toUpperCase().replace(/[._:-\s\/]/g, "_")}`,
      });
      return result;
    }, [])
  );
};

export const downloadPdf = (link, openIn = "_blank") => {
  var win = window.open(link, openIn);
  if (win) {
    win.focus();
  }
};

export const printPdf = async (link) => {
  var response = await axios.get(link, {
    responseType: "arraybuffer",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/pdf",
    },
  });
  const file = new Blob([response.data], { type: "application/pdf" });
  const fileURL = URL.createObjectURL(file);
  var myWindow = window.open(fileURL);
  if (myWindow != undefined) {
    myWindow.addEventListener("load", (event) => {
      myWindow.focus();
      myWindow.print();
    });
  }
};

export const openPdf = async (link, openIn = "_blank") => {
  if (window && window.mSewaApp && window.mSewaApp.isMsewaApp && window.mSewaApp.isMsewaApp()) {
    downloadPdf(link, "_self");
  } else {
    var response = await axios.get(link, {
      responseType: "arraybuffer",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/pdf",
      },
    });
    const file = new Blob([response.data], { type: "application/pdf" });
    const fileURL = URL.createObjectURL(file);
    var myWindow = window.open(fileURL, openIn);
    if (myWindow != undefined) {
      myWindow.addEventListener("load", (event) => {
        myWindow.focus();
      });
    }
  }
};


export const downloadFromLink = async (link,filename="help.pdf") => {
  if (window && window.mSewaApp && window.mSewaApp.isMsewaApp && window.mSewaApp.isMsewaApp()) {
    downloadPdf(link, "_self");
  } else {
    const link = document.createElement("a");
    // create a blobURI pointing to our Blob
    link.href = link
    link.download = filename;
    // some browser needs the anchor to be in the doc
    document.body.append(link);
    link.click();
    link.remove();
    // in case the Blob uses a lot of memory
    setTimeout(() => URL.revokeObjectURL(link.href), 7000)
  }
};


export const getModuleName = () => {
  const pathName = window.location.pathname;
  if (pathName.indexOf("inbox") > -1) {
    return "rainmaker-common";
  } else if (pathName.indexOf("dss") > -1) {
    return "rainmaker-dss";
  } else if (pathName.indexOf("receipts") > -1) {
    return "rainmaker-receipts";
  } else if (pathName.indexOf("property-tax") > -1 || pathName.indexOf("rainmaker-pt") > -1 || pathName.indexOf("pt-mutation") > -1) {
    return "rainmaker-pt,rainmaker-pgr";
  } else if (pathName.indexOf("pt-common-screens") > -1 || pathName.indexOf("pt-mutation/public-search") > -1) {
    return "rainmaker-pt";
  } else if (
    pathName.indexOf("complaint") > -1 ||
    pathName.indexOf("pgr") > -1 ||
    pathName.indexOf("resolve-success") > -1 ||
    pathName.indexOf("employee-directory") > -1 ||
    pathName.indexOf("reopen-acknowledgement") > -1 ||
    pathName.indexOf("feedback") > -1 ||
    pathName.indexOf("request-reassign") > -1 ||
    pathName.indexOf("reassign-success") > -1
  ) {
    return "rainmaker-pgr";
  } else if (pathName.indexOf("wns") > -1 || pathName.indexOf("wns/public-search") > -1) {
    return "rainmaker-ws";
  } else if (
    pathName.indexOf("tradelicense") > -1 ||
    pathName.indexOf("rainmaker-tl") > -1 ||
    pathName.indexOf("tradelicence") > -1 ||
    pathName.indexOf("tradelicense-citizen") > -1
  ) {
    return "rainmaker-tl";
  } else if (pathName.indexOf("hrms") > -1) {
    return "rainmaker-hr";
  } else if (pathName.indexOf("bill-amend") > -1) {
    return "rainmaker-bill-amend,rainmaker-abg";
  } else if (pathName.indexOf("fire-noc") > -1) {
    return "rainmaker-noc,rainmaker-pgr";
  } else if (pathName.indexOf("dss/home") > -1) {
    return "rainmaker-dss";
  } else if (pathName.indexOf("language-selection") > -1) {
    return "rainmaker-common";
  } else if (pathName.indexOf("login") > -1) {
    return "rainmaker-common";
  } else if (pathName.indexOf("pay") > -1) {
    return "rainmaker-noc";
  } else if (pathName.indexOf("abg") > -1) {
    return "rainmaker-abg";
  } else if (pathName.indexOf("bills") > -1) {
    return "rainmaker-ws,rainmaker-abg,rainmaker-bills";
  } else if (pathName.indexOf("uc") > -1) {
    return "rainmaker-uc";
  } else if (pathName.indexOf("pgr-home") > -1 || pathName.indexOf("rainmaker-pgr") > -1) {
    return "rainmaker-pgr";
  } else if (
    pathName.indexOf("bpastakeholder") > -1 ||
    pathName.indexOf("edcrscrutiny") > -1 ||
    pathName.indexOf("egov-bpa") > -1 ||
    pathName.indexOf("oc-bpa") > -1
  ) {
    return "rainmaker-bpa,rainmaker-bpareg";
  } else if (pathName.indexOf("noc") > -1) {
    return "rainmaker-common-noc";
  } else if (
    pathName.indexOf("birth") > -1 ||
    pathName.indexOf("death") > -1 ||
    pathName.indexOf("bnd") > -1 
  ) {
    return "rainmaker-bnd";
  }else {
    return "rainmaker-common";
  }
};

export const businessServiceInfo = async (mdmsBody, businessService) => {
  const payload = await httpRequest("/egov-mdms-service/v1/_search", "_search", [], mdmsBody);
  let businessServiceInfoItem = null;
  const businessServiceArray = payload.MdmsRes.BillingService.BusinessService;
  businessServiceArray &&
    businessServiceArray.map((item) => {
      if (item.code == businessService) {
        businessServiceInfoItem = item;
      }
    });
  return businessServiceInfoItem;
};

export const searchConsumer = async (items, queryObject) => {
  const payload = await httpRequest(`/${items.fetchConsumerUrl}`, "_search", queryObject);
  let consumerDetails = payload && payload.WaterConnection ? payload.WaterConnection : payload.SewerageConnections;
  return consumerDetails;
};

export const fetchConsumerBill = async (items, queryObject) => {
  const response = await httpRequest(`/${items.fecthBillUrl}`, "_search", queryObject);
  return response && response.Bill && response.Bill[0];
};

export const getBusinessServiceMdmsData = async (dispatch, tenantId, businessService) => {
  let mdmsBody = {
    MdmsCriteria: {
      tenantId: tenantId,
      moduleDetails: [
        {
          moduleName: "BillingService",
          masterDetails: [{ name: "BusinessService" }],
        },
      ],
    },
  };
  try {
    const businessServiceItem = await businessServiceInfo(mdmsBody, businessService);
    dispatch(prepareFinalObject("businessServiceInfo", businessServiceItem));
  } catch (e) {
  }
};

export const getPaymentSearchAPI = (businessService = "", isCitizenbusinessService = false) => {
  if (businessService == "-1") {
    return `${PAYMENTSEARCH.GET.URL}${PAYMENTSEARCH.GET.ACTION}`;
  } else if (process.env.REACT_APP_NAME === "Citizen" && !isCitizenbusinessService) {
    return `${PAYMENTSEARCH.GET.URL}${PAYMENTSEARCH.GET.ACTION}`;
  }
  return `${PAYMENTSEARCH.GET.URL}${businessService}/${PAYMENTSEARCH.GET.ACTION}`;
};

export const getFetchBillAPI = () => {
  return `${FETCHBILL.GET.URL}`;
};

// const userObject=JSON.parse(localStorage.getItem("citizen.userRequestObject"))||{};
// return {user:[userObject]};

export const getUserSearchedResponse = () => {
  let userObject = JSON.parse(localStorage.getItem("citizen.userRequestObject")) || {};
  if (process.env.REACT_APP_NAME == "Citizen" && commonConfig.singleInstance) {
    userObject = convertUserForSingleInstance(userObject);
  }
  return { user: [userObject] };
};

export const getResultUrl = (moduleName, reportName) => {
  let reportResultUrl = `/report/${moduleName}/${reportName}/_get`;
  return reportResultUrl;
};
export const translate = (locale_text) => {
  return locale_text;
};

export const downloadWNSBill = (queryObj, fileName) => {
  searchAndDownloadPdf("/egov-pdf/download/WNS/wnsbill", queryObj, fileName);
};

export const printWNSBill = (queryObj) => {
  searchAndPrintPdf("/egov-pdf/download/WNS/wnsbill", queryObj);
};

const wnsBill = (consumerCode, tenantId, service) => {
  const query = [
    { key: "applicationNumber", value: consumerCode },
    { key: "tenantId", value: tenantId },
    { key: "bussinessService", value: service },
  ];
  downloadWNSBill(query, `${service}-BILL-${consumerCode}.pdf`);
};

export const downloadWNSBillFromConsumer = async (consumerCode, tenantId, service) => {
  let serviceURL = service == "WS" ? "ws-services/wc/_search" : "sw-services/swc/_search";
  let response = await httpRequestNew(
    "post",
    `${serviceURL}?tenantId=${tenantId}&isConnectionSearch=true&connectionNumber=${consumerCode}`,
    "_search",
    [],
    {}
  );
  if (response && response.WaterConnection && response.WaterConnection.length > 0) {
    wnsBill(response.WaterConnection[0].applicationNo, tenantId, service);
  } else if (response && response.SewerageConnections && response.SewerageConnections.length > 0) {
    wnsBill(response.SewerageConnections[0].applicationNo, tenantId, service);
  }
};

/* TO CONVERT USER TO CENTRAL INSTANCE */
export const convertUserForSingleInstance = (user = {}) => {
  let tenantId = commonConfig.tenantId;
  localStorage.setItem("Citizen.tenant-id", tenantId);
  localStorage.setItem("tenant-id", tenantId);
  user.tenantId = tenantId;
  return { ...user };
};
