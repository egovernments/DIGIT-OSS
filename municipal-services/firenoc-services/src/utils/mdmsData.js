import { httpRequest } from "./api";
import envVariables from "../envVariables";

export default async (requestInfo = {},tenantId, header) => {
  let headers;
  var isCentralInstance  = envVariables.IS_ENVIRONMENT_CENTRAL_INSTANCE;
  if(typeof isCentralInstance =="string")
    isCentralInstance = (isCentralInstance.toLowerCase() == "true");

  if(isCentralInstance){
    header['tenantId']=header.tenantid;
  }
  else
    header['tenantId'] = tenantId;

  headers = header;
 
  var requestBody = {
    RequestInfo: requestInfo,
    MdmsCriteria: {
      tenantId,
      moduleDetails: [
        {
          moduleName: "common-masters",
          masterDetails: [{ name: "OwnerType" }, { name: "OwnerShipCategory" }]
        },
        {
          moduleName: "firenoc",
          masterDetails: [
            { name: "BuildingType" },
            { name: "Documents" },
            { name: "FireStations" },
            { name: "UOMs" }
          ]
        },
        {
          moduleName: "egf-master",
          masterDetails: [{ name: "FinancialYear" }]
        },
        { moduleName: "tenant", masterDetails: [{ name: "tenants" }] }
      ]
    }
  };
  var mdmsResponse = await httpRequest({
    hostURL: envVariables.EGOV_MDMS_HOST,
    endPoint: `${envVariables.EGOV_MDMS_CONTEXT_PATH}${
      envVariables.EGOV_MDMS_SEARCH_ENPOINT
    }`,
    requestBody,
    headers
  });
  return mdmsResponse;
};
