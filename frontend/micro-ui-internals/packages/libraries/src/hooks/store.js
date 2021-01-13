import { useState, useEffect } from "react";
import { useQuery } from "react-query";
// import mergeConfig from "../../config/mergeConfig";
import { StoreService } from "../services/molecules/Store/service";

export const useStore = ({ stateCode, moduleCode, language }) => {
  const [defaultStore, setDefaultStore] = useState({});
  useEffect(() => {
    StoreService.defaultData(stateCode, moduleCode, language)
      .then((defaultData) => {
        setDefaultStore({ loading: false, ...defaultData });
      })
      .catch((err) => console.log("err:", err));
  }, [stateCode, moduleCode, language]);

  return defaultStore;
};

export const useInitStore = (stateCode, enabledModules) => {
  const { isLoading, error, isError, data } = useQuery(
    ["initStore", stateCode, enabledModules],
    () => StoreService.digitInitData(stateCode, enabledModules),
    {
      staleTime: Infinity,
    }
  );
  return { isLoading, error, isError, data };
};
