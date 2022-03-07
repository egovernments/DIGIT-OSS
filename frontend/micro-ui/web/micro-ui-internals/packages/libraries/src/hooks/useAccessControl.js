import { useMutation, useQuery } from "react-query";
import { AccessControlService } from "../services/elements/Access";
//custom hooks for useAccessControl using async await
export const useAccessControl = async ({ tenantId }) => {
  const data = await AccessControlService.getAccessControl({ tenantId });
  console.log("useAccessControl data", data);
};
