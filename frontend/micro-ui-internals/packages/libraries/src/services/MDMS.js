import Urls from "./urls";
// import { GetCitiesWithi18nKeys } from "./utils";
import { Request, GetCitiesWithi18nKeys } from "./Utils/Request";

const initRequestBody = (tenantId) => ({
  MdmsCriteria: {
    tenantId,
    moduleDetails: [
      {
        moduleName: "common-masters",
        masterDetails: [{ name: "Department" }, { name: "Designation" }, { name: "StateInfo" }],
      },
      {
        moduleName: "tenant",
        masterDetails: [{ name: "tenants" }, { name: "citymodule" }],
      },
    ],
  },
});

const getCriteria = ({ tenantId, moduleDetails }) => {
  return {
    MdmsCriteria: {
      tenantId,
      moduleDetails,
    },
  };
};

const GetEgovLocations = (MdmsRes) => {
  return MdmsRes["egov-location"].TenantBoundary[0].boundary.children.map((obj) => ({
    name: obj.localname,
    i18nKey: obj.localname,
  }));
};

const GetServiceDefs = (MdmsRes) => MdmsRes["RAINMAKER-PGR"].ServiceDefs.filter((def) => def.active);

const transformResponse = (type, MdmsRes, moduleCode = "PGR") => {
  switch (type) {
    case "citymodule":
      return GetCitiesWithi18nKeys(MdmsRes, moduleCode);
    case "egovLocation":
      return GetEgovLocations(MdmsRes);
    case "serviceDefs":
      return GetServiceDefs(MdmsRes);
    default:
      return MdmsRes;
  }
};

export const MdmsService = {
  init: (stateCode = "pb") =>
    Request({ url: Urls.MDMS, data: initRequestBody(stateCode), useCache: true, method: "POST", params: { tenantId: stateCode } }),
  call: (details, stateCode = "pb") =>
    Request({ url: Urls.MDMS, data: getCriteria(details), useCache: true, method: "POST", params: { tenantId: stateCode } }),
  getDataByCriteria: async (mdmsDetails, moduleCode = "PGR") => {
    const { MdmsRes } = await MdmsService.call(mdmsDetails.details);
    return transformResponse(mdmsDetails.type, MdmsRes, moduleCode);
  },
};
