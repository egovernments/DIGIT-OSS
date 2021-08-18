import { useQuery } from "react-query";
import { startOfMonth, endOfMonth, getTime } from "date-fns";
import { DSSService } from "../../services/elements/DSS";

const getRequest = (type, code, requestDate) => ({
  aggregationRequestDto: {
    visualizationType: type.toUpperCase(),
    visualizationCode: code,
    queryType: "",
    filters: {},
    moduleLevel: "",
    aggregationFactors: null,
    requestDate,
  },
});

const useGetChart = (args) => {
  const { key, type, tenantId, requestDate } = args;
  return useQuery([key, requestDate], () =>
    DSSService.getCharts({
      ...getRequest(type, key, requestDate),
      headers: {
        tenantId,
      },
    })
  );
};

export default useGetChart;
