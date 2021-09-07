import { MdmsService } from "../../services/elements/MDMS";
import { useQuery } from "react-query";

const useTradeLicenseMDMS = (tenantId, moduleCode, type, filter, config = {}) => {
  const useTLDocuments = () => {
    return useQuery("TL_DOCUMENTS", () => MdmsService.getTLDocumentRequiredScreen(tenantId, moduleCode, type), config);
  };
  const useStructureType = () => {
    return useQuery("TL_STRUCTURE_TYPE", () => MdmsService.getTLStructureType(tenantId, moduleCode, type), config);
  };
  const useTradeUnitsData = () => {
    return useQuery("TL_TRADE_UNITS", () => MdmsService.getTradeUnitsData(tenantId, moduleCode, type, filter), config);
  };
  const useTradeOwnerShipCategory = () => {
    return useQuery("TL_TRADE_OWNERSHIP_CATEGORY", () => MdmsService.GetTradeOwnerShipCategory(tenantId, moduleCode, type), config);
  };
  const useTLAccessoriesType = () => {
    return useQuery("TL_TRADE_ACCESSORY_CATEGORY", () => MdmsService.getTLAccessoriesType(tenantId, moduleCode, type), config);
  };
  const useTLFinancialYear = () => {
    return useQuery("TL_TRADE_FINANCIAL_YEAR", () => MdmsService.getTLFinancialYear(tenantId, moduleCode, type), config);
  };
  const _default = () => {
    return useQuery([tenantId, moduleCode, type], () => MdmsService.getMultipleTypes(tenantId, moduleCode, type), config);
  };

  switch (type) {
    case "TLDocuments":
      return useTLDocuments();
    case "StructureType":
      return useStructureType();
    case "TradeUnits":
      return useTradeUnitsData();
    case "TLOwnerShipCategory":
      return useTradeOwnerShipCategory();
    case "AccessoryCategory":
      return useTLAccessoriesType();
    case "FinancialYear":
      return useTLFinancialYear();
    default:
      return _default();
  }
};

export default useTradeLicenseMDMS;
