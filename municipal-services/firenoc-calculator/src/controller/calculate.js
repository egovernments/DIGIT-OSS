import { requestInfoToResponseInfo, upadteForAuditDetails } from "../utils";
import { calculateService } from "../services/calculateService";
import { validateCalculationReq } from "../utils/modelValidation";
import { constants } from "../config/constants";
import { mdmsData } from "../services/mdmsService";
import get from "lodash/get";
import some from "lodash/some";

const calculalte = async (req, res, pool, next) => {
  console.log("calculalte");
  let errors = validateCalculationReq(req.body);
  var header = JSON.parse(JSON.stringify(req.headers));

  if (errors.length <= 0) errors = await calculateValidate(req.body, errors, header);

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

  let calculalteResponse = {};
  calculalteResponse = await calculateService(req, pool, next);
  res.send(calculalteResponse);
};

const calculateValidate = async (body, errors, header) => {
  let CalulationCriteria = body.CalulationCriteria;
  let mdms = await mdmsData(body.RequestInfo, CalulationCriteria[0].tenantId, header);
  let teantnts = get(
    mdms,
    `MdmsRes.${constants.MDMS_MODULENAME_TENANT}.${
      constants.MDMS_MASTERNAME_TENANTS
    }`,
    []
  );

  for (let i = 0; i < CalulationCriteria; i++) {
    let calulationCriteria = CalulationCriteria[i];
    if (!some(teantnts, ["code", calulationCriteria.tenantId])) {
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

export default calculalte;