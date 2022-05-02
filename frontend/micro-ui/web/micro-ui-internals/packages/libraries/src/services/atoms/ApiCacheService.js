import { PersistantStorage } from "./Utils/Storage";

const defaultApiCachingSettings = [
  {
    serviceName: "localization",
    cacheTimeInSecs: 86400,
  },
  {
    serviceName: "egov-mdms-service",
    cacheTimeInSecs: 3600,
    debounceTimeInMS: 100,
    moduleSettings: [
      {
        moduleName: "FSM",
        cacheTimeInSecs: 7200,
      },
    ],
  },
];

const storageKey = "cachingService";
const getCachedSetting = () => {
  if (Digit.ApiCacheSetting) {
    return Digit.ApiCacheSetting;
  }
  const setting = PersistantStorage.get(storageKey) || defaultApiCachingSettings;
  Digit.ApiCacheSetting = setting;
  return setting;
};
const getSetting = (serviceName, moduleName) => {
  const setting = getCachedSetting();
  const serviceSetting = setting.find((item) => item.serviceName === serviceName);
  const responseSetting = {
    cacheTimeInSecs: serviceSetting.cacheTimeInSecs,
    debounceTimeInMS: serviceSetting.debounceTimeInMS || 100,
  };
  if (!moduleName) {
    return responseSetting;
  }
  const moduleSettings = serviceSetting?.moduleSettings?.find((item) => item.moduleName === moduleName);
  if (!moduleSettings) {
    return responseSetting;
  }
  return {
    cacheTimeInSecs: moduleSettings.cacheTimeInSecs || responseSetting.cacheTimeInSecs,
    debounceTimeInMS: moduleSettings.debounceTimeInMS || responseSetting.debounceTimeInMS,
  };
};
export const ApiCacheService = {
  saveSetting: (setting) => {
    PersistantStorage.set(storageKey, setting || defaultApiCachingSettings);
  },
  getSettingByServiceUrl: (serviceUrl, moduleName) => {
    return getSetting(serviceUrl.split("/")[1], moduleName);
  },
};
