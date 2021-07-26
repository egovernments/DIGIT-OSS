import { useState, useEffect } from "react";
import { useQuery } from "react-query";
// import mergeConfig from "../../config/mergeConfig";
import { StoreService } from "../services/molecules/Store/service";

export const useStore = ({ stateCode, moduleCode, language }) => {
  return useQuery(["store", stateCode, moduleCode, language], () => StoreService.defaultData(stateCode, moduleCode, language));
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
