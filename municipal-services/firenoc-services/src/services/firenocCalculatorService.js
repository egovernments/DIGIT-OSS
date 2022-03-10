import envVariables from "../envVariables";
import { httpRequest } from "../utils/api";

export const calculate = async (firenoc, requestInfo, header) => {
  const tenantId = firenoc.tenantId;
  const CalulationCriteria = [];
  CalulationCriteria.push({ fireNOC: firenoc, tenantId });

  let headers;
  var isCentralInstance  = envVariables.IS_ENVIRONMENT_CENTRAL_INSTANCE;
  if(typeof isCentralInstance =="string")
  isCentralInstance = (isCentralInstance.toLowerCase() == "true");

  if(isCentralInstance){
    header['tenantId']=header.tenantid;
  }
  else
    header['tenantId']=tenantId;

  headers = header;

  const requestBody = {
    RequestInfo: requestInfo,
    CalulationCriteria
  };
  var calculateResponse = await httpRequest({
    hostURL: envVariables.EGOV_FN_CALCULATOR_HOST,
    endPoint: `${envVariables.EGOV_FN_CALCULATOR_CONTEXT_PATH}${
      envVariables.EGOV_FN_CALCULATOR_CALCULATOR_ENPOINT
    }`,
    requestBody,
    headers
  });

  return calculateResponse;
};
