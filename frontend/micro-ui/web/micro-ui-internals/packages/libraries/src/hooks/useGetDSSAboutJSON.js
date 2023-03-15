import { useQuery } from "react-query";

const useGetDSSAboutJSON = (tenantId) => {
    return useQuery(["About", tenantId], () => Digit.MDMSService.getDSSAboutJSONData(tenantId));
  };

export default useGetDSSAboutJSON;