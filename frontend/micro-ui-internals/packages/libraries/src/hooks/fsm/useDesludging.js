import { FileDesludging } from "../../services/molecules/FSM/FileDesludging";
import { useQuery } from "react-query";

const useDesludging = (data, tenantId, config = {}) => {
  return useQuery("FSM_NEW_DESLUDGING", () => FileDesludging.create(tenantId), config);
};

export default useDesludging;
