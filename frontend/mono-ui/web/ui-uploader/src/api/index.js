import axios from "axios";
import * as apiEndpoints from "../constants/ApiEndpoints";
import {
  prepareFormData,
  getRequestUrl,
  fetchFromLocalStorage
} from "../utils";
import * as prepareRequestBody from "./createRequestBody";

export const Api = () => {
  const instance = axios.create({
    baseURL: window.location.origin,
    headers: {
      "Content-Type": "application/json"
    }
  });

  const tenantId = fetchFromLocalStorage("tenant-id");

  const httpRequest = async (endPoint, requestBody, headers) => {
    let apiError = "Api Error";
    try {
      const response = await instance.post(endPoint, requestBody);
      const responseStatus = parseInt(response.status, 10);
      if (responseStatus === 200 || responseStatus === 201) {
        return response.data;
      } else {
        apiError =
          response.hasOwnProperty("Errors") && response.Errors.length
            ? response.Errors[0].message
            : apiError;
      }
    } catch (error) {
      apiError = error;
    }
    throw new Error(apiError);
  };

  const fetchUploadDefintions = async () => {
    const requestBody = prepareRequestBody.uploadDefinitionsRequest();
    const endPoint = apiEndpoints.UPLOAD_DEFINITIONS_ENDPOINT;

    try {
      const response = await httpRequest(endPoint, requestBody);
      return response.ModuleDefs;
    } catch (error) {
      throw new Error(error);
    }
  };

  // job search request
  const fetchUserJobs = async (
    codes = [],
    statuses = [],
    requesterNames = [],
    fileNames = [],
    startDate,
    endDate
  ) => {
    const requestBody = prepareRequestBody.jobSearchRequest(
      codes,
      statuses,
      requesterNames,
      fileNames,
      startDate,
      endDate
    );
    requestBody.RequestInfo.authToken = fetchFromLocalStorage("Employee.token");

    const endPoint = apiEndpoints.SEARCH_USER_JOBS_ENDPOINT;
    try {
      const response = await httpRequest(endPoint, requestBody);
      return response.uploadJobs;
    } catch (error) {
      throw new Error(error);
    }
  };

  // upload job request
  const createJob = async (
    requestFilePath,
    requestFileName,
    moduleName,
    defName
  ) => {
    const requestBody = prepareRequestBody.jobCreateRequest(
      requestFilePath,
      requestFileName,
      moduleName,
      defName
    );
    requestBody.RequestInfo.authToken = fetchFromLocalStorage("Employee.token");
    for (var i = 0; i < requestBody.UploadJobs.length; i++) {
      requestBody.UploadJobs[i].tenantId = tenantId;
    }
    console.log(JSON.parse(fetchFromLocalStorage("Employee.user-info")));
    requestBody.RequestInfo.userInfo = JSON.parse(
      fetchFromLocalStorage("Employee.user-info")
    );
    const endPoint = apiEndpoints.CREATE_JOB_ENDPOINT;

    try {
      const response = await httpRequest(endPoint, requestBody);
      const { uploadJobs } = response;
      const jobId = uploadJobs.length ? uploadJobs[0].code : null;
      return jobId;
    } catch (error) {
      throw new Error(error);
    }
  };

  const loginUser = async (username, password, userType) => {
    const grant_type = "password";
    const scope = "read";
    // const tenantId = "pb.amritsar";
    const requestParams = {
      tenantId,
      username,
      password,
      scope,
      grant_type,
      userType
    };
    const headers = {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: "Basic ZWdvdi11c2VyLWNsaWVudDo="
    };
    const endPoint = getRequestUrl(
      apiEndpoints.USER_LOGIN_ENDPOINT,
      requestParams
    );
    const response = await axios.post(endPoint, {}, { headers });
    return response.data;
  };

  // try to make a generic api call for this
  const uploadFile = async (module, file) => {
    const requestParams = { tenantId, module, file };
    const requestBody = prepareFormData(requestParams);
    const endPoint = getRequestUrl(apiEndpoints.FILE_UPLOAD_ENDPOINT, {
      tenantId
    });

    const response = await axios.post(endPoint, requestBody, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });

    const responseStatus = parseInt(response.status, 10);
    let fileStoreId = false;

    if (responseStatus === 201) {
      // this has to be sent
      const responseData = response.data;
      fileStoreId = responseData.files.length
        ? responseData.files[0].fileStoreId
        : false;
    }

    return fileStoreId;
  };

  return {
    loginUser,
    uploadFile,
    createJob,
    fetchUserJobs,
    fetchUploadDefintions
  };
};
