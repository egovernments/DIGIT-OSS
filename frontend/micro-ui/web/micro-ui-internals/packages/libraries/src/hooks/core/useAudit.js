import { useQuery, useQueryClient } from "react-query";

const useAudit = ({ tenantId, filters }, config = {}) => {
  const client = useQueryClient();
  const args = tenantId ? { tenantId, filters } : { filters };
  const { isLoading, error, data } = useQuery(["AuditList", tenantId, filters], () => Digit.AuditService.audit_log(args), config);
  return { isLoading, error, data, revalidate: () => client.invalidateQueries(["AuditList", tenantId, filters]) };
};

export default useAudit;
