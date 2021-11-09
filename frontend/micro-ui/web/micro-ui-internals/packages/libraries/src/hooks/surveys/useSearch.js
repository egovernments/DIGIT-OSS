import { Surveys } from "../../services/elements/Surveys";
import { useMutation, useQuery } from "react-query";

const useSearch = (filters, config) => {
  return useQuery(["search_surveys", filters?.name, filters?.category, filters?.tenantIds, filters?.postedBy, filters?.offset, filters?.limit ], () => Surveys.search(filters), { ...config });
};

export default useSearch;
