import React from "react";
// import mergeConfig from "../../config/mergeConfig";
import { StoreService } from "./service";

export const useStore = (defaultConfig, { deltaConfig, stateCode, cityCode, moduleCode }) => {
  const [defaultStore, setDefaultStore] = React.useState({});
  React.useEffect(() => {
    console.log("useStore effect");
    const config = window.Digit.Config.mergeConfig(defaultConfig, deltaConfig);
    StoreService.defaultData(stateCode, cityCode, moduleCode).then((defaultData) => {
      const store = { config, ...defaultData };
      console.log("store:", store);
      setDefaultStore(store);
    });
  }, [defaultConfig, stateCode, cityCode, moduleCode]);

  return defaultStore;
};
