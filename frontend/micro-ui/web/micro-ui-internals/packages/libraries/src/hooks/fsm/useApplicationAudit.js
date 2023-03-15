import { FSMService } from "../../services/elements/FSM";
import { useQuery, useQueryClient } from "react-query";

const useApplicationAudit = (tenantId, filters) => {
  const client = useQueryClient();
  const query = useQuery(["FSM_APPLICATION_AUDIT", filters], () => FSMService.audit(tenantId, filters));
  return { ...query, revalidate: () => client.invalidateQueries(["FSM_APPLICATION_AUDIT", filters]) };
};

export default useApplicationAudit;
