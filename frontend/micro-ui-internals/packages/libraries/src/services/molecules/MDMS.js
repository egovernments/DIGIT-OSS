import Urls from "../atoms/urls";
import { Request, ServiceRequest } from "../atoms/Utils/Request";

const SortByName = (na, nb) => {
  if (na < nb) {
    return -1;
  }
  if (na > nb) {
    return 1;
  }
  return 0;
};

const GetCitiesWithi18nKeys = (MdmsRes, moduleCode) => {
  const cityList = (MdmsRes.tenant.citymodule && MdmsRes.tenant.citymodule.find((module) => module.code === moduleCode).tenants) || [];
  const citiesMap = cityList.map((city) => city.code);
  const cities = MdmsRes.tenant.tenants
    .filter((city) => citiesMap.includes(city.code))
    .map(({ code, name, logoId, emailId, address, contactNumber }) => ({
      code,
      name,
      logoId,
      emailId,
      address,
      contactNumber,
      i18nKey: "TENANT_TENANTS_" + code.replace(".", "_").toUpperCase(),
    }))
    .sort((cityA, cityB) => {
      const na = cityA.name.toLowerCase(),
        nb = cityB.name.toLowerCase();
      return SortByName(na, nb);
    });
  return cities;
};

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

const transformResponse = (type, MdmsRes, moduleCode) => {
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
  init: (stateCode) =>
    ServiceRequest({
      serviceName: "mdmsInit",
      url: Urls.MDMS,
      data: initRequestBody(stateCode),
      useCache: true,
      params: { tenantId: stateCode },
    }),
  call: (details, tenantId) =>
    ServiceRequest({
      serviceName: "mdmsCall",
      url: Urls.MDMS,
      data: getCriteria(details),
      useCache: true,
      params: { tenantId },
    }),
  getDataByCriteria: async (mdmsDetails, moduleCode) => {
    const { MdmsRes } = await MdmsService.call(mdmsDetails.details);
    return transformResponse(mdmsDetails.type, MdmsRes, moduleCode);
  },
  getServiceDefs: (tenantId, moduleCode) => {
    return MdmsService.getDataByCriteria(getModuleServiceDefsCriteria(tenantId, moduleCode), moduleCode);
  },
};
