import { MdmsService, getGeneralCriteria } from "../../services/elements/MDMS";
import { useQuery } from "react-query";

const useMDMS = (tenantId, moduleCode, type, config = {}, payload = []) => {
  const useFinancialYears = () => {
    return useQuery("PT_FINANCIAL_YEARLS", () => MdmsService.getDataByCriteria(tenantId, payload, moduleCode));
  };

  const usePropertyTaxDocuments = () => {
    return useQuery("PT_PROPERTY_TAX_DOCUMENTS", () => MdmsService.getDataByCriteria(tenantId, payload, moduleCode));
  };

  switch (type) {
    case "FINANCIAL_YEARLS":
      return useFinancialYears();
    case "PROPERTY_TAX_DOCUMENTS":
      return usePropertyTaxDocuments();
    default:
      return useQuery(type, () => MdmsService.getDataByCriteria(tenantId, getGeneralCriteria(tenantId, moduleCode, type), moduleCode), config);
  }
};

export default useMDMS;
