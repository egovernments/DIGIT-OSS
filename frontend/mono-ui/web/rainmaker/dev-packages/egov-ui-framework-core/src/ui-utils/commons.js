import commonConfig from "config/common.js";
import { getRequiredDocuments } from "egov-ui-framework/ui-containers/RequiredDocuments/reqDocs";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import {
  handleScreenConfigurationFieldChange as handleField,
  hideSpinner,
  prepareFinalObject,
  showSpinner,
  toggleSnackbar,
  toggleSpinner
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { validate } from "egov-ui-framework/ui-redux/screen-configuration/utils";
import { getUserSearchedResponse } from "egov-ui-kit/utils/commons";
import {
  getLocale,
  getLocalization,
  getTenantId,
  getUserInfo,
  localStorageGet,
  localStorageSet
} from "egov-ui-kit/utils/localStorageUtils";
import cloneDeep from "lodash/cloneDeep";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import orderBy from "lodash/orderBy";
import set from "lodash/set";
import { httpRequest, uploadFile } from "./api.js";

export const addComponentJsonpath = (components, jsonPath = "components") => {
  for (var componentKey in components) {
    if (components.hasOwnProperty(componentKey)) {
      if (components[componentKey].children) {
        components[
          componentKey
        ].componentJsonpath = `${jsonPath}.${componentKey}`;
        const childJsonpath = `${components[componentKey].componentJsonpath}.children`;
        addComponentJsonpath(components[componentKey].children, childJsonpath);
      } else {
        components[
          componentKey
        ].componentJsonpath = `${jsonPath}.${componentKey}`;
      }
    }
  }
  return components;
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

export const ifUserRoleExists = (role) => {
  let userInfo = JSON.parse(getUserInfo());
  const roles = get(userInfo, "roles");
  const roleCodes = roles ? roles.map((role) => role.code) : [];
  if (roleCodes.indexOf(role) > -1) {
    return true;
  } else return false;
};

export const fetchFromLocalStorage = (key) => {
  return localStorageGet(key) || null;
};

export const trimObj = (obj) => {
  if (!Array.isArray(obj) && typeof obj !== "object") return obj;
  for (var key in obj) {
    obj[key.trim()] =
      typeof obj[key] === "string" ? obj[key].trim() : trimObj(obj[key]);
    if (key === "") delete obj[key];
  }
  return obj;
};

export const getDateInEpoch = () => {
  return new Date().getTime();
};

export const getImageUrlByFile = (file) => {
  return new Promise((resolve) => {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      const fileurl = e.target.result;
      resolve(fileurl);
    };
  });
};

export const getFileSize = (file) => {
  const size = parseFloat(file.size / 1024).toFixed(2);
  return size;
};

export const isFileValid = (file, acceptedFiles) => {
  const mimeType = file["type"];
  return (
    (mimeType &&
      acceptedFiles &&
      acceptedFiles.indexOf(mimeType.split("/")[1]) > -1) ||
    false
  );
};

export const transformById = (payload, id) => {
  return (
    payload &&
    payload.reduce((result, item) => {
      result[item[id]] = {
        ...item,
      };

      return result;
    }, {})
  );
};

export const getTransformedLocalStorgaeLabels = () => {
  const localeLabels = JSON.parse(
    getLocalization(`localization_${getLocale()}`)
  );
  return transformById(localeLabels, "code");
};

export const getTranslatedLabel = (labelKey, localizationLabels) => {
  let translatedLabel = null;
  if (localizationLabels && localizationLabels.hasOwnProperty(labelKey)) {
    translatedLabel = localizationLabels[labelKey];
    if (
      translatedLabel &&
      typeof translatedLabel === "object" &&
      translatedLabel.hasOwnProperty("message")
    )
      translatedLabel = translatedLabel.message;
  }
  return translatedLabel || labelKey;
};

export const epochToYmd = (et) => {
  // Return null if et already null
  if (!et) return null;
  // Return the same format if et is already a string (boundary case)
  if (typeof et === "string") return et;
  let date = new Date(et);
  let day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
  let month =
    date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
  // date = `${date.getFullYear()}-${month}-${day}`;
  var formatted_date = date.getFullYear() + "-" + month + "-" + day;
  return formatted_date;
};

export const getLocaleLabels = (label, labelKey, localizationLabels) => {
  if (!localizationLabels)
    localizationLabels = transformById(
      JSON.parse(getLocalization(`localization_${getLocale()}`)),
      "code"
    );
  if (labelKey) {
    let translatedLabel = getTranslatedLabel(labelKey, localizationLabels);
    if (!translatedLabel || labelKey === translatedLabel) {
      return translatedLabel;
    } else {
      return translatedLabel;
    }
  } else {
    return label;
  }
};

export const replaceStrInPath = (inputString, search, replacement) => {
  String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, "g"), replacement);
  };
  return inputString.replaceAll(search, replacement);
};

export const getFileUrlFromAPI = async (fileStoreId, tenantId) => {
  const queryObject = [
    { key: "tenantId", value: tenantId || commonConfig.tenantId },
    { key: "fileStoreIds", value: fileStoreId },
  ];
  try {
    const fileUrl = await httpRequest(
      "get",
      "/filestore/v1/files/url",
      "",
      queryObject
    );
    return fileUrl;
  } catch (e) {
    console.log(e);
  }
};

const getAllFileStoreIds = async (ProcessInstances) => {
  return (
    ProcessInstances &&
    ProcessInstances.reduce((result, eachInstance) => {
      if (eachInstance.documents) {
        let fileStoreIdArr = eachInstance.documents.map((item) => {
          return item.fileStoreId;
        });
        result[eachInstance.id] = fileStoreIdArr.join(",");
      }
      return result;
    }, {})
  );
};

export const getFileUrl = (linkText = "") => {
  const linkList =
    (linkText && typeof linkText == "string" && linkText.split(",")) || [];
  let fileURL = "";
  linkList &&
    linkList.map((link) => {
      if (
        !link.includes("large") &&
        !link.includes("medium") &&
        !link.includes("small")
      ) {
        fileURL = link;
      }
    });
  return fileURL;
};

export const setDocuments = async (
  payload,
  sourceJsonPath,
  destJsonPath,
  dispatch,
  businessService
) => {
  let uploadedDocData = get(payload, sourceJsonPath, []);
  // uploadedDocData = uploadedDocData && uploadedDocData.filter(document => document && Object.keys(document).length > 0 && document.active);
  const fileStoreIds =
    uploadedDocData &&
    uploadedDocData
      .map((item) => {
        return item.fileStoreId;
      })
      .join(",");
  const fileUrlPayload =
    fileStoreIds && (await getFileUrlFromAPI(fileStoreIds));
  const reviewDocData =
    uploadedDocData &&
    uploadedDocData.map((item, index) => {
      return {
        title: `${businessService}_${item.documentType}` || "",
        link:
          (fileUrlPayload &&
            fileUrlPayload[item.fileStoreId] &&
            getFileUrl(fileUrlPayload[item.fileStoreId])) ||
          "",
        linkText: "View",
        name:
          (fileUrlPayload &&
            fileUrlPayload[item.fileStoreId] &&
            decodeURIComponent(
              getFileUrl(fileUrlPayload[item.fileStoreId])
                .split("?")[0]
                .split("/")
                .pop()
                .slice(13)
            )) ||
          `Document - ${index + 1}`,
      };
    });
  reviewDocData && dispatch(prepareFinalObject(destJsonPath, reviewDocData));
};

export const addWflowFileUrl = async (ProcessInstances, prepareFinalObject) => {
  const fileStoreIdByAction = await getAllFileStoreIds(ProcessInstances);
  const fileUrlPayload = await getFileUrlFromAPI(
    Object.values(fileStoreIdByAction).join(",")
  );
  const processInstances = cloneDeep(ProcessInstances);
  processInstances.map((item) => {
    if (item.documents && item.documents.length > 0) {
      item.documents.forEach((i) => {
        if (i.fileStoreId && fileUrlPayload[i.fileStoreId]) {
          i.link = getFileUrl(fileUrlPayload[i.fileStoreId]);
          i.title = `TL_${i.documentType}`;
          i.name = decodeURIComponent(
            getFileUrl(fileUrlPayload[i.fileStoreId])
              .split("?")[0]
              .split("/")
              .pop()
              .slice(13)
          );
          i.linkText = "View";
        }
      });
    }
  });
  prepareFinalObject("workflow.ProcessInstances", processInstances);
};

export const setBusinessServiceDataToLocalStorage = async (
  queryObject,
  dispatch
) => {
  try {
    dispatch(toggleSpinner());
    const payload = await httpRequest(
      "post",
      "egov-workflow-v2/egov-wf/businessservice/_search",
      "_search",
      queryObject
    );
    if (
      payload &&
      payload.BusinessServices &&
      payload.BusinessServices.length > 0
    ) {
      localStorageSet(
        "businessServiceData",
        JSON.stringify(get(payload, "BusinessServices"))
      );
    } else {
      dispatch(
        toggleSnackbar(
          true,
          {
            labelName: "Business Service returned empty object",
            labelKey: "ERR_NOT_AUTHORISED_BUSINESS_SERVICE",
          },
          "error"
        )
      );
    }
    dispatch(toggleSpinner());
  } catch (e) {
    dispatch(toggleSpinner());
    dispatch(
      toggleSnackbar(
        true,
        {
          labelName: "Not authorized to access Business Service!",
          labelKey: "ERR_NOT_AUTHORISED_BUSINESS_SERVICE",
        },
        "error"
      )
    );
  }
};

export const acceptedFiles = (acceptedExt) => {
  const splitExtByName = acceptedExt.split(",");
  const acceptedFileTypes = splitExtByName.reduce((result, curr) => {
    if (curr.includes("image")) {
      result.push("image");
    } else {
      result.push(curr.split(".")[1]);
    }
    return result;
  }, []);
  return acceptedFileTypes;
};

export const handleFileUpload = (
  event,
  handleDocument,
  props,
  afterFileSelected,
  ifError
) => {
  const S3_BUCKET = {
    endPoint: "filestore/v1/files",
  };
  let uploadDocument = true;
  const { inputProps, maxFileSize, moduleName = "common" } = props;
  const input = event.target;
  if (input.files && input.files.length > 0) {
    const files = input.files;
    Object.keys(files).forEach(async (key, index) => {
      const file = files[key];
      const fileValid = isFileValid(file, acceptedFiles(inputProps.accept));
      const isSizeValid = getFileSize(file) <= maxFileSize;
      if (!fileValid) {
        alert(`Only image or pdf files can be uploaded`);
        uploadDocument = false;
      }
      if (!isSizeValid) {
        alert(`Maximum file size can be ${Math.round(maxFileSize / 1000)} MB`);
        uploadDocument = false;
      }
      if (uploadDocument) {
        afterFileSelected &&
          typeof afterFileSelected == "function" &&
          afterFileSelected();
        try {
          if (file.type.match(/^image\//)) {
            const fileStoreId = await uploadFile(
              S3_BUCKET.endPoint,
              moduleName,
              file,
              commonConfig.tenantId
            );
            handleDocument(file, fileStoreId);
          } else {
            const fileStoreId = await uploadFile(
              S3_BUCKET.endPoint,
              moduleName,
              file,
              commonConfig.tenantId
            );
            handleDocument(file, fileStoreId);
          }
        } catch (e) {
          ifError && typeof ifError == "function" && ifError();
        }
      }
    });
  }
};

//localizations
export const getTransformedLocale = (label) => {
  if (typeof label === "number") return label;
  return label && label.toUpperCase().replace(/[.:-\s\/]/g, "_");
};

export const appendModulePrefix = (value, localePrefix) => {
  const { moduleName, masterName } = localePrefix;

  const transformedValue = `${getTransformedLocale(
    moduleName
  )}_${getTransformedLocale(masterName)}_${getTransformedLocale(value)}`;
  return transformedValue;
};

export const orderWfProcessInstances = (processInstances) => {
  processInstances = orderBy(
    processInstances,
    "auditDetails.lastModifiedTime",
    "asc"
  );
  let initiatedFound = false;
  const filteredInstances = processInstances.reverse().reduce((acc, item) => {
    if (item.action == "INITIATE" && !initiatedFound) {
      initiatedFound = true;
      acc.push(item);
    } else if (item.action !== "INITIATE") {
      acc.push(item);
    }
    return acc;
  }, []);
  return filteredInstances.reverse();
};

export const getSelectedTabIndex = (paymentType) => {
  switch (paymentType) {
    case "Cash":
      return {
        selectedPaymentMode: "cash",
        selectedTabIndex: 0,
        fieldsToValidate: ["payeeDetails"],
      };
    case "Cheque":
      return {
        selectedPaymentMode: "cheque",
        selectedTabIndex: 1,
        fieldsToValidate: ["payeeDetails", "chequeDetails"],
      };
    case "DD":
      return {
        selectedPaymentMode: "demandDraft",
        selectedTabIndex: 2,
        fieldsToValidate: ["payeeDetails", "demandDraftDetails"],
      };
    case "Card":
      return {
        selectedPaymentMode: "card",
        selectedTabIndex: 3,
        fieldsToValidate: ["payeeDetails", "cardDetails"],
      };
    default:
      return {
        selectedPaymentMode: "cash",
        selectedTabIndex: 0,
        fieldsToValidate: ["payeeDetails"],
      };
  }
};
export const getMultiUnits = (multiUnits) => {
  let hasTradeType = false;
  let hasAccessoryType = false;

  let mergedUnits =
    multiUnits &&
    multiUnits.reduce((result, item) => {
      hasTradeType = item.hasOwnProperty("tradeType");
      hasAccessoryType = item.hasOwnProperty("accessoryCategory");
      if (item && item !== null && (hasTradeType || hasAccessoryType)) {
        if (item.hasOwnProperty("id")) {
          if (item.hasOwnProperty("active") && item.active) {
            if (item.hasOwnProperty("isDeleted") && !item.isDeleted) {
              set(item, "active", false);
              result.push(item);
            } else {
              result.push(item);
            }
          }
        } else {
          if (!item.hasOwnProperty("isDeleted")) {
            result.push(item);
          }
        }
      }
      return result;
    }, []);

  return mergedUnits;
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

export const findItemInArrayOfObject = (arr, conditionCheckerFn) => {
  for (let i = 0; i < arr.length; i++) {
    if (conditionCheckerFn(arr[i])) {
      return arr[i];
    }
  }
};

export const validateFields = (
  objectJsonPath,
  state,
  dispatch,
  screen = "apply"
) => {
  const fields = get(
    state.screenConfiguration.screenConfig[screen],
    objectJsonPath,
    {}
  );
  let isFormValid = true;
  for (var variable in fields) {
    if (fields.hasOwnProperty(variable)) {
      if (
        fields[variable] &&
        fields[variable].props &&
        (fields[variable].props.disabled === undefined ||
          !fields[variable].props.disabled) &&
        !validate(
          screen,
          {
            ...fields[variable],
            value: get(
              state.screenConfiguration.preparedFinalObject,
              fields[variable].jsonPath
            ),
          },
          dispatch,
          true
        )
      ) {
        isFormValid = false;
      }
    }
  }
  return isFormValid;
};

export const downloadPDFFileUsingBase64 = (receiptPDF, filename) => {
  if (
    window &&
    window.mSewaApp &&
    window.mSewaApp.isMsewaApp &&
    window.mSewaApp.isMsewaApp() &&
    window.mSewaApp.downloadBase64File
  ) {
    // we are running under webview
    receiptPDF.getBase64((data) => {
      window.mSewaApp.downloadBase64File(data, filename);
    });
  } else {
    // we are running in browser
    receiptPDF.download(filename);
  }
};

if (window) {
  window.downloadPDFFileUsingBase64 = downloadPDFFileUsingBase64;
}
// Get user data from uuid API call
export const getUserDataFromUuid = async (bodyObject) => {
  try {
    // const response = await httpRequest(
    //   "post",
    //   "/user/_search",
    //   "",
    //   [],
    //   bodyObject
    // );

    const response = getUserSearchedResponse();
    return response;
  } catch (error) {
    console.log(error);
    return {};
  }
};

export const getCommonPayUrl = (
  dispatch,
  applicationNo,
  tenantId,
  businessService
) => {
  const url = `/egov-common/pay?consumerCode=${applicationNo}&tenantId=${tenantId}&businessService=${businessService}`;
  dispatch(setRoute(url));
};

export const getTodaysDateInYMD = () => {
  let date = new Date();
  let month = date.getMonth() + 1;
  let day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
  date = `${date.getFullYear()}-${month}-${day}`;
  return date;
};

export const getMaxDate = (yr) => {
  let date = new Date();
  let year = date.getFullYear() - yr;
  let month = date.getMonth() + 1;
  let day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
  date = `${year}-${month}-${day}`;
  return date;
};

export const isPublicSearch = () => {
  return (
    location && location.pathname && location.pathname.includes("/withoutAuth")
  );
};

export const getStatusKey = (status) => {
  switch (status) {
    case "ACTIVE":
      return { labelName: "Active", labelKey: "ACTIVE" };
    case "INACTIVE":
      return { labelName: "Inactive", labelKey: "INACTIVE" };
    case "INITIATED":
      return { labelName: "Initiated", labelKey: "INITIATED" };
    case "APPLIED":
      return { labelName: "Applied", labelKey: "APPLIED" };
    case "PAID":
      return { labelName: "Paid", labelKey: "PAID" };

    case "APPROVED":
      return { labelName: "Approved", labelKey: "APPROVED" };
    case "REJECTED":
      return { labelName: "Rejected", labelKey: "REJECTED" };
    case "CANCELLED":
      return { labelName: "Cancelled", labelKey: "CANCELLED" };
    case "PENDINGAPPROVAL ":
      return {
        labelName: "Pending for Approval",
        labelKey: "PENDINGAPPROVAL",
      };
    case "PENDINGPAYMENT":
      return {
        labelName: "Pending payment",
        labelKey: "PENDINGPAYMENT",
      };
    case "DOCUMENTVERIFY":
      return {
        labelName: "Pending for Document Verification",
        labelKey: "DOCUMENTVERIFY",
      };
    case "FIELDINSPECTION":
      return {
        labelKey: "FIELDINSPECTION",
        labelName: "Pending for Field Inspection",
      };
    default:
      return {
        labelName: status,
        labelKey: status,
      };
  }
};

export const getRequiredDocData = async (
  action,
  dispatch,
  moduleDetails,
  closePopUp
) => {
  let tenantId =
    process.env.REACT_APP_NAME === "Citizen"
      ? JSON.parse(getUserInfo()).permanentCity || commonConfig.tenantId
      : getTenantId();
  let mdmsBody = {
    MdmsCriteria: {
      tenantId:
        moduleDetails[0].moduleName === "ws-services-masters" ||
        moduleDetails[0].moduleName === "PropertyTax"
          ? commonConfig.tenantId
          : tenantId,
      moduleDetails: moduleDetails,
    },
  };
  try {
    let payload = null;
    payload = await httpRequest(
      "post",
      "/egov-mdms-service/v1/_search",
      "_search",
      [],
      mdmsBody
    );
    const moduleName = moduleDetails[0].moduleName;
    let documents = get(payload.MdmsRes, `${moduleName}.Documents`, []);

    if (moduleName === "PropertyTax") {
      payload.MdmsRes.tenant.tenants =
        payload.MdmsRes.tenant.citymodule[1].tenants;
    }
    const reqDocuments = getRequiredDocuments(
      documents,
      moduleName,
      footerCallBackForRequiredDataModal(moduleName, closePopUp)
    );
    set(
      action,
      "screenConfig.components.adhocDialog.children.popup",
      reqDocuments
    );
    dispatch(prepareFinalObject("searchScreenMdmsData", payload.MdmsRes));
    return { payload, reqDocuments };
  } catch (e) {
    console.log(e);
  }
};

const footerCallBackForRequiredDataModal = (moduleName, closePopUp) => {
  const tenant = getTenantId();
  switch (moduleName) {
    case "FireNoc":
      return (state, dispatch) => {
        dispatch(prepareFinalObject("FireNOCs", []));
        dispatch(prepareFinalObject("DynamicMdms", {}));
        dispatch(prepareFinalObject("documentsUploadRedux", {}));
        const applyUrl =
          process.env.REACT_APP_SELF_RUNNING === "true"
            ? `/egov-ui-framework/fire-noc/apply`
            : `/fire-noc/apply`;
        dispatch(setRoute(applyUrl));
      };
    case "PropertyTax":
      return (state, dispatch) => {
        dispatch(prepareFinalObject("documentsUploadRedux", {}));
        const applyUrl = `/property-tax/assessment-form`;
        dispatch(setRoute(applyUrl));
      };
    case "ws-services-masters":
      return (state, dispatch) => {
        dispatch(prepareFinalObject("WaterConnection", []));
        dispatch(prepareFinalObject("SewerageConnection", []));
        dispatch(prepareFinalObject("applyScreen", {}));
        dispatch(prepareFinalObject("searchScreen", {}));
        const applyUrl =
          process.env.REACT_APP_NAME === "Citizen"
            ? `/wns/apply`
            : `/wns/apply`;
        dispatch(setRoute(applyUrl));
      };
    case "TradeLicense":
      if (closePopUp) {
        return (state, dispatch) => {
          dispatch(prepareFinalObject("Licenses", []));
          dispatch(prepareFinalObject("LicensesTemp", []));
          dispatch(prepareFinalObject("DynamicMdms", {}));
          const applyUrl = `/tradelicence/apply?tenantId=${tenant}`;
          dispatch(
            handleField("search", "components.adhocDialog", "props.open", false)
          );
          dispatch(setRoute(applyUrl));
        };
      }
  }
};
export const showHideAdhocPopup = (state, dispatch, screenKey) => {
  let toggle = get(
    state.screenConfiguration.screenConfig[screenKey],
    "components.adhocDialog.props.open",
    false
  );
  dispatch(
    handleField(screenKey, "components.adhocDialog", "props.open", !toggle)
  );
};
export const getObjectValues = (objData) => {
  return (
    objData &&
    Object.values(objData).map((item) => {
      return item;
    })
  );
};
export const getObjectKeys = (objData) => {
  return (
    objData &&
    Object.keys(objData).map((item) => {
      return { code: item, active: true };
    })
  );
};
export const getMdmsJson = async (state, dispatch, reqObj) => {
  let { setPath, setTransformPath, dispatchPath, moduleName, name, filter } =
    reqObj;
  let mdmsBody = {
    MdmsCriteria: {
      tenantId: commonConfig.tenantId,
      moduleDetails: [
        {
          moduleName,
          masterDetails: [{ name, filter }],
        },
      ],
    },
  };
  try {
    let payload = null;
    payload = await httpRequest(
      "post",
      "/egov-mdms-service/v1/_search",
      "_search",
      [],
      mdmsBody
    );
    let result = get(payload, `MdmsRes.${moduleName}.${name}`, []);
    // let filterResult = type ? result.filter(item => item.type == type) : result;
    set(payload, setPath, result);
    payload = getTransformData(payload, setPath, setTransformPath);
    dispatch(prepareFinalObject(dispatchPath, get(payload, dispatchPath, [])));
    //dispatch(prepareFinalObject(dispatchPath, payload.DynamicMdms));
    dispatch(prepareFinalObject(`DynamicMdms.apiTriggered`, false));
  } catch (e) {
    console.log(e);
    dispatch(prepareFinalObject(`DynamicMdms.apiTriggered`, false));
  }
};
export const getTransformData = (object, getPath, transerPath) => {
  let data = get(object, getPath);
  let transformedData = {};
  var formTreeBase = (transformedData, row) => {
    const splitList = row.code.split(".");
    splitList.map(function (value, i) {
      transformedData =
        i == splitList.length - 1
          ? (transformedData[value] = row)
          : transformedData[value] || (transformedData[value] = {});
    });
  };
  data.map((a) => {
    formTreeBase(transformedData, a);
  });
  set(object, transerPath, transformedData);
  return object;
};

export const enableField = (screenKey, jsonPath = "components", dispatch) => {
  dispatch(handleField(screenKey, jsonPath, "props.disabled", false));
};
export const disableField = (screenKey, jsonPath = "components", dispatch) => {
  dispatch(handleField(screenKey, jsonPath, "props.disabled", true));
};
export const enableFieldAndHideSpinner = (
  screenKey,
  jsonPath = "components",
  dispatch
) => {
  dispatch(hideSpinner());
  enableField(screenKey, jsonPath, dispatch);
};
export const disableFieldAndShowSpinner = (
  screenKey,
  jsonPath = "components",
  dispatch
) => {
  dispatch(showSpinner());
  disableField(screenKey, jsonPath, dispatch);
};

export const sortDropdownNames = (e1, e2) => {
  if (e1 && e1.name && typeof e1.name == "string") {
    return (
      e1 &&
      e1.name &&
      e1.name.localeCompare &&
      e1.name.localeCompare((e2 && e2.name && e2.name) || "")
    );
  } else if (e1 && e1.name && typeof e1.name == "number") {
    return e1.name - e2.name;
  } else {
    return 1;
  }
};

export const sortDropdownLabels = (e1, e2) => {
  if (e1 && e1.label && typeof e1.label == "string") {
    return (
      e1 &&
      e1.label &&
      e1.label.localeCompare &&
      e1.label.localeCompare((e2 && e2.label && e2.label) || "")
    );
  } else if (e1 && e1.label && typeof e1.label == "number") {
    return e1.label - e2.label;
  } else {
    return 1;
  }
};

export const captureSource = () => {
  //Set the source of the Booking.
  if (window.mSewaApp) localStorageSet("isNative", "true");
  else localStorageSet("isNative", "false");
  const isNative = localStorageGet("isNative")==="true";
  try {
    let source = process.env.REACT_APP_NAME === "Citizen"
      ? (isNative
        ? "mobileapp"
        : "web")
      : "ivr";
    return source;
  } catch (error) {
    console.error(error);
  }
};
