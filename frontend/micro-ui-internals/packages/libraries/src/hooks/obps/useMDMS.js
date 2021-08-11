import { useQuery } from "react-query";
import { MdmsService } from "../../services/elements/MDMS";

const useMDMS = (tenantId, moduleCode, type, config = {}, payload = []) => {
  const queryConfig = { staleTime: Infinity, ...config };
  const useDocumentMapping = () => {
    return useQuery('DOCUMENT_MAPPING', () => MdmsService.getDocumentTypes(tenantId, moduleCode, type), queryConfig);
  }
  switch (type) {
    case "DocumentTypes":
      return useDocumentMapping()
  }
}

export default useMDMS; 