import { useQuery } from "react-query";

const useGetHowItWorksJSON = (tenantId) => {
    return useQuery(["HOW_IT_WORKS", tenantId], () => Digit.MDMSService.getHowItWorksJSONData(tenantId));
  };

export default useGetHowItWorksJSON;