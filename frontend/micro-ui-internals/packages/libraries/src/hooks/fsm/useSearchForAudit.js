import { FSMService } from "../../services/elements/FSM";
import { useQuery, useQueryClient } from "react-query";

const useSearchForAuditData = (tenantId, filters, options = {}) => {
  const client = useQueryClient();
  const query = useQuery(["FSM_APPLICATION_AUDIT", filters], () => FSMService.search(tenantId, filters), options);
  return { ...query, revalidate: () => client.invalidateQueries(["FSM_APPLICATION_AUDIT", filters]) };
};

export default useSearchForAuditData;
