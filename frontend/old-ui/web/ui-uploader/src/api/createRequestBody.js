import { fetchFromLocalStorage } from "../utils";

const authToken = fetchFromLocalStorage("Employee.token");
const tenantId = fetchFromLocalStorage("Employee.tenant-id");
const userInfo = JSON.parse(fetchFromLocalStorage("Employee.user-info"));

export const requestInfo = () => {
  const RequestInfo = {
    apiId: "emp",
    ver: "1.0",
    ts: "1234",
    action: "create",
    did: "1",
    key: "abcdkey",
    msgId: "20170310130900",
    requesterId: "rajesh",
    userInfo,
    authToken
  };
  return RequestInfo;
};

export const jobCreateRequest = (
  requestFilePath,
  requestFileName,
  moduleName,
  defName
) => {
  const RequestInfo = requestInfo();
  const UploadJobs = [
    {
      tenantId,
      moduleName,
      defName,
      requestFilePath,
      requestFileName,
      status: "new"
    }
  ];

  return { UploadJobs, RequestInfo };
};

// convert the date to epoch here
export const jobSearchRequest = (
  codes = [],
  statuses = [],
  requesterNames = [],
  requestFileNames = [],
  startDate,
  endDate
) => {
  const RequestInfo = requestInfo();
  const JobSearchRequest = {
    RequestInfo,
    tenantId,
    codes,
    statuses,
    requesterNames,
    requestFileNames,
    startDate: startDate ? new Date(startDate).getTime() : startDate,
    endDate: endDate ? new Date(endDate).getTime() : endDate
  };

  return JobSearchRequest;
};

export const uploadDefinitionsRequest = () => {
  const RequestInfo = requestInfo();
  return { RequestInfo };
};
