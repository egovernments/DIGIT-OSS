import { LocationService } from "../elements/Location";
import { StoreService } from "./Store/service";

export const getLocalities = {
  admin: async (tenant) => {
    await StoreService.defaultData(tenant, tenant, Digit.StoreData.getCurrentLanguage());
    return (await LocationService.getLocalities(tenant)).TenantBoundary[0];
  },
  revenue: async (tenant) => {
    await StoreService.defaultData(tenant, tenant, Digit.StoreData.getCurrentLanguage());
    return (await LocationService.getRevenueLocalities(tenant)).TenantBoundary[0];
  },
};
