import { MdmsService, getGeneralCriteria } from "../../services/elements/MDMS";
import { useQuery } from "react-query";

export const useEngagementMDMS = (tenantId, moduleCode, type, config = {}, payload = []) =>{ 
    return useQuery(type, () => MdmsService.getDataByCriteria(tenantId, getGeneralCriteria(tenantId, moduleCode, type), moduleCode), config);
}