import { StoreService } from "../Store/service";
import { UserService } from "../../elements/User";

export const ULBService = {
  getCurrentTenantId: () => {
    // TODO: change when setter is done.
    const user = UserService.getUser();
    if (user?.extraRoleInfo) {
      const isDsoRoute = Digit.Utils.detectDsoRoute(window.location.pathname);
      // Check if route is employee route
      // if (window.location.pathname.split("/").includes("employee")) return user.extraRoleInfo.tenantId;
      // if (window.location.pathname.split("/").includes("dso-dashboard")) return user.extraRoleInfo.tenantId;
      if (isDsoRoute) {
        return user.extraRoleInfo?.tenantId;
      }
    }
    //TODO: fix tenant id from userinfo
    const tenantId =
      user?.info?.type === "EMPLOYEE" && user?.info?.tenantId ? user?.info?.tenantId : globalConfigs.getConfig("STATE_LEVEL_TENANT_ID");
    return tenantId;
  },
  getCurrentUlb: () => {
    const initData = StoreService.getInitData();
    const tenantId = ULBService.getCurrentTenantId();
    return initData.tenants.find((tenant) => tenant.code === tenantId);
  },
};
