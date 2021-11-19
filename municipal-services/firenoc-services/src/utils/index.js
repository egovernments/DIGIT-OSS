import uniqBy from "lodash/uniqBy";
import uniq from "lodash/uniq";
import get from "lodash/get";
import findIndex from "lodash/findIndex";
import isEmpty from "lodash/isEmpty";
import { httpRequest } from "./api";
import envVariables from "../envVariables";

export const uuidv1 = () => {
  return require("uuid/v4")();
};

export const requestInfoToResponseInfo = (requestinfo, success) => {
  let ResponseInfo = {
    apiId: "",
    ver: "",
    ts: 0,
    resMsgId: "",
    msgId: "",
    status: ""
  };
  ResponseInfo.apiId =
    requestinfo && requestinfo.apiId ? requestinfo.apiId : "";
  ResponseInfo.ver = requestinfo && requestinfo.ver ? requestinfo.ver : "";
  ResponseInfo.ts = requestinfo && requestinfo.ts ? requestinfo.ts : null;
  ResponseInfo.resMsgId = "uief87324";
  ResponseInfo.msgId =
    requestinfo && requestinfo.msgId ? requestinfo.msgId : "";
  ResponseInfo.status = success ? "successful" : "failed";

  return ResponseInfo;
};

export const addIDGenId = async (requestInfo, idRequests) => {
  let requestBody = {
    RequestInfo: requestInfo,
    idRequests
  };
  // console.log(JSON.stringify(requestBody));
  let idGenResponse = await httpRequest({
    hostURL: envVariables.EGOV_IDGEN_HOST,
    endPoint: `${envVariables.EGOV_IDGEN_CONTEXT_PATH}${
      envVariables.EGOV_IDGEN_GENERATE_ENPOINT
    }`,
    requestBody
  });
  // console.log("idgenresponse",idGenResponse);
  return get(idGenResponse, "idResponses[0].id");
};

export const getLocationDetails = async (requestInfo, tenantId) => {
  let requestBody = {
    RequestInfo: requestInfo
  };
  // console.log(JSON.stringify(requestBody));
  let locationResponse = await httpRequest({
    hostURL: envVariables.EGOV_LOCATION_HOST,
    endPoint: `${envVariables.EGOV_LOCATION_CONTEXT_PATH}${
      envVariables.EGOV_LOCATION_SEARCH_ENDPOINT
    }?hierarchyTypeCode=${
      envVariables.EGOV_LOCATION_HIERARCHY_TYPE_CODE
    }&boundaryType=${
      envVariables.EGOV_LOCATION_BOUNDARY_TYPE_CODE
    }&tenantId=${tenantId}`,
    requestBody
  });
  // console.log("idgenresponse",locationResponse);
  return locationResponse;
};

export const createWorkFlow = async body => {
  //wfDocuments and comment should rework after that
  let processInstances = body.FireNOCs.map(fireNOC => {
    return {
      tenantId: fireNOC.tenantId,
      businessService: envVariables.BUSINESS_SERVICE,
      businessId: fireNOC.fireNOCDetails.applicationNumber,
      action: fireNOC.fireNOCDetails.action,
      comment: get(fireNOC.fireNOCDetails.additionalDetail, "comment", null),
      assignes: (fireNOC.fireNOCDetails.additionalDetail.assignee && fireNOC.fireNOCDetails.additionalDetail.assignee != null
                 && fireNOC.fireNOCDetails.additionalDetail.assignee.length>0)
      ? fireNOC.fireNOCDetails.additionalDetail.assignee.map(ids =>{ return {
        uuid:ids
      };})
      : null,
      documents: get(fireNOC.fireNOCDetails.additionalDetail, "wfDocuments", null),
      sla: 0,
      previousStatus: null,
      moduleName: envVariables.BUSINESS_SERVICE
    };
  });
  
  var systemPaymentRole = {
    code: "SYSTEM_PAYMENT",
    tenantId: body.FireNOCs[0].tenantId
  };
  body.RequestInfo.userInfo.roles.push(systemPaymentRole);
  
  let requestBody = {
    RequestInfo: body.RequestInfo,
    ProcessInstances: processInstances
  };
  //console.log("Workflow requestBody", JSON.stringify(requestBody));
  let workflowResponse = await httpRequest({
    hostURL: envVariables.EGOV_WORKFLOW_HOST,
    endPoint: envVariables.EGOV_WORKFLOW_TRANSITION_ENDPOINT,
    requestBody
  });
  // console.log("workflowResponse", JSON.stringify(workflowResponse));
  return workflowResponse;
};

export const addQueryArg = (url, queries = []) => {
  if (url && url.includes("?")) {
    const urlParts = url.split("?");
    const path = urlParts[0];
    let queryParts = urlParts.length > 1 ? urlParts[1].split("&") : [];
    queries.forEach(query => {
      const key = query.key;
      const value = query.value;
      const newQuery = `${key}=${value}`;
      queryParts.push(newQuery);
    });
    const newUrl = path + "?" + queryParts.join("&");
    return newUrl;
  } else {
    return url;
  }
};
