import { Engagement } from "../../services/elements/Engagement";
import { useMutation, useQuery } from "react-query";

const useSearch = (filters, config) => {
  return useQuery(["search_engagement", filters?.name, filters?.category, filters?.tenantIds ], () => Engagement.search(filters), { ...config });
};

export default useSearch;
