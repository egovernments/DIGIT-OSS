import { Router } from "express";
import producer from "../kafka/producer";
import envVariables from "../envVariables";
const asyncHandler = require("express-async-handler");
import mdmsData from "../utils/mdmsData";
import { addUUIDAndAuditDetails, updateStatus,  enrichAssignees} from "../utils/create";
import { getUpdatedTopic, getStateSpecificTopicName } from "../utils/index";
import { getApprovedList } from "../utils/update";

import {
  requestInfoToResponseInfo,
  createWorkFlow,
  getLocationDetails
} from "../utils";
import { calculate } from "../services/firenocCalculatorService";
// import cloneDeep from "lodash/cloneDeep";
import filter from "lodash/filter";
import { validateFireNOCModel } from "../utils/modelValidation";
import set from "lodash/set";
import get from "lodash/get";

export default ({ config }) => {
  let api = Router();
  api.post(
    "/_update",
    asyncHandler(async (request, res, next) => {
      let response = await updateApiResponse(request, true, next);
      if(response.Errors)
        res.status(400);
      res.json(response);
    })
  );
  return api;
};
export const updateApiResponse = async (request, isExternalCall, next = {}) => {
  //console.log("Update Body: "+JSON.stringify(body));
  var body = JSON.parse(JSON.stringify(request.body));
  var header = JSON.parse(JSON.stringify(request.headers));
  let payloads = [];
  let mdms = await mdmsData(body.RequestInfo, body.FireNOCs[0].tenantId, header);
  //model validator
  //location data
  let locationResponse = await getLocationDetails(
    body.RequestInfo,
    body.FireNOCs[0].tenantId,
    header
  );

  set(
    mdms,
    "MdmsRes.firenoc.boundary",
    get(locationResponse, "TenantBoundary.0.boundary")
  );

  let errors = await validateFireNOCModel(body, mdms);
  if (errors.length > 0) {
    return next({
      errorType: "custom",
      errorReponse: {
        ResponseInfo: requestInfoToResponseInfo(body.RequestInfo, true),
        Errors: errors
      }
    });
    return;
  }

  body = await addUUIDAndAuditDetails(body, "_update", header);
  let { FireNOCs = [], RequestInfo = {} } = body;
  let errorMap = [];

  //Check records for approved
  // let approvedList=await getApprovedList(cloneDeep(body));

  //Enrich assignee
  body.FireNOCs = await enrichAssignees(FireNOCs, RequestInfo, header);

  //applay workflow
  let workflowResponse = await createWorkFlow(body, header);



  for (var i = 0; i < FireNOCs.length; i++) {
    if(isExternalCall && FireNOCs[i].fireNOCDetails.action === 'PAY'){
      errorMap.push({"INVALID_ACTION":"PAY action cannot perform directly on application "+FireNOCs[i].fireNOCDetails.applicationNumber});
    }
  }

  if (errorMap.length > 0) {
    return next({
      errorType: "custom",
      errorReponse: {
        ResponseInfo: requestInfoToResponseInfo(RequestInfo, false),
        Errors: errorMap
      }
    });
    return;
  }

  //calculate call
  for (var i = 0; i < FireNOCs.length; i++) {
    let firenocResponse = await calculate(FireNOCs[i], RequestInfo, header);
  }

  body.FireNOCs = updateStatus(FireNOCs, workflowResponse);
  //console.log("Fire NoC body"+JSON.stringify(body.FireNOCs));
  let topic = envVariables.KAFKA_TOPICS_FIRENOC_UPDATE;
  let tenantId = body.FireNOCs[0].tenantId;

  var isCentralInstance  = envVariables.IS_ENVIRONMENT_CENTRAL_INSTANCE;
  if(typeof isCentralInstance =="string")
  isCentralInstance = (isCentralInstance.toLowerCase() == "true");

  if(isCentralInstance)
    topic = getStateSpecificTopicName(tenantId, topic);
    
  payloads.push({
    topic: topic,
    messages: JSON.stringify(body)
  });

  payloads.push({
    topic: envVariables.KAFKA_TOPICS_FIRENOC_UPDATE_SMS,
    messages: JSON.stringify(body)
  });

  //check approved list
  const approvedList = filter(body.FireNOCs, function(fireNoc) {
    return fireNoc.fireNOCNumber;
  });

  // console.log("list length",approvedList.length);
  if (approvedList.length > 0) {
    let topic = envVariables.KAFKA_TOPICS_FIRENOC_WORKFLOW;
    let tenantId = body.FireNOCs[0].tenantId;

    var isCentralInstance  = envVariables.IS_ENVIRONMENT_CENTRAL_INSTANCE;
    if(typeof isCentralInstance =="string")
      isCentralInstance = (isCentralInstance.toLowerCase() == "true");

    if(isCentralInstance)
      topic = getStateSpecificTopicName(tenantId, topic);

    payloads.push({
      topic: topic,
      messages: JSON.stringify({ RequestInfo, FireNOCs: approvedList })
    });

    payloads.push({
      topic: envVariables.KAFKA_TOPICS_FIRENOC_WORKFLOW_SMS,
      messages: JSON.stringify({ RequestInfo, FireNOCs: approvedList })
    });
  }
  // console.log(JSON.stringify(body));
  let response = {
    ResponseInfo: requestInfoToResponseInfo(body.RequestInfo, true),
    FireNOCs: body.FireNOCs
  };
  producer.send(payloads, function(err, data) {
    if (err) console.log(err);
  });

  return response;
};
