import { useQuery } from "react-query";

const useGetFAQsJSON = (tenantId) => {
    return useQuery(["FAQ_S", tenantId], () => Digit.MDMSService.getFAQsJSONData(tenantId));
  };

export default useGetFAQsJSON;