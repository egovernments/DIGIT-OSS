import { Request, GetCitiesWithi18nKeys } from "../services/Utils/Request";
import Urls from "../services/urls";
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

const getModuleServiceDefsCriteria = (tenantId, moduleCode) => ({
  type: "serviceDefs",
  details: {
    tenantId: tenantId,
    moduleDetails: [
      {
        moduleName: `RAINMAKER-${moduleCode}`,
        masterDetails: [
          {
            name: "ServiceDefs",
          },
        ],
      },
    ],
  },
});

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

class MdmsService {
  constructor() {
    this.init = (stateCode = "pb") =>
      Request({ url: Urls.MDMS, data: initRequestBody(stateCode), useCache: true, method: "POST", params: { tenantId: stateCode } });
    this.call = (details, stateCode = "pb") =>
      Request({ url: Urls.MDMS, data: getCriteria(details), useCache: true, method: "POST", params: { tenantId: stateCode } });
    this.getDataByCriteria = async (mdmsDetails, moduleCode = "PGR") => {
      const { MdmsRes } = await this.call(mdmsDetails.details);
      return transformResponse(mdmsDetails.type, MdmsRes, moduleCode);
    };
    this.getServiceDefs = (tenantId, moduleCode = "PGR") => {
      return this.getDataByCriteria(getModuleServiceDefsCriteria(tenantId, moduleCode), moduleCode);
    };
  }
}

export const mdmsServiceObj = new MdmsService();
