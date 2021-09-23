import { useQuery, useQueryClient } from "react-query";

const useMCollectCount = (tenantId, config = {}) => {
  return useQuery(["MCOLLECT_COUNT", tenantId], () => Digit.MCollectService.count(tenantId), config);
};

export default useMCollectCount;
