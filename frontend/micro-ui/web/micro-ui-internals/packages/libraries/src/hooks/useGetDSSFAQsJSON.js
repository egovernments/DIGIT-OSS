import { useQuery } from "react-query";

const useGetDSSFAQsJSON = (tenantId) => {
    return useQuery(["FAQS", tenantId], () => Digit.MDMSService.getDSSFAQsJSONData(tenantId));
  };

export default useGetDSSFAQsJSON;