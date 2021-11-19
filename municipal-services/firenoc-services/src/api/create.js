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
import set from "lodash/set";
import get from "lodash/get";
const asyncHandler = require("express-async-handler");

export default ({ config }) => {
  let api = Router();
  api.post(
    "/_create",
    asyncHandler(async ({ body }, res, next) => {
      let response = await createApiResponse({ body }, res, next);
      if(response.Errors)
        res.status(400);
      res.json(response);
    })
  );
  return api;
};
export const createApiResponse = async ({ body }, res, next) => {
  let payloads = [];
  //getting mdms data
  let mdms = await mdmsData(body.RequestInfo, body.FireNOCs[0].tenantId);

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
  body = await addUUIDAndAuditDetails(body, "_create");
  //console.log("Created Body:  "+JSON.stringify(body));
  let workflowResponse = await createWorkFlow(body);
  // console.log(JSON.stringify(workflowResponse));

  //need to implement notification
  //calculate call
  let { FireNOCs, RequestInfo } = body;
  for (var i = 0; i < FireNOCs.length; i++) {
    let firenocResponse = await calculate(FireNOCs[i], RequestInfo);
  }
  body.FireNOCs = updateStatus(FireNOCs, workflowResponse);
  payloads.push({
    topic: envVariables.KAFKA_TOPICS_FIRENOC_CREATE,
    messages: JSON.stringify(body)
  });
  let response = {
    ResponseInfo: requestInfoToResponseInfo(body.RequestInfo, true),
    FireNOCs: body.FireNOCs
  };

  producer.send(payloads, function(err, data) {
    if (err) console.log(err);
  });
  return response;
};
