import { useQuery, useQueryClient } from "react-query";
import { UserService } from "../services/elements/User";

export const useUserSearch = (tenantId, data, filters, options = {}) => {
  const client = useQueryClient();
  const queryData = useQuery(["USER_SEARCH", filters, data], () => UserService.userSearch(tenantId, data, filters), options);
  return { ...queryData, revalidate: () => client.invalidateQueries(["USER_SEARCH", filters, data]) };
};
