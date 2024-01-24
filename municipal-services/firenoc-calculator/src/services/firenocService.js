import { httpRequest } from "../utils/api";
import { generateFireNOCSearchURL } from "../utils";
import envVariables from "../envVariables";

export const getFireNoc = async (requestInfo, applciationNumber, tenantId, header) => {
  try {
    
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
