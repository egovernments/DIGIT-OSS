import { Router } from "express";
import producer from "../kafka/producer";
import {
  requestInfoToResponseInfo,
  createWorkFlow,
  getLocationDetails
} from "../utils";
import envVariables from "../envVariables";
import mdmsData from "../utils/mdmsData";
import { addUUIDAndAuditDetails, updateStatus } from "../utils/create";
import { calculate } from "../services/firenocCalculatorService";
import { validateFireNOCModel } from "../utils/modelValidation";
import { getUpdatedTopic, getStateSpecificTopicName} from "../utils/index";
import set from "lodash/set";
import get from "lodash/get";
import { sendFireNOCSMSRequest } from "../utils/notificationUtil";

const asyncHandler = require("express-async-handler");

export default ({ config }) => {
  let api = Router();
  api.post(
    "/_create",
    asyncHandler(async (request, res, next) => {
      let response = await createApiResponse(request, res, next);
      if(response.Errors)
        res.status(400);
      res.json(response);
    })
  );
  return api;
};
export const createApiResponse = async (request, res, next) => {
  var body = JSON.parse(JSON.stringify(request.body));
  var header = JSON.parse(JSON.stringify(request.headers));
  let payloads = [];
  //getting mdms data
  let mdms = await mdmsData(body.RequestInfo, body.FireNOCs[0].tenantId, header);

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
  // console.log(JSON.stringify(locationResponse));
  //model validator
  let errors = validateFireNOCModel(body, mdms);
  if (errors.length > 0) {
    next({
      errorType: "custom",
      errorReponse: {
        ResponseInfo: requestInfoToResponseInfo(body.RequestInfo, true),
        Errors: errors
      }
    });
    return;
  }

  // console.log(JSON.stringify(mdms));
  body = await addUUIDAndAuditDetails(body, "_create", header);
  //console.log("Created Body:  "+JSON.stringify(body));
  let workflowResponse = await createWorkFlow(body, header);
  // console.log(JSON.stringify(workflowResponse));

  //need to implement notification
  //calculate call
  let { FireNOCs, RequestInfo } = body;
  for (var i = 0; i < FireNOCs.length; i++) {
    let firenocResponse = await calculate(FireNOCs[i], RequestInfo, header);
  }
  body.FireNOCs = updateStatus(FireNOCs, workflowResponse);
  
  let topic = envVariables.KAFKA_TOPICS_FIRENOC_CREATE;
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
  
  sendFireNOCSMSRequest(body.FireNOCs, RequestInfo);


  let response = {
    ResponseInfo: requestInfoToResponseInfo(body.RequestInfo, true),
    FireNOCs: body.FireNOCs
  };

  producer.send(payloads, function(err, data) {
    if (err) console.log(err);
  });
  return response;
};
