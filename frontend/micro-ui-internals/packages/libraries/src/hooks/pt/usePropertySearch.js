import { useQuery, useQueryClient } from "react-query";

const usePropertySearch = ({ tenantId, filters, auth }, config = {}) => {
  const client = useQueryClient();

  const args = tenantId ? { tenantId, filters, auth } : { filters, auth };

  const defaultSelect = (data) => {
    data.Properties[0].units = data.Properties[0].units || [];
    data.Properties[0].units = data.Properties[0].units.filter((unit) => unit.active);
    data.Properties[0].owners = data.Properties[0].owners || [];
    data.Properties[0].owners = data.Properties[0].owners.filter((owner) => owner.status === "ACTIVE");
    return data;
  };

  const { isLoading, error, data } = useQuery(["propertySearchList", tenantId, filters, auth], () => Digit.PTService.search(args), {
    select: defaultSelect,
    ...config,
  });

  return { isLoading, error, data, revalidate: () => client.invalidateQueries(["propertySearchList", tenantId, filters, auth]) };
};

export default usePropertySearch;
