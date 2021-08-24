import { OBPSService } from "../../elements/OBPS"

export const Search = {
  scrutinyDetails: async (tenantId, params, data) => {
    const response = await OBPSService.scrutinyDetails(tenantId, params, data);
    return response?.edcrDetail?.[0];
  },
  NOCDetails: async (tenantId, params) => {
    const response = await OBPSService.NOCSearch(tenantId, params);
    return response?.Noc;
  },
  BPADetails: async (tenantId, params) => {
    const response = await OBPSService.BPASearch(tenantId, params);
    return response?.BPA;
  }
} 
