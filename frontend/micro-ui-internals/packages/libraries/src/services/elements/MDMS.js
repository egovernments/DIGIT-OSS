import { stringReplaceAll } from "@egovernments/digit-ui-module-pt/src/utils";
import { ApiCacheService } from "../atoms/ApiCacheService";
import Urls from "../atoms/urls";
import { Request, ServiceRequest } from "../atoms/Utils/Request";
import { PersistantStorage } from "../atoms/Utils/Storage";

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
        masterDetails: [{ name: "Department" }, { name: "Designation" }, { name: "StateInfo" }, { name: "wfSlaConfig" }],
      },
      {
        moduleName: "tenant",
        masterDetails: [{ name: "tenants" }, { name: "citymodule" }],
      },
      {
        moduleName: "DIGIT-UI",
        masterDetails: [{ name: "ApiCachingSettings" }],
      },
    ],
  },
});

const getCriteria = (tenantId, moduleDetails) => {
  return {
    MdmsCriteria: {
      tenantId,
      ...moduleDetails,
    },
  };
};

export const getGeneralCriteria = (tenantId, moduleCode, type) => ({
  details: {
    moduleDetails: [
      {
        moduleName: moduleCode,
        masterDetails: [
          {
            name: type,
          },
        ],
      },
    ],
  },
});

const getReceiptKey = (tenantId, moduleCode) => ({
  details: {
    tenantId,
    moduleDetails: [
      {
        moduleName: moduleCode,
        masterDetails: [
          {
            name: "uiCommonPay",
          },
        ],
      },
    ],
  },
});

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

const getSanitationTypeCriteria = (tenantId, moduleCode) => ({
  type: "SanitationType",
  details: {
    tenantId: tenantId,
    moduleDetails: [
      {
        moduleName: moduleCode,
        masterDetails: [
          {
            name: "SanitationType",
            filter: null,
          },
        ],
      },
    ],
  },
});

const getPitTypeCriteria = (tenantId, moduleCode) => ({
  type: "PitType",
  details: {
    tenantId,
    moduleDetails: [
      {
        moduleName: moduleCode,
        masterDetails: [
          {
            name: "PitType",
            filter: null,
          },
        ],
      },
    ],
  },
});

const getApplicationChannelCriteria = (tenantId, moduleCode) => ({
  type: "ApplicationChannel",
  details: {
    tenantId: tenantId,
    moduleDetails: [
      {
        moduleName: moduleCode,
        masterDetails: [
          {
            name: "ApplicationChannel",
            filter: null,
          },
        ],
      },
    ],
  },
});

const getPropertyTypeCriteria = (tenantId, moduleCode, type) => ({
  type,
  details: {
    tenantId: tenantId,
    moduleDetails: [
      {
        moduleName: moduleCode,
        masterDetails: [
          {
            name: "PropertyType",
            filter: null,
          },
        ],
      },
    ],
  },
});

const getPropertyUsageCriteria = (tenantId, moduleCode, type) => ({
  type,
  details: {
    tenantId: tenantId,
    moduleDetails: [
      {
        moduleName: moduleCode,
        masterDetails: [
          {
            name: "PropertyType",
            filter: null,
          },
        ],
      },
    ],
  },
});

const getCommonFieldsCriteria = (tenantId, moduleCode, type) => ({
  type,
  details: {
    tenantId,
    moduleDetails: [
      {
        moduleName: moduleCode,
        masterDetails: [
          {
            name: "CommonFieldsConfig",
            filter: null,
          },
        ],
      },
    ],
  },
});

const getPreFieldsCriteria = (tenantId, moduleCode, type) => ({
  type,
  details: {
    tenantId,
    moduleDetails: [
      {
        moduleName: moduleCode,
        masterDetails: [
          {
            name: "PreFieldsConfig",
            filter: null,
          },
        ],
      },
    ],
  },
});

const getPostFieldsCriteria = (tenantId, moduleCode, type) => ({
  type,
  details: {
    tenantId,
    moduleDetails: [
      {
        moduleName: moduleCode,
        masterDetails: [
          {
            name: "PostFieldsConfig",
            filter: null,
          },
        ],
      },
    ],
  },
});

const getConfig = (tenantId, moduleCode) => ({
  type: "Config",
  details: {
    tenantId,
    moduleDetails: [
      {
        moduleName: moduleCode,
        masterDetails: [
          {
            name: "Config",
          },
        ],
      },
    ],
  },
});

const getVehicleTypeCriteria = (tenantId, moduleCode, type) => ({
  type,
  details: {
    tenantId: tenantId,
    moduleDetails: [
      {
        moduleName: moduleCode,
        masterDetails: [
          {
            name: "VehicleMakeModel",
            filter: null,
          },
        ],
      },
    ],
  },
});

const getChecklistCriteria = (tenantId, moduleCode) => ({
  details: {
    tenantId,
    moduleDetails: [
      {
        moduleName: moduleCode,
        masterDetails: [
          {
            name: "CheckList",
            filter: null,
          },
        ],
      },
    ],
  },
});

const getSlumLocalityCriteria = (tenantId, moduleCode, type) => ({
  type,
  details: {
    tenantId,
    moduleDetails: [
      {
        moduleName: moduleCode,
        masterDetails: [
          {
            name: "Slum",
          },
        ],
      },
    ],
  },
});
const getPropertyOwnerTypeCriteria = (tenantId, moduleCode, type) => ({
  type,
  details: {
    tenantId: tenantId,
    moduleDetails: [
      {
        moduleName: moduleCode,
        masterDetails: [{ name: "OwnerType" }],
      },
    ],
  },
});

const getSubPropertyOwnerShipCategoryCriteria = (tenantId, moduleCode, type) => ({
  type,
  details: {
    tenantId: tenantId,
    moduleDetails: [
      {
        moduleName: moduleCode,
        masterDetails: [{ name: "SubOwnerShipCategory" }],
      },
    ],
  },
});
const getPropertyOwnerShipCategoryCriteria = (tenantId, moduleCode, type) => ({
  type,
  details: {
    tenantId: tenantId,
    moduleDetails: [
      {
        moduleName: moduleCode,
        masterDetails: [{ name: "OwnerShipCategory" }],
      },
    ],
  },
});

const getDocumentRequiredScreenCategory = (tenantId, moduleCode) => ({
  details: {
    tenantId: tenantId,
    moduleDetails: [
      {
        moduleName: moduleCode,
        masterDetails: [
          {
            name: "Documents",
          },
        ],
      },
    ],
  },
});

const getDefaultMapConfig = (tenantId, moduleCode) => ({
  details: {
    tenantId: tenantId,
    moduleDetails: [
      {
        moduleName: moduleCode,
        masterDetails: [
          {
            name: "MapConfig",
          },
        ],
      },
    ],
  },
});

const getUsageCategoryList = (tenantId, moduleCode, type) => ({
  type,
  details: {
    tenantId: tenantId,
    moduleDetails: [
      {
        moduleName: moduleCode,
        masterDetails: [{ name: "UsageCategory" }],
      },
    ],
  },
});

const getPTPropertyTypeList = (tenantId, moduleCode, type) => ({
  type,
  details: {
    tenantId: tenantId,
    moduleDetails: [
      {
        moduleName: moduleCode,
        masterDetails: [{ name: "PropertyType" }],
      },
    ],
  },
});

const getPTFloorList = (tenantId, moduleCode, type) => ({
  type,
  details: {
    tenantId: tenantId,
    moduleDetails: [
      {
        moduleName: moduleCode,
        masterDetails: [{ name: "Floor" }],
      },
    ],
  },
});

const getReasonCriteria = (tenantId, moduleCode, type, payload) => ({
  type,
  details: {
    tenantId,
    moduleDetails: [
      {
        moduleName: moduleCode,
        masterDetails: payload.map((mdmsLoad) => ({
          name: mdmsLoad,
        })),
      },
    ],
  },
});

const getBillingServiceForBusinessServiceCriteria = () => ({
  moduleDetails: [
    {
      moduleName: "BillingService",
      masterDetails: [{ name: "BusinessService" }],
    },
  ],
});

const getRoleStatusCriteria = (tenantId, moduleCode, type) => ({
  type,
  details: {
    tenantId,
    moduleDetails: [
      {
        moduleName: moduleCode,
        masterDetails: [
          {
            name: "RoleStatusMapping",
            filter: null,
          },
        ],
      },
    ],
  },
});
const getRentalDetailsCategoryCriteria = (tenantId, moduleCode) => ({
  details: {
    tenantId: tenantId,
    moduleDetails: [
      {
        moduleName: moduleCode,
        masterDetails: [
          {
            name: "RentalDetails",
          },
        ],
      },
    ],
  },
});

const getDssDashboardCriteria = (tenantId, moduleCode) => ({
  details: {
    tenantId,
    moduleDetails: [
      {
        moduleName: moduleCode,
        masterDetails: [
          {
            name: "dashboard-config",
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

const GetServiceDefs = (MdmsRes, moduleCode) => MdmsRes[`RAINMAKER-${moduleCode}`].ServiceDefs.filter((def) => def.active);

const GetSanitationType = (MdmsRes) => MdmsRes["FSM"].SanitationType.filter((type) => type.active);

const GetPitType = (MdmsRes) =>
  MdmsRes["FSM"].PitType.filter((item) => item.active).map((type) => ({ ...type, i18nKey: `PITTYPE_MASTERS_${type.code}` }));

const GetApplicationChannel = (MdmsRes) =>
  MdmsRes["FSM"].ApplicationChannel.filter((type) => type.active).map((channel) => ({
    ...channel,
    i18nKey: `ES_APPLICATION_DETAILS_APPLICATION_CHANNEL_${channel.code}`,
  }));

const GetPropertyType = (MdmsRes) =>
  MdmsRes["FSM"].PropertyType.filter((property) => property.active && !property.propertyType).map((item) => ({
    ...item,
    i18nKey: `PROPERTYTYPE_MASTERS_${item.code}`,
    code: item.code,
  }));

const GetPropertySubtype = (MdmsRes) =>
  MdmsRes["FSM"].PropertyType.filter((property) => property.active && property.propertyType).map((item) => ({
    ...item,
    i18nKey: `PROPERTYTYPE_MASTERS_${item.code}`,
    code: item.code,
  }));

const GetVehicleType = (MdmsRes) =>
  MdmsRes["Vehicle"].VehicleMakeModel.filter((vehicle) => vehicle.active)
    .filter((vehicle) => vehicle.make)
    .map((vehicleDetails) => {
      return {
        ...vehicleDetails,
        i18nKey: `COMMON_MASTER_VEHICLE_${vehicleDetails.code}`,
      };
    });

const GetSlumLocalityMapping = (MdmsRes, tenantId) =>
  MdmsRes["FSM"].Slum.filter((type) => type.active).reduce((prev, curr) => {
    // console.log("find prev",prev, curr)
    return prev[curr.locality]
      ? {
          ...prev,
          [curr.locality]: [
            ...prev[curr.locality],
            {
              ...curr,
              i18nKey: `${tenantId.toUpperCase().replace(".", "_")}_${curr.locality}_${curr.code}`,
            },
          ],
        }
      : {
          ...prev,
          [curr.locality]: [
            {
              ...curr,
              i18nKey: `${tenantId.toUpperCase().replace(".", "_")}_${curr.locality}_${curr.code}`,
            },
          ],
        };
  }, {});

const GetPropertyOwnerShipCategory = (MdmsRes) =>
  MdmsRes["PropertyTax"].OwnerShipCategory.filter((ownerShip) => ownerShip.active).map((ownerShipDetails) => {
    return {
      ...ownerShipDetails,
      i18nKey: `COMMON_MASTER_OWNER_TYPE_${ownerShipDetails.code}`,
    };
  });

const GetPropertyOwnerType = (MdmsRes) =>
  MdmsRes["PropertyTax"].OwnerType.filter((owner) => owner.active).map((ownerDetails) => {
    return {
      ...ownerDetails,
      i18nKey: `PROPERTYTAX_OWNERTYPE_${ownerDetails.code}`,
    };
  });

const getSubPropertyOwnerShipCategory = (MdmsRes) => {
  MdmsRes["PropertyTax"].SubOwnerShipCategory.filter((category) => category.active).map((subOwnerShipDetails) => {
    return {
      ...subOwnerShipDetails,
      i18nKey: `PROPERTYTAX_BILLING_SLAB_${subOwnerShipDetails.code}`,
    };
  });
  sessionStorage.setItem("getSubPropertyOwnerShipCategory", JSON.stringify(MdmsRes));
};

const getDocumentRequiredScreen = (MdmsRes) => {
  MdmsRes["PropertyTax"].Documents.filter((Documents) => Documents.active).map((dropdownData) => {
    return {
      ...Documents,
      i18nKey: `${dropdownData.code}`,
    };
  });
};

const getMapConfig = (MdmsRes) => {
  MdmsRes["PropertyTax"].MapConfig.filter((MapConfig) => MapConfig).map((MapData) => {
    return {
      ...MapConfig,
      defaultconfig: MapData.defaultConfig,
    };
  });
};

const getUsageCategory = (MdmsRes) =>
  MdmsRes["PropertyTax"].UsageCategory.filter((UsageCategory) => UsageCategory.active).map((UsageCategorylist) => {
    return {
      ...UsageCategorylist,
      i18nKey: `PROPERTYTAX_BILLING_SLAB_${UsageCategorylist.code}`,
    };
  });

const getPTPropertyType = (MdmsRes) =>
  MdmsRes["PropertyTax"].UsageCategory.filter((PropertyType) => PropertyType.active).map((PTPropertyTypelist) => {
    return {
      ...UsageCategorylist,
      i18nKey: `COMMON_PROPTYPE_${stringReplaceAll(PTPropertyTypelist.code, ".", "_")}`,
    };
  });

const getFloorList = (MdmsRes) =>
  MdmsRes["PropertyTax"].Floor.filter((PTFloor) => PTFloor.active).map((PTFloorlist) => {
    return {
      ...PTFloorlist,
      i18nKey: `PROPERTYTAX_FLOOR_${PTFloorlist.code}`,
    };
  });

const GetReasonType = (MdmsRes, type, moduleCode) =>
  Object.assign(
    {},
    ...Object.keys(MdmsRes[moduleCode]).map((collection) => ({
      [collection]: MdmsRes[moduleCode][collection]
        .filter((reason) => reason.active)
        .map((reason) => ({
          ...reason,
          i18nKey: `ES_ACTION_REASON_${reason.code}`,
        })),
    }))
  );

const getRentalDetailsCategory = (MdmsRes) => {
  MdmsRes["PropertyTax"].RentalDetails.filter((category) => category.active).map((RentalDetailsInfo) => {
    return {
      ...RentalDetailsInfo,
      i18nKey: `PROPERTYTAX_BILLING_SLAB_${RentalDetailsInfo.code}`,
    };
  });
};

const getDssDashboard = () => MdmsRes["dss-dashboard"]["dashboard-config"];

const GetRoleStatusMapping = (MdmsRes) => MdmsRes["DIGIT-UI"].RoleStatusMapping;
const GetCommonFields = (MdmsRes) => MdmsRes["FSM"].CommonFieldsConfig;

const GetPreFields = (MdmsRes) => MdmsRes["FSM"].PreFieldsConfig;

const GetPostFields = (MdmsRes) => MdmsRes["FSM"].PostFieldsConfig;

const transformResponse = (type, MdmsRes, moduleCode, tenantId) => {
  switch (type) {
    case "citymodule":
      return GetCitiesWithi18nKeys(MdmsRes, moduleCode);
    case "egovLocation":
      return GetEgovLocations(MdmsRes);
    case "serviceDefs":
      return GetServiceDefs(MdmsRes, moduleCode);
    case "ApplicationChannel":
      return GetApplicationChannel(MdmsRes);
    case "SanitationType":
      return GetSanitationType(MdmsRes);
    case "PropertyType":
      return GetPropertyType(MdmsRes);
    case "PropertySubtype":
      return GetPropertySubtype(MdmsRes);
    case "PitType":
      return GetPitType(MdmsRes);
    case "VehicleType":
      return GetVehicleType(MdmsRes);
    case "Slum":
      return GetSlumLocalityMapping(MdmsRes, tenantId);
    case "OwnerShipCategory":
      return GetPropertyOwnerShipCategory(MdmsRes);
    case "OwnerType":
      return GetPropertyOwnerType(MdmsRes);
    case "SubOwnerShipCategory":
      return getSubPropertyOwnerShipCategory(MdmsRes);
    case "Documents":
      return getDocumentRequiredScreen(MdmsRes);
    case "MapConfig":
      return getMapConfig(MdmsRes);
    case "UsageCategory":
      return getUsageCategory(MdmsRes);
    case "PTPropertyType":
      return getPTPropertyType(MdmsRes);
    case "Floor":
      return getFloorList(MdmsRes);
    case "Reason":
      return GetReasonType(MdmsRes, type, moduleCode);
    case "RoleStatusMapping":
      return GetRoleStatusMapping(MdmsRes);
    case "CommonFieldsConfig":
      return GetCommonFields(MdmsRes);
    case "PreFieldsConfig":
      return GetPreFields(MdmsRes);
    case "PostFieldsConfig":
      return GetPostFields(MdmsRes);
    case "RentalDeatils":
      return getRentalDetailsCategory(MdmsRes);
    case "DssDashboard":
      return getDssDashboard(MdmsRes);
    default:
      return MdmsRes;
  }
};

const getCacheSetting = (moduleName) => {
  return ApiCacheService.getSettingByServiceUrl(Urls.MDMS, moduleName);
};

const mergedData = {};
const mergedPromises = {};
const callAllPromises = (success, promises = [], resData) => {
  promises.forEach((promise) => {
    if (success) {
      promise.resolve(resData);
    } else {
      promise.reject(resData);
    }
  });
};
const mergeMDMSData = (data, tenantId) => {
  if (!mergedData[tenantId] || Object.keys(mergedData[tenantId]).length === 0) {
    mergedData[tenantId] = data;
  } else {
    data.MdmsCriteria.moduleDetails.forEach((dataModuleDetails) => {
      const moduleName = dataModuleDetails.moduleName;
      const masterDetails = dataModuleDetails.masterDetails;
      let found = false;
      mergedData[tenantId].MdmsCriteria.moduleDetails.forEach((moduleDetail) => {
        if (moduleDetail.moduleName === moduleName) {
          found = true;
          moduleDetail.masterDetails = [...moduleDetail.masterDetails, ...masterDetails];
        }
      });
      if (!found) {
        mergedData[tenantId].MdmsCriteria.moduleDetails.push(dataModuleDetails);
      }
    });
  }
};
const debouncedCall = ({ serviceName, url, data, useCache, params }, resolve, reject) => {
  if (!mergedPromises[params.tenantId] || mergedPromises[params.tenantId].length === 0) {
    const cacheSetting = getCacheSetting();
    setTimeout(() => {
      let callData = JSON.parse(JSON.stringify(mergedData[params.tenantId]));
      mergedData[params.tenantId] = {};
      let callPromises = [...mergedPromises[params.tenantId]];
      mergedPromises[params.tenantId] = [];
      // console.log("calling merged mdms service", callData);
      ServiceRequest({
        serviceName,
        url,
        data: callData,
        useCache,
        params,
      })
        .then((data) => {
          callAllPromises(true, callPromises, data);
        })
        .catch((err) => {
          callAllPromises(false, callPromises, err);
        });
    }, cacheSetting.debounceTimeInMS || 500);
  }
  mergeMDMSData(data, params.tenantId);
  if (!mergedPromises[params.tenantId]) {
    mergedPromises[params.tenantId] = [];
  }
  mergedPromises[params.tenantId].push({ resolve, reject });
  // console.log("debouncing mdms", JSON.stringify(data, null, 2), JSON.stringify(mergedData[params.tenantId], null, 2));
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
  call: (tenantId, details) => {
    return new Promise((resolve, reject) =>
      debouncedCall(
        {
          serviceName: "mdmsCall",
          url: Urls.MDMS,
          data: getCriteria(tenantId, details),
          useCache: true,
          params: { tenantId },
        },
        resolve,
        reject
      )
    );
  },
  getDataByCriteria: async (tenantId, mdmsDetails, moduleCode) => {
    const key = `MDMS.${tenantId}.${moduleCode}.${mdmsDetails.type}.${JSON.stringify(mdmsDetails.details)}`;
    const inStoreValue = PersistantStorage.get(key);
    if (inStoreValue) {
      return inStoreValue;
    }
    console.log("mdms request details ---->", mdmsDetails, moduleCode);
    const { MdmsRes } = await MdmsService.call(tenantId, mdmsDetails.details);
    const responseValue = transformResponse(mdmsDetails.type, MdmsRes, moduleCode.toUpperCase(), tenantId);
    const cacheSetting = getCacheSetting(mdmsDetails.details.moduleDetails[0].moduleName);
    PersistantStorage.set(key, responseValue, cacheSetting.cacheTimeInSecs);
    return responseValue;
  },
  getServiceDefs: (tenantId, moduleCode) => {
    return MdmsService.getDataByCriteria(tenantId, getModuleServiceDefsCriteria(tenantId, moduleCode), moduleCode);
  },
  getSanitationType: (tenantId, moduleCode) => {
    return MdmsService.getDataByCriteria(tenantId, getSanitationTypeCriteria(tenantId, moduleCode), moduleCode);
  },
  getApplicationChannel: (tenantId, moduleCode) => {
    return MdmsService.getDataByCriteria(tenantId, getApplicationChannelCriteria(tenantId, moduleCode), moduleCode);
  },
  getPropertyType: (tenantId, moduleCode, type) => {
    return MdmsService.getDataByCriteria(tenantId, getPropertyTypeCriteria(tenantId, moduleCode, type), moduleCode);
  },
  getPropertyUsage: (tenantId, moduleCode, type) => {
    return MdmsService.getDataByCriteria(tenantId, getPropertyUsageCriteria(tenantId, moduleCode, type), moduleCode);
  },
  getPropertySubtype: (tenantId, moduleCode, type) => {
    return MdmsService.getDataByCriteria(tenantId, getPropertyTypeCriteria(tenantId, moduleCode, type), moduleCode);
  },
  getPitType: (tenantId, moduleCode) => {
    return MdmsService.getDataByCriteria(tenantId, getPitTypeCriteria(tenantId, moduleCode), moduleCode);
  },
  getVehicleType: (tenantId, moduleCode, type) => {
    return MdmsService.getDataByCriteria(tenantId, getVehicleTypeCriteria(tenantId, moduleCode, type), moduleCode);
  },
  getChecklist: (tenantId, moduleCode) => {
    return MdmsService.getDataByCriteria(tenantId, getChecklistCriteria(tenantId, moduleCode), moduleCode);
  },
  getPaymentRules: (tenantId) => {
    return MdmsService.call(tenantId, getBillingServiceForBusinessServiceCriteria());
  },

  getCustomizationConfig: (tenantId, moduleCode) => {
    return MdmsService.getDataByCriteria(tenantId, getConfig(tenantId, moduleCode), moduleCode);
  },
  getSlumLocalityMapping: (tenantId, moduleCode, type) =>
    MdmsService.getDataByCriteria(tenantId, getSlumLocalityCriteria(tenantId, moduleCode, type), moduleCode),

  getReason: (tenantId, moduleCode, type, payload) =>
    MdmsService.getDataByCriteria(tenantId, getReasonCriteria(tenantId, moduleCode, type, payload), moduleCode),

  getRoleStatus: (tenantId, moduleCode, type) =>
    MdmsService.getDataByCriteria(tenantId, getRoleStatusCriteria(tenantId, moduleCode, type), moduleCode),

  getCommonFieldsConfig: (tenantId, moduleCode, type, payload) =>
    MdmsService.getDataByCriteria(tenantId, getCommonFieldsCriteria(tenantId, moduleCode, type, payload), moduleCode),

  getPreFieldsConfig: (tenantId, moduleCode, type, payload) =>
    MdmsService.getDataByCriteria(tenantId, getPreFieldsCriteria(tenantId, moduleCode, type, payload), moduleCode),

  getPostFieldsConfig: (tenantId, moduleCode, type, payload) =>
    MdmsService.getDataByCriteria(tenantId, getPostFieldsCriteria(tenantId, moduleCode, type, payload), moduleCode),

  getPropertyOwnerShipCategory: (tenantId, moduleCode, type) => {
    return MdmsService.getDataByCriteria(tenantId, getPropertyOwnerShipCategoryCriteria(tenantId, moduleCode, type), moduleCode);
  },
  getPropertyOwnerType: (tenantId, moduleCode, type) => {
    return MdmsService.getDataByCriteria(tenantId, getPropertyOwnerTypeCriteria(tenantId, moduleCode, type), moduleCode);
  },
  getPropertySubOwnerShipCategory: (tenantId, moduleCode, type) => {
    return MdmsService.getDataByCriteria(tenantId, getSubPropertyOwnerShipCategoryCriteria(tenantId, moduleCode, type), moduleCode);
  },
  getDocumentRequiredScreen: (tenantId, moduleCode) => {
    return MdmsService.getDataByCriteria(tenantId, getDocumentRequiredScreenCategory(tenantId, moduleCode), moduleCode);
  },
  getMapConfig: (tenantId, moduleCode) => {
    return MdmsService.getDataByCriteria(tenantId, getDefaultMapConfig(tenantId, moduleCode), moduleCode);
  },
  getUsageCategory: (tenantId, moduleCode, type) => {
    return MdmsService.getDataByCriteria(tenantId, getUsageCategoryList(tenantId, moduleCode), moduleCode);
  },
  getPTPropertyType: (tenantId, moduleCode, type) => {
    return MdmsService.getDataByCriteria(tenantId, getPTPropertyTypeList(tenantId, moduleCode), moduleCode);
  },
  getFloorList: (tenantId, moduleCode, type) => {
    return MdmsService.getDataByCriteria(tenantId, getPTFloorList(tenantId, moduleCode, type), moduleCode);
  },
  getRentalDetails: (tenantId, moduleCode) => {
    return MdmsService.getDataByCriteria(tenantId, getRentalDetailsCategoryCriteria(tenantId, moduleCode), moduleCode);
  },
  getDssDashboard: (tenantId, moduleCode) => {
    return MdmsService.getDataByCriteria(tenantId, getDssDashboardCriteria(tenantId, moduleCode), moduleCode);
  },
  getPaymentGateway: (tenantId, moduleCode, type) => {
    return MdmsService.getDataByCriteria(tenantId, getGeneralCriteria(tenantId, moduleCode, type), moduleCode);
  },
  getReceiptKey: (tenantId, moduleCode) => {
    return MdmsService.getDataByCriteria(tenantId, getReceiptKey(tenantId, moduleCode), moduleCode);
  },
  getHelpText: (tenantId, moduleCode, type) => {
    return MdmsService.getDataByCriteria(tenantId, getGeneralCriteria(tenantId, moduleCode, type), moduleCode);
  },
};
