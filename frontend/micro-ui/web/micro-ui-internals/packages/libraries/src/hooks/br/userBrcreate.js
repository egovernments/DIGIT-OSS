import { useQuery, useMutation } from "react-query";

import BRService from "../../services/elements/BR";

export const useBRCreate = (tenantId, config = {}) => {
  return useMutation((data) => BRService.create(data, tenantId));
};

export default useBRCreate;
