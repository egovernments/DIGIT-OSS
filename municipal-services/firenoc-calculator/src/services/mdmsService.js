import { httpRequest } from "../utils/api";
import envVariables from "../envVariables";
import { constants } from "../config/constants";

export const mdmsData = async (requestInfo = {}, tenantId, header) => {
  var requestBody = {
    RequestInfo: requestInfo,
    MdmsCriteria: {
      tenantId,
      moduleDetails: [
        {
          moduleName: constants.MDMS_MODULENAME_FIRENOC,
          masterDetails: [
            { name: constants.MDMS_MASTERNAME_BUILDINGTYPE },
            { name: constants.MDMS_MASTERNAME_FIRENOCULBCONST },
            { name: constants.MDMS_MASTERNAME_FIRENOCSTATECONST },
            { name: constants.MDMS_MASTERNAME_UOMS }
          ]
        },
        {
          moduleName: constants.MDMS_MODULENAME_TENANT,
          masterDetails: [{ name: constants.MDMS_MASTERNAME_TENANTS }]
        },
        {
          moduleName: constants.MDMS_EGF_MASTER,
          masterDetails: [
            {
              name: constants.MDMS_FINANCIALYEAR,
              filter: constants.MDMS_FINANCIALYEAR_FILTER
            }
          ]
        }
      ]
    }
  };

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

  var mdmsResponse = await httpRequest({
    hostURL: `${envVariables.EGOV_MDMS_HOST}`,
    endPoint: `${envVariables.EGOV_MDMS_SEARCH_ENDPOINT}`,
    requestBody,
    headers
  });
  return mdmsResponse;
};

export const mdmsFiananceYear = async (requestInfo = {}, tenantId, header) => {
  var requestBody = {
    RequestInfo: requestInfo,
    MdmsCriteria: {
      tenantId,
      moduleDetails: [
        {
          moduleName: constants.MDMS_EGF_MASTER,
          masterDetails: [
            {
              name: constants.MDMS_FINANCIALYEAR,
              filter: constants.MDMS_FINANCIALYEAR_FILTER
            }
          ]
        }
      ]
    }
  };

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

  var mdmsResponse = await httpRequest({
    hostURL: `${envVariables.EGOV_MDMS_HOST}`,
    endPoint: `${envVariables.EGOV_MDMS_SEARCH_ENDPOINT}`,
    requestBody,
    headers
  });
  return mdmsResponse;
};