import { convertDateToEpoch } from "egov-ui-framework/ui-config/screens/specs/utils";
import {
  handleScreenConfigurationFieldChange as handleField,
  prepareFinalObject,
  toggleSnackbar,
  toggleSpinner
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { httpRequest } from "egov-ui-framework/ui-utils/api";
import { getTransformedLocale } from "egov-ui-framework/ui-utils/commons";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import jp from "jsonpath";
import get from "lodash/get";
import set from "lodash/set";
import store from "ui-redux/store";
import axios from "axios";

import {
  getFileUrl,
  getFileUrlFromAPI, getMultiUnits, getQueryArg, setBusinessServiceDataToLocalStorage,
} from "egov-ui-framework/ui-utils/commons";

export const acceptedFiles = acceptedExt => {
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
export const findItemInArrayOfObject = (arr, conditionCheckerFn) => {
  for (let i = 0; i < arr.length; i++) {
    if (conditionCheckerFn(arr[i])) {
      return arr[i];
    }
  }
};

export const getFileSize = file => {
  const size = parseFloat(file.size / 1024).toFixed(2);
  return size;
};

export const isFileValid = (file, acceptedFiles) => {
  const mimeType = file["type"];
  //alert("mimeType of file is ",mimeType);
  return (
    (mimeType &&
      acceptedFiles &&
      acceptedFiles.indexOf(mimeType.split("/")[1]) > -1) ||
    false
  );
};

export const msToTime = (duration) =>{
  var milliseconds = Math.floor((duration % 1000) / 100),
    seconds = Math.floor((duration / 1000) % 60),
    minutes = Math.floor((duration / (1000 * 60)) % 60),
    hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

  hours = (hours < 10) ? "0" + hours : hours;
  minutes = (minutes < 10) ? "0" + minutes : minutes;
  seconds = (seconds < 10) ? "0" + seconds : seconds;

  return hours + " Hours  " + minutes + " Min  " + seconds + " Seconds" ;
}

export const handleFileUpload = (event, handleDocument, props,module) => {
  const { maxFileSize, formatProps, moduleName } = props;
  const input = event.target;
  if (input.files && input.files.length > 0) {
    const files = input.files;
    Object.keys(files).forEach(async (key, index) => {
      const file = files[key];
      const fileValid = isFileValid(file, acceptedFiles(formatProps.accept));
      const fileSize = getFileSize(file);
      const isSizeValid =  fileSize <= maxFileSize;
      alert(`Size of the excel is ${Math.round(fileSize )} KB \nEstimated Time to upload is : ${msToTime(Math.round(fileSize)*1000/8.5)} `);
      handleDocument(file);
    });
  }
};

export const prepareForm = params => {
  let formData = new FormData();
  for (var k in params) {
    formData.append(k, params[k]);
  }
  return formData;
};

export const uploadFile = async (endPoint, module, file) => {
  // Bad idea to fetch from local storage, change as feasible
  store.dispatch(toggleSpinner());
  const tenantId = getTenantId();

  const uploadInstance = axios.create({
    baseURL: window.location.origin,
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });

  const requestParams = {
    tenantId,
    module,
    file
  };
  const requestBody = prepareForm(requestParams);

  try {
    const response = await uploadInstance.post(endPoint, requestBody);
    const responseStatus = parseInt(response.status, 10);
    let fileStoreIds = [];
    store.dispatch(toggleSpinner());
    if (responseStatus === 200) {
      return response;
    }
    else
    {
      return "Service Error. Try again by logging in.";
    }
  } catch (error) {
    store.dispatch(toggleSpinner());
    throw new Error(error);
  }
};

export const postXlsxFile = async (state, dispatch, module, file) => {

  try{
    let tenantId = getTenantId();
    const resp = await uploadFile(
      `birth-death-services/upload/_${module}?tenantid=${tenantId}`,
      `${module}`,
      file
    );
    return resp;
  }
  catch(e){
    store.dispatch(
      toggleSnackbar(
        true,
        { labelName: "ERR_API_ERROR", labelKey: "ERR_API_ERROR" },
        "error"
      )
    );
  }
}

export const deleteAllRecords = async (state, dispatch, module) => {

  store.dispatch(toggleSpinner());

  let requestBody = {};
  let payload = null;

  let tenantId = getTenantId();

  const queryParams = [
    { key: "tenantId", value: tenantId }  
    ];

  let endPoint = (module == "birth")?"Birth":"Death";
  try
  {
    payload = await httpRequest(
      "post",
      'birth-death-services/common/delete'+endPoint+'Import',
      'delete'+endPoint+'Import',
      queryParams,
      requestBody
    );
    store.dispatch(toggleSpinner());
    store.dispatch(
      toggleSnackbar(
        true,
        { labelName: "", labelKey: payload },
        "success"
      )
    );
  }
  catch(e)
  {
    store.dispatch(toggleSpinner());
    store.dispatch(
      toggleSnackbar(
        true,
        { labelName: "ERR_API_ERROR", labelKey: "ERR_API_ERROR" },
        "error"
      )
    );
  }
  return payload;
}

export const searchForBirth = async (dispatch,queryParams,queryObject) => {
  try {
    dispatch(toggleSpinner());
    const response = await httpRequest(
      "post",
      "birth-death-services/birth/_search",
      "_search",
      queryParams,
      {}//{ searchCriteria: queryObject }
    );
    dispatch(toggleSpinner());
    return response;
  } catch (error) {
    dispatch(toggleSpinner());
    store.dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelCode: error.message },
        "error"
      )
    );
  }
};

export const searchForDeath = async (dispatch,queryParams,queryObject) => {
  try {
    dispatch(toggleSpinner());
    const response = await httpRequest(
      "post",
      "birth-death-services/death/_search",
      "_search",
      queryParams,
      {}//{ searchCriteria: queryObject }
    );
    dispatch(toggleSpinner());
    return response;
  } catch (error) {
    dispatch(toggleSpinner());
    store.dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelCode: error.message },
        "error"
      )
    );
  }
};

