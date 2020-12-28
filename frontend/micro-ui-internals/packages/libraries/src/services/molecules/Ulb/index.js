import { StoreService } from "../Store/service";
import { UserService } from "../User";

export const ULBService = {
  getCurrentTenantId: () => {
    // TODO: change when setter is done.
    const user = UserService.getUser();
    //TODO: fix tenant id from userinfo
    const tenantId = user?.info.type === "CITIZEN" ? "pb.amritsar" : user?.info?.tenantId;
    return tenantId;
  },
  getCurrentUlb: () => {
    const initData = StoreService.getInitData();
    const tenantId = ULBService.getCurrentTenantId();
    return initData.tenants.find((tenant) => tenant.code === tenantId);
  },
};
