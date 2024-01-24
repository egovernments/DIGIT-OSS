import producer from "../kafka/producer";
import { requestInfoToResponseInfo, upadteForAuditDetails } from "../utils";
import envVariables from "../envVariables";
import { validateBillingSlabReq } from "../utils/modelValidation";
import { mdmsData } from "../services/mdmsService";
import get from "lodash/get";
import some from "lodash/some";
import { constants } from "../config/constants";

const update = async (req, res, next) => {
  console.log("update");
  let errors = validateBillingSlabReq(req.body);
  var header = JSON.parse(JSON.stringify(req.headers));

  if (errors.length <= 0) errors = await updateValidate(req.body, errors, header);

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

  let updateResponse = {};
  updateResponse.ResponseInfo = requestInfoToResponseInfo(
    req.body.RequestInfo,
    true
  );
  updateResponse.BillingSlabs = enrichUpdateData(req.body);

  const payloads = [
    {
      topic: envVariables.KAFKA_TOPICS_UPDATE_SERVICE,
      messages: JSON.stringify(updateResponse)
    }
  ];
  producer.send(payloads, function(err, data) {});
  res.send(updateResponse);
};

const enrichUpdateData = reqBody => {
  reqBody.BillingSlabs.map(billingSlab => {
    upadteForAuditDetails(billingSlab.auditDetails, reqBody.RequestInfo, true);
  });
  return reqBody.BillingSlabs;
};

const updateValidate = async (body, errors, header) => {
  let BillingSlabs = body.BillingSlabs;
  for (let i = 0; i < BillingSlabs.length; i++) {
    let billingSlab = BillingSlabs[i];
    let mdms = await mdmsData(body.RequestInfo, billingSlab.tenantId, header);
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

export default update;