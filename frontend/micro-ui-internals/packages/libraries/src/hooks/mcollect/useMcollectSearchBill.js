import { useQuery, useQueryClient } from "react-query";

const useMcollectSearchBill = ({ tenantId, filters }, config = {}) => {
  //debugger;
  const client = useQueryClient();

  const args = tenantId ? { tenantId, filters } : { filters };
  console.log(args);
  const { isLoading, error, data } = useQuery(["billSearchList", tenantId, filters], () => Digit.MCollectService.search_bill(args), config);
  return { isLoading, error, data, revalidate: () => client.invalidateQueries(["billSearchList", tenantId, filters]) };
};

export default useMcollectSearchBill;
