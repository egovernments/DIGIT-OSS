import { useState, useEffect } from "react";
// import mergeConfig from "../../config/mergeConfig";
import { StoreService } from "./service";

export const useStore = (defaultConfig, { deltaConfig, stateCode, cityCode, moduleCode, language }) => {
  const [defaultStore, setDefaultStore] = useState({});
  useEffect(() => {
    const config = window.Digit.Config.mergeConfig(defaultConfig, deltaConfig);
    StoreService.defaultData(stateCode, cityCode, moduleCode, language)
      .then((defaultData) => {
        const store = { config, ...defaultData };
        setDefaultStore(store);
      })
      .catch((err) => console.log("err:", err));
  }, [defaultConfig, stateCode, cityCode, moduleCode]);

  return defaultStore;
};

export const useInitStore = (stateCode) => {
  const [defaultStore, setDefaultStore] = useState({});
  useEffect(() => {
    StoreService.digitInitData(stateCode).then((initData) => {
      console.log("init data", initData);
      setDefaultStore({ config: {}, ...initData });
    });
  }, [stateCode]);
  return defaultStore;
};
