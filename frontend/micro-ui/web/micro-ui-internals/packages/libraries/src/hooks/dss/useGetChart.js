import { useQuery } from "react-query";
import { startOfMonth, endOfMonth, getTime } from "date-fns";
import { DSSService } from "../../services/elements/DSS";

const getRequest = (type, code, requestDate, filters) => ({
  aggregationRequestDto: {
    visualizationType: type.toUpperCase(),
    visualizationCode: code,
    queryType: "",
    filters: { ...filters },
    moduleLevel: "",
    aggregationFactors: null,
    requestDate,
  },
});

const useGetChart = (args) => {
  const { key, type, tenantId, requestDate, filters } = args;
  return useQuery([args], () =>
    DSSService.getCharts({
      ...getRequest(type, key, requestDate, filters),
      headers: {
        tenantId,
      },
    })
  );
};

export default useGetChart;
