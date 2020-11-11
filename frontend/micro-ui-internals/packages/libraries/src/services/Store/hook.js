import React from "react";
// import mergeConfig from "../../config/mergeConfig";
import { StoreService } from "./service";

export const useStore = (defaultConfig, { deltaConfig, stateCode, cityCode, moduleCode }) => {
  const [defaultStore, setDefaultStore] = React.useState({});
  React.useEffect(() => {
    const config = window.Digit.Config.mergeConfig(defaultConfig, deltaConfig);
    StoreService.defaultData(stateCode, cityCode, moduleCode).then((defaultData) => {
      const store = { config, ...defaultData };
      setDefaultStore(store);
    });
  }, [defaultConfig, stateCode, cityCode, moduleCode]);

  return defaultStore;
};
