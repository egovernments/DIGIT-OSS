import { useQuery } from "react-query";
import { DSSService } from "../../services/elements/DSS";

const useGetCustomFilterValues = (filterConfigs, config={}) => {
  return useQuery(`DSS_CUSTOM_FILTER_CONFIG_${JSON.stringify(filterConfigs)}`, () => DSSService.getFiltersConfigData(filterConfigs), config);
};

export default useGetCustomFilterValues;
