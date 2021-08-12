import { OBPSService } from "../../elements/OBPS"

export const Search = {
  scrutinyDetails: async (tenantId, params, data) => {
    const response = await OBPSService.scrutinyDetails(tenantId, params, data);
    return response?.edcrDetail?.[0];
  }
} 
