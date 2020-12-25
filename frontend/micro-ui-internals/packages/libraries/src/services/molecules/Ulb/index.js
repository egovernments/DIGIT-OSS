import { StoreService } from "../Store/service";
import { UserService } from "../User";

export const ULBService = {
  getCurrentUlb: () => {
    const initData = StoreService.getInitData();
    const user = UserService.getUser();
    const tenantId = user?.info?.tenantId;
    return initData.tenants.find((tenant) => tenant.code === tenantId);
  },
};
