import { httpRequest } from "../utils/api";
import { generateFireNOCSearchURL } from "../utils";
import envVariables from "../envVariables";

export const getFireNoc = async (requestInfo, applciationNumber, tenantId, header) => {
  try {
    
    let headers;
    if(envVariables.IS_ENVIRONMENT_CENTRAL_INSTANCE){
      header['tenantId']=header.tenantid;
      headers = header;
    }

    const uri = generateFireNOCSearchURL(tenantId, applciationNumber);
    let requestBody = { RequestInfo: requestInfo };
    var fireNocSearchResponse = await httpRequest({
      hostURL: envVariables.EGOV_FIRENOC_SERVICE_HOST,
      endPoint: uri,
      requestBody,
      headers
    });
  } catch (error) {
    throw "FireNOC Search Error";
  }
  return fireNocSearchResponse;
};
