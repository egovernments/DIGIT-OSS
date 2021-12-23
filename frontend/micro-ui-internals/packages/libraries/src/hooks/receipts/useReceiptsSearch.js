import { useQuery, useQueryClient } from "react-query";
import ReceiptsService from "../../services/elements/Receipts";

export const useReceiptsSearch = (searchparams, tenantId, filters, isupdated, config = {}) => {
  const client = useQueryClient();
  let businessService = searchparams?.businessServices;
  const { isLoading, error, data, ...rest } = useQuery(["RECEIPTS_SEARCH", searchparams, tenantId, filters, isupdated], () => ReceiptsService.search(tenantId, filters, searchparams, businessService), config);
  return { isLoading, error, data, revalidate: () => client.invalidateQueries(["RECEIPTS_SEARCH", searchparams, tenantId, filters, isupdated]), ...rest };
};

export default useReceiptsSearch;
