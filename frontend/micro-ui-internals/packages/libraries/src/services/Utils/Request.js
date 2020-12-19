import Axios from "axios";
//import { connectAdvanced } from "react-redux";
import { Storage } from "./Storage";

Axios.interceptors.response.use(
  (res) => res,
  (er) => {
    console.log("-==-==-=-=-=-=-=-=-=-=-=2222222222222222222", er.response.status);
    if (er.response.status == 403) window.location.href = "/";
    if (er.response && er.response.data.Errors && er.response.data.Errors.length) {
      for (const error of er.response.data.Errors) {
        if (error.message.indexOf(`"code":"InvalidAccessTokenException"`) != -1) {
          window.location.href = "/";
          break;
        }
      }
    }
  }
);

const requestInfo = () => ({
  apiId: "Rainmaker",
  authToken: Storage.get("User").token,
});

const userServiceData = () => ({ userInfo: Storage.get("User").info });

window.Digit = window.Digit || {};
window.Digit = { ...window.Digit, RequestCache: window.Digit.RequestCache || {} };
export const Request = async ({ method = "POST", url, data = {}, useCache = false, params = {}, auth, userService }) => {
  console.log("params:", params);
  console.log("url:", url);
  if (method.toUpperCase() === "POST") {
    data.RequestInfo = {
      apiId: "Rainmaker",
    };
    if (auth) {
      data.RequestInfo = { ...data.RequestInfo, ...requestInfo() };
    }
    if (userService) {
      data.RequestInfo = { ...data.RequestInfo, ...userServiceData() };
    }
  }

  let key = "";
  if (useCache) {
    key = `${method.toUpperCase()}.${url}.${btoa(JSON.stringify(params, null, 0))}.${btoa(JSON.stringify(data, null, 0))}`;
    const value = window.Digit.RequestCache[key];
    if (value) {
      return value;
    }
  } else {
    params._ = Date.now();
  }

  const res = await Axios({ method, url, data, params });
  if (useCache) {
    window.Digit.RequestCache[key] = res.data;
  }
  return res.data;
};

export const SortByName = (na, nb) => {
  if (na < nb) {
    return -1;
  }
  if (na > nb) {
    return 1;
  }
  return 0;
};

export const TransformArrayToObj = (traslationList) => {
  return traslationList.reduce(
    // eslint-disable-next-line
    (obj, item) => ((obj[item.code] = item.message), obj),
    {}
  );
  // return trasformedTraslation;
};

export const GetCitiesWithi18nKeys = (MdmsRes, moduleCode) => {
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

export const GetEgovLocations = (MdmsRes) => {
  return MdmsRes["egov-location"].TenantBoundary[0].boundary.children.map((obj) => ({
    name: obj.localname,
    i18nKey: obj.localname,
  }));
};

export const GetServiceDefWithLocalization = (MdmsRes) => {
  const serviceDef = MdmsRes["RAINMAKER-PGR"].ServiceDefs.map((def) =>
    def.active
      ? {
          name: def.serviceCode,
          i18nKey: def.menuPath !== "" ? "SERVICEDEFS." + def.serviceCode.toUpperCase() : "Others",
          ...def,
        }
      : null
  ).filter((o) => o != null);
  Storage.set("ServiceDefs", serviceDef); //TODO: move this to service, session storage key name is too big currently
  return serviceDef;
};
