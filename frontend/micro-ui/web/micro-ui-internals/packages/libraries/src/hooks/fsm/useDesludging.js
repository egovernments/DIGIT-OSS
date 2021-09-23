import { FileDesludging } from "../../services/molecules/FSM/FileDesludging";
import { useQuery, useMutation } from "react-query";

const useDesludging = (tenantId, config = {}) => {
  return useMutation((data) => FileDesludging.create(tenantId, data));
};

export default useDesludging;
