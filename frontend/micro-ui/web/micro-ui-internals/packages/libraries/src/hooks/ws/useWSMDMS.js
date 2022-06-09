import { useQuery } from "react-query";
import { MdmsService } from "../../services/elements/MDMS";

const useWSMDMS = (tenantId, moduleCode, type, config = {}, payload = []) => {
  const queryConfig = { staleTime: Infinity, ...config };
  const useDocumentMapping = () => {
    return useQuery('DOCUMENT_MAPPING', () => MdmsService.getDocumentTypes(tenantId, moduleCode, type), queryConfig);
  }
  const useTradeTypetoRoleMapping = () => {
    return useQuery('ROLE_DOCUMENT_MAPPING', () => MdmsService.getTradeTypeRoleTypes(tenantId, moduleCode, type), queryConfig);
  }
  const useTaxHeadMasterMapping = () => {
    return useQuery("TAX_HEAD_MASTER", ()=> MdmsService.getWSTaxHeadMaster(tenantId, moduleCode, type), queryConfig)
  }
  const _default = () => {
    return useQuery([tenantId, moduleCode, type], () => MdmsService.getMultipleTypes(tenantId, moduleCode, type), config);
  };

  switch (type) {
    case "DocumentTypes":
      return useDocumentMapping();
    case "TradeTypetoRoleMapping":
      return useTradeTypetoRoleMapping();
    case "TaxHeadMaster":
      return useTaxHeadMasterMapping()
    default:
      return _default();
  }
}

export default useWSMDMS; 