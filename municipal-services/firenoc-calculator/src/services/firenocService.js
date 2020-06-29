import { httpRequest } from "../utils/api";
import { generateFireNOCSearchURL } from "../utils";
import envVariables from "../envVariables";

export const getFireNoc = async (requestInfo, applciationNumber, tenantId) => {
  try {
    const uri = generateFireNOCSearchURL(tenantId, applciationNumber);
    let requestBody = { RequestInfo: requestInfo };
    var fireNocSearchResponse = await httpRequest({
      hostURL: envVariables.EGOV_FIRENOC_SERVICE_HOST,
      endPoint: uri,
      requestBody
    });
  } catch (error) {
    throw "FireNOC Search Error";
  }
  return fireNocSearchResponse;
};
