import { useQuery, useQueryClient } from "react-query";

export const useBPAREGgetbill = ({ tenantId, businessService, ...filters }, config = {}) => {
    const queryClient = useQueryClient();
    const params = { businessService, ...filters };
  
    const _tenantId = tenantId || Digit.UserService.getUser()?.info?.tenantId;
  
    const { isLoading, error, isError, data, status } = useQuery(
      ["billsForBuisnessService", businessService, { ...filters }, config],
      () => Digit.OBPSService.BPAREGGetBill(_tenantId, params),
      {
        retry: (count, err) => {
          return false;
        },
        ...config,
      }
    );
    return {
      isLoading,
      error,
      isError,
      data,
      status,
      revalidate: () => queryClient.invalidateQueries(["billsForBuisnessService", businessService]),
    };
  };