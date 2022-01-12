import { OBPSService } from "../../elements/OBPS"

export const Search = {
  scrutinyDetails: async (tenantId, params, data, all = false) => {
    const response = await OBPSService.scrutinyDetails(tenantId, params, data);
    if (window.location.href.includes("bpa/inbox")) {
      return response?.edcrDetail
    } else if(response == "No Record Found" && (window.location.href.includes("/basic-details") || window.location.href.includes("/basic-details"))) {
      return "BPA_NO_RECORD_FOUND"
    } else {
      return response?.edcrDetail?.[0]
    }
    // return window.location.href.includes("bpa/inbox") ? response?.edcrDetail : response?.edcrDetail?.[0];
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
