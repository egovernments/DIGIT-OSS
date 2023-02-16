import { useQuery } from "react-query";

const useGetBillingPeriodValidation = (tenantId) => {
    return useQuery(["getBillingPeriod", tenantId], () => Digit.MDMSService.getBillingPeriod(tenantId));
  };

export default useGetBillingPeriodValidation;