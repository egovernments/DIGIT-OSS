import { useQuery } from "react-query";
import { startOfMonth, endOfMonth, getTime } from "date-fns";
import { DSSService } from "../../services/elements/DSS";

const getRequest = (type, code, requestDate, filters, moduleLevel = "", addlFilter, indexKeyForEmptyModule) => {
  let newFilter = { ...{ ...filters, ...addlFilter } };
  let updatedFilter = Object.keys(newFilter)
    .filter((ele) => newFilter[ele].length > 0)
    .reduce((acc, curr) => {
      acc[curr] = newFilter[curr];
      return acc;
    }, {});
  return {
    aggregationRequestDto: {
      visualizationType: type.toUpperCase(),
      visualizationCode: code,
      queryType: "",
      filters: updatedFilter,
      moduleLevel: indexKeyForEmptyModule?.includes(code)? "" : moduleLevel,
      aggregationFactors: null,
      requestDate,
    },
  };
};
const defaultSelect = (data) => {
  if (data?.responseData) {
    if (data?.responseData?.data) {
      data.responseData.data = data?.responseData?.data?.filter((col) => col) || [];
      data.responseData.data?.forEach((row) => {
        if (row?.plots) {
          row.plots = row?.plots.filter((col) => col) || [];
        }
      });
    }
  }
  return data;
};

const useGetChart = (args) => {
  const { key, type, tenantId, requestDate, filters, moduleLevel, addlFilter } = args;
  const indexKeyForEmptyModule = [
    "nssPtCitizenFeedbackScore",
    "nssPtCitizenServiceDeliveryIndex",
    "sdssPtCitizenFeedbackScore",
  ];
  return useQuery(
    [args],
    () =>
      DSSService.getCharts({
        ...getRequest(type, key, requestDate, filters, moduleLevel, addlFilter, indexKeyForEmptyModule),
        headers: {
          tenantId,
        },
      }),
    {
      select: defaultSelect,
      refetchOnMount: true,
      retry: false,
      refetchOnWindowFocus: false
    }
  );
};

export default useGetChart;
