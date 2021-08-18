import { useQuery, useQueryClient } from "react-query";

const usePropertySearch = ({ tenantId, filters }, config = {}) => {
  const client = useQueryClient();

  const args = tenantId ? { tenantId, filters } : { filters };
  const { isLoading, error, data } = useQuery(["propertySearchList", tenantId, filters], () => Digit.PTService.search(args), config);
  if (!isLoading && data && data?.Properties && Array.isArray(data.Properties) && data.Properties.length > 0) {
    data.Properties[0].units = data.Properties[0].units || [];
    data.Properties[0].units = data.Properties[0].units.filter((unit) => unit.active);
  }
  return { isLoading, error, data, revalidate: () => client.invalidateQueries(["propertySearchList", tenantId, filters]) };
};

export default usePropertySearch;
