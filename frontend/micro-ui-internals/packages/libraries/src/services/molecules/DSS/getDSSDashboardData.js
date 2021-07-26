import useDssMDMS from "../../../hooks/dss/useMDMS";

export const getDSSDashboardData = (stateCode, mdmsType, moduleCode) => {
  const { data: dssConfig, isLoading: configLoading, isSuccess: configLoaded } = useDssMDMS(stateCode, mdmsType, moduleCode);
  console.log("find dssconfog", dssConfig);
  return [
    {
      queryKey: ["DSS_DASHBOARD_DATA", mdmsType, moduleCode],
      queryFn: () => dssConfig,
    },
  ];
};
