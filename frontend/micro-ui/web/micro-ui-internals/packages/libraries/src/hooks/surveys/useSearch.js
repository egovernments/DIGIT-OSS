import { Surveys } from "../../services/elements/Surveys";
import { useQuery } from "react-query";

const useSearch = (filters, config) => {
  return useQuery(["search_surveys", filters?.uuid, filters?.title, filters?.tenantIds, filters?.postedBy, filters?.offset, filters?.limit], () => Surveys.search(filters), { ...config });
};

export default useSearch;
