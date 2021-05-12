import { Router } from "express";
import producer from "../kafka/producer";
import envVariables from "../envVariables";
const asyncHandler = require("express-async-handler");
import mdmsData from "../utils/mdmsData";
import { addUUIDAndAuditDetails, updateStatus,  enrichAssignees} from "../utils/create";
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
    asyncHandler(async ({ body }, res, next) => {
      let response = await updateApiResponse({ body }, true, next);
      if(response.Errors)
        res.status(400);
      res.json(response);
    })
  );
  return api;
};
export const updateApiResponse = async ({ body }, isExternalCall, next = {}) => {
  //console.log("Update Body: "+JSON.stringify(body));
  let payloads = [];
  let mdms = await mdmsData(body.RequestInfo, body.FireNOCs[0].tenantId);
  //model validator
  //location data
  let locationResponse = await getLocationDetails(
    body.RequestInfo,
    body.FireNOCs[0].tenantId
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

  body = await addUUIDAndAuditDetails(body);
  let { FireNOCs = [], RequestInfo = {} } = body;
  let errorMap = [];

  //Check records for approved
  // let approvedList=await getApprovedList(cloneDeep(body));

  //Enrich assignee
  body.FireNOCs = await enrichAssignees(FireNOCs, RequestInfo);

  //applay workflow
  let workflowResponse = await createWorkFlow(body);



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
    let firenocResponse = await calculate(FireNOCs[i], RequestInfo);
  }

  body.FireNOCs = updateStatus(FireNOCs, workflowResponse);
  //console.log("Fire NoC body"+JSON.stringify(body.FireNOCs));

  payloads.push({
    topic: envVariables.KAFKA_TOPICS_FIRENOC_UPDATE,
    messages: JSON.stringify(body)
  });

  //check approved list
  const approvedList = filter(body.FireNOCs, function(fireNoc) {
    return fireNoc.fireNOCNumber;
  });

  // console.log("list length",approvedList.length);
  if (approvedList.length > 0) {
    payloads.push({
      topic: envVariables.KAFKA_TOPICS_FIRENOC_WORKFLOW,
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
