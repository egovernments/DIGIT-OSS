import { useQuery, useQueryClient } from "react-query";
import BRService from "../../services/elements/BR";

export const useBRSearch = (searchparams, tenantId, filters, config = {}) => {
  return useQuery(["BR_SEARCH", searchparams, tenantId, filters], () => Digit.BRService.search(tenantId, filters, searchparams), config);
};

export default useBRSearch;