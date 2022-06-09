import producer from "../kafka/producer";
import { requestInfoToResponseInfo, upadteForAuditDetails } from "../utils";
import uuid4 from "uuid/v4";
import envVariables from "../envVariables";
import { validateBillingSlabReq } from "../utils/modelValidation";
import { mdmsData } from "../services/mdmsService";
import get from "lodash/get";
import some from "lodash/some";
import { constants } from "../config/constants";

const create = async (req, res, next) => {
  console.log("create");

  let errors = [];
  errors = validateBillingSlabReq(req.body);
  if (errors.length <= 0) errors = await createValidate(req.body, errors);

  if (errors.length > 0) {
    next({
      errorType: "custom",
      errorReponse: {
        ResponseInfo: requestInfoToResponseInfo(req.body.RequestInfo, false),
        Errors: errors
      }
    });
    return;
  }

  let createResponse = {};
  createResponse.ResponseInfo = requestInfoToResponseInfo(
    req.body.RequestInfo,
    true
  );
  createResponse.BillingSlabs = enrichCreateData(req.body);

  const payloads = [
    {
      topic: envVariables.KAFKA_TOPICS_SAVE_SERVICE,
      messages: JSON.stringify(createResponse)
    }
  ];

  producer.send(payloads, function(err, data) {
    if (err) console.log("err", err);
  });
  res.send(createResponse);
};

const enrichCreateData = reqBody => {
  reqBody.BillingSlabs.map(billingSlab => {
    billingSlab.id = uuid4();
    billingSlab.auditDetails = {};
    upadteForAuditDetails(billingSlab.auditDetails, reqBody.RequestInfo);
  });
  return reqBody.BillingSlabs;
};

const createValidate = async (body, errors) => {
  let BillingSlabs = body.BillingSlabs;
  for (let i = 0; i < BillingSlabs.length; i++) {
    let billingSlab = BillingSlabs[i];
    let mdms = await mdmsData(body.RequestInfo, billingSlab.tenantId);
    let Buildingtypes = get(
      mdms,
      `MdmsRes.${constants.MDMS_MODULENAME_FIRENOC}.${
        constants.MDMS_MASTERNAME_BUILDINGTYPE
      }`,
      []
    );
    let Uoms = get(
      mdms,
      `MdmsRes.${constants.MDMS_MODULENAME_FIRENOC}.${
        constants.MDMS_MASTERNAME_UOMS
      }`,
      []
    );
    let teantnts = get(
      mdms,
      `MdmsRes.${constants.MDMS_MODULENAME_TENANT}.${
        constants.MDMS_MASTERNAME_TENANTS
      }`,
      []
    );
    if (
      billingSlab.toUom &&
      billingSlab.fromUom &&
      billingSlab.toUom < billingSlab.fromUom
    )
      errors = [
        ...errors,
        { message: "From UOM should be less than to UOM value" }
      ];
    if (
      (billingSlab.toUom || billingSlab.fromUom) &&
      billingSlab.calculationType === "FLAT"
    )
      errors = [
        ...errors,
        { message: "FLAT calculation type should not have toUOM and fromUOM" }
      ];
    if (
      (!billingSlab.toUom || !billingSlab.fromUom) &&
      billingSlab.calculationType !== "FLAT"
    )
      errors = [
        ...errors,
        {
          message:
            "SINGLESLAB and MULTIPLESLAB calculation type should have toUOM and fromUOM"
        }
      ];
    if (!some(Buildingtypes, ["code", billingSlab.buildingUsageType])) {
      errors = [
        ...errors,
        {
          message: "Building usage type is invallid!"
        }
      ];
    }
    if (!some(Uoms, ["code", billingSlab.uom])) {
      errors = [
        ...errors,
        {
          message: "Uom  is invalid!"
        }
      ];
    }
    if (!some(teantnts, ["code", billingSlab.tenantId])) {
      errors = [
        ...errors,
        {
          message: "tenantId  is invalid!"
        }
      ];
    }
  }

  return errors;
};

export default create;