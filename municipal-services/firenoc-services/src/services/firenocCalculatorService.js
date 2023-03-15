import envVariables from "../envVariables";
import { httpRequest } from "../utils/api";

export const calculate = async (firenoc, requestInfo) => {
  const tenantId = firenoc.tenantId;
  const CalulationCriteria = [];
  CalulationCriteria.push({ fireNOC: firenoc, tenantId });
  const requestBody = {
    RequestInfo: requestInfo,
    CalulationCriteria
  };
  var calculateResponse = await httpRequest({
    hostURL: envVariables.EGOV_FN_CALCULATOR_HOST,
    endPoint: `${envVariables.EGOV_FN_CALCULATOR_CONTEXT_PATH}${
      envVariables.EGOV_FN_CALCULATOR_CALCULATOR_ENPOINT
    }`,
    requestBody
  });

  return calculateResponse;
};
