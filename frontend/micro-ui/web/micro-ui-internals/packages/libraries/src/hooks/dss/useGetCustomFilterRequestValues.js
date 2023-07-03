import { useQuery } from "react-query";
import { DSSService } from "../../services/elements/DSS";

const useGetCustomFilterRequestValues = (filterConfigs, config={}) => {
  return useQuery(`DSS_CUSTOM_FILTER_REQUEST_VAL_${JSON.stringify(filterConfigs)}`, () => DSSService.getCustomFiltersDynamicValues(filterConfigs), config);
};

export default useGetCustomFilterRequestValues;
