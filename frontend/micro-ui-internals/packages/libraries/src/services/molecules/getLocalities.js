import { LocationService } from "../elements/Location";

export const getLocalities = {
  admin: async (tenant) => {
    return (await LocationService.getLocalities(tenant)).TenantBoundary[0];
  },
  revenue: async (tenant) => {
    // console.log("find me here", tenant)
    return (await LocationService.getRevenueLocalities(tenant)).TenantBoundary[0];
  },
};
