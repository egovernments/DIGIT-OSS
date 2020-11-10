import Axios from "axios";
//import { connectAdvanced } from "react-redux";
import { Storage } from "./Storage";

const citAuth = "c54c09cd-56c5-4193-a59d-76c3867500c8";

Storage.set("citizen.token", citAuth);
window.sessionStorage.setItem("citizen.token", citAuth);

Axios.interceptors.request.use((req) => {
  document.body.classList.add("loader");
  return req;
});

Axios.interceptors.response.use(
  (res) => {
    document.body.classList.remove("loader");
    return res;
  },
  (err) => {
    document.body.classList.remove("loader");
    return err;
  }
);

const requestInfo = {
  apiId: "Rainmaker",
  action: "",
  did: 1,
  key: "",
  msgId: "20170310130900|en_IN",
  requesterId: "",
  ts: 1513579888683,
  ver: ".01",
  authToken: Storage.get("citizen.token"),
};

const userServiceData = {
  userInfo: {
    id: 23349,
    uuid: "530968f3-76b3-4fd1-b09d-9e22eb1f85df",
    userName: "9404052047",
    name: "Aniket T",
    mobileNumber: "9404052047",
    emailId: "xc@gmail.com",
    locale: null,
    type: "CITIZEN",
    roles: [
      {
        name: "Citizen",
        code: "CITIZEN",
        tenantId: "pb",
      },
    ],
    active: true,
    tenantId: "pb",
  },
};

export const Request = async ({ method = "POST", url, data = {}, useCache = false, params = {}, auth, userService }) => {
  let key = "";
  if (method.toUpperCase() === "POST") {
    data.RequestInfo = {
      apiId: "Rainmaker",
    };
    if (auth) {
      data.RequestInfo = { ...data.RequestInfo, ...requestInfo };
    }
    if (userService) {
      data.RequestInfo = { ...data.RequestInfo, ...userServiceData };
    }
  }

  if (useCache) {
    key = `${method.toUpperCase()}.${url}.${JSON.stringify(params, null, 0)}.${JSON.stringify(data, null, 0)}`;
    const value = Storage.get(key);
    if (value) {
      return value;
    }
  } else {
    params._ = Date.now();
  }
  const res = await Axios({ method, url, data, params });
  if (useCache) {
    Storage.set(key, res.data);
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
  const cityList = (MdmsRes.tenant.citymodule && MdmsRes.tenant.citymodule.filter((module) => module.code === moduleCode)[0].tenants) || [];
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
