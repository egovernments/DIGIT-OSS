import { StoreService } from "../Store/service";
import { UserService } from "../User";

export const ULBService = {
  getCurrentUlb: () => {
    const initData = StoreService.getInitData();
    const user = UserService.getUser();
    //TODO: fix tenant id from userinfo
    const tenantId = user?.info.type === "CITIZEN" ? "pb.amritsar" : user?.info?.tenantId;
    return initData.tenants.find((tenant) => tenant.code === tenantId);
  },
};
