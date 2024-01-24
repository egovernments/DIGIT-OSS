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

export const addIDGenId = async (requestInfo, idRequests, header) => {
  let requestBody = {
    RequestInfo: requestInfo,
    idRequests
  };

  let headers;
  var isCentralInstance  = envVariables.IS_ENVIRONMENT_CENTRAL_INSTANCE;
  if(typeof isCentralInstance =="string")
    isCentralInstance = (isCentralInstance.toLowerCase() == "true");

  if(isCentralInstance){
    header['tenantId']=header.tenantid;
  }
  else
    header['tenantId'] = idRequests[0].tenantId;

  headers = header;
  
  // console.log(JSON.stringify(requestBody));
  let idGenResponse = await httpRequest({
    hostURL: envVariables.EGOV_IDGEN_HOST,
    endPoint: `${envVariables.EGOV_IDGEN_CONTEXT_PATH}${
      envVariables.EGOV_IDGEN_GENERATE_ENPOINT
    }`,
    requestBody,
    headers
  });
  // console.log("idgenresponse",idGenResponse);
  return get(idGenResponse, "idResponses[0].id");
};

export const getLocationDetails = async (requestInfo, tenantId, header) => {
  let requestBody = {
    RequestInfo: requestInfo
  };

  let headers;
  var isCentralInstance  = envVariables.IS_ENVIRONMENT_CENTRAL_INSTANCE;
  if(typeof isCentralInstance =="string")
    isCentralInstance = (isCentralInstance.toLowerCase() == "true");

  if(isCentralInstance){
    header['tenantId']=header.tenantid;
  }
  else
    header['tenantId'] = tenantId;

  headers = header;

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
    requestBody,
    headers
  });
  // console.log("idgenresponse",locationResponse);
  return locationResponse;
};

export const createWorkFlow = async (body, header) => {
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

  let headers;
  var isCentralInstance  = envVariables.IS_ENVIRONMENT_CENTRAL_INSTANCE;
  if(typeof isCentralInstance =="string")
    isCentralInstance = (isCentralInstance.toLowerCase() == "true");

  if(isCentralInstance){
    header['tenantId']=header.tenantid;
  }
  else
    header['tenantId'] = body.FireNOCs[0].tenantId;

  headers = header;
  //console.log("Workflow requestBody", JSON.stringify(requestBody));
  let workflowResponse = await httpRequest({
    hostURL: envVariables.EGOV_WORKFLOW_HOST,
    endPoint: envVariables.EGOV_WORKFLOW_TRANSITION_ENDPOINT,
    requestBody,
    headers
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

export const getUpdatedTopic = (tenantId, topic) => {
  let tenants = tenantId.split('.');
  if(tenants.length > 1)
    topic = tenants[1] + "-" + topic;
  console.log("The Kafka topic for the tenantId : " + tenantId + " is : " + topic);
  return topic;
};

export const replaceSchemaPlaceholder = (query, tenantId) => {
  let finalQuery = null;
  var isCentralInstance  = envVariables.IS_ENVIRONMENT_CENTRAL_INSTANCE;
  if(typeof isCentralInstance =="string")
  isCentralInstance = (isCentralInstance.toLowerCase() == "true");

	if (tenantId.includes('.') && isCentralInstance) {
		let schemaName = tenantId.split('.')[1];
		finalQuery = query.replace(/{schema}/g, schemaName);
	} else {
			finalQuery = query.replace(/{schema}./g, "");
	}
	return finalQuery;
};

// central-instance configs
let SCHEMA_REPLACE_STRING = "{schema}";
/*
 * Represents the length of the tenantId array when it's split by "."
 * 
 * if the array length is equal or lesser than, then the tennatId belong to state level
 * 
 * else it's tenant level
 */
let stateLevelTenantIdLength = 1;
/*
 * Boolean field informing whether the deployed server is a multi-state/central-instance 
 * 
 */
let isEnvironmentCentralInstance = true;
/*
 * Index in which to find the schema name in a tenantId split by "."
 */
let stateSchemaIndexPositionInTenantId = 1;
/**
* Method to fetch the state name from the tenantId
* 
* @param query
* @param tenantId
* @return
*/
export const replaceSchemaPlaceholderCentralInstance = (query,  tenantId) => {
console.log("query : "+query);
console.log(" tenantId :" + tenantId);
let finalQuery = null;
var isCentralInstance  = envVariables.IS_ENVIRONMENT_CENTRAL_INSTANCE;
if(typeof isCentralInstance =="string")
  isCentralInstance = (isCentralInstance.toLowerCase() == "true");
console.log(" IsCentralInstance :" + isCentralInstance);
if (tenantId.includes(".") && isCentralInstance) {
  if (stateSchemaIndexPositionInTenantId >= tenantId.length) {
    throw new InvalidTenantIdException(
        "The tenantId length is smaller than the defined schema index in tenantId for central instance");
  }
  let schemaName = tenantId.split(".")[stateSchemaIndexPositionInTenantId];
  console.log(" schemaName :" + schemaName);
  finalQuery = 	query.replace(/{schema}/g, schemaName);
} else {
  finalQuery = query.replace(/{schema}./g, "");
}
return finalQuery;
}

/**
* Method to determine if the given tenantId belong to tenant or state level in
* the current environment
* 
* @param tenantId
* @return
*/
export const isTenantIdStateLevel = (tenantId) => {
  var isCentralInstance  = envVariables.IS_ENVIRONMENT_CENTRAL_INSTANCE;
  if(typeof isCentralInstance =="string")
    isCentralInstance = (isCentralInstance.toLowerCase() == "true");
  if (isCentralInstance) {
    let tenantLevel = tenantId.split(".").length;
  return tenantLevel <= stateLevelTenantIdLength;
} else {
  /*
   * if the instance is not multi-state/central-instance then tenant is always
   * two level
   * 
   * if tenantId contains "." then it is tenant level
   */
  return !tenantId.contains(".");
}
}

/**
* For central instance if the tenantId size is lesser than state level
* length the same will be returned without splitting
* 
* if the tenant-id is longer than the given stateTenantlength then the length of tenant-id
* till state-level index will be returned 
* (for example if statetenantlength is 1 and tenant-id is 'in.statea.tenantx'. the returned tenant-id will be in.statea)
* 
* @param tenantId
* @return
*/
export const getStateLevelTenant =(tenantId) => {

const tenantArray = tenantId.split(".");
let stateTenant = tenantArray[0];
var isCentralInstance  = envVariables.IS_ENVIRONMENT_CENTRAL_INSTANCE;
if(typeof isCentralInstance =="string")
  isCentralInstance = (isCentralInstance.toLowerCase() == "true");
if (isCentralInstance) {
  if (stateLevelTenantIdLength < tenantArray.length) {
    for (let i = 1; i < stateLevelTenantIdLength; i++)
      stateTenant = stateTenant.concat(".").concat(tenantArray[i]);
  } else {
    stateTenant = tenantId;
  }
}
return stateTenant;
};

/**
* method to prefix the state specific tag to the topic names
* 
* @param tenantId
* @param topic
* @return
*/
export  const getStateSpecificTopicName = (tenantId,  topic) => {

let updatedTopic = topic;
var isCentralInstance  = envVariables.IS_ENVIRONMENT_CENTRAL_INSTANCE;
if(typeof isCentralInstance == "string")
  isCentralInstance = (isCentralInstance.toLowerCase() == "true");
if (isCentralInstance) {
  const tenants = tenantId.split(".");
  if (tenants.length > 1)
    updatedTopic = tenants[stateSchemaIndexPositionInTenantId] + ("-") + (topic);

}

console.log("isCentralInstance - "+isCentralInstance);
console.log("The Kafka topic for the tenantId : " + tenantId + " is : " + updatedTopic);
return updatedTopic;
};