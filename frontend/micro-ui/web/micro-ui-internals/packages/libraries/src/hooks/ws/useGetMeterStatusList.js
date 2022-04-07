import { useQuery } from "react-query";

const useGetMeterStatusList = (tenantId) => {
    return useQuery(["getMeterStatus", tenantId], () => Digit.MDMSService.getMeterStatusType(tenantId));
  };

export default useGetMeterStatusList;