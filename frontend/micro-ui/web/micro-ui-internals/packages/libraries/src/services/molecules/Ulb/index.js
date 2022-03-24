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
  getStateId: () => {
    return window?.globalConfigs?.getConfig("STATE_LEVEL_TENANT_ID");
  },
  getCurrentUlb: () => {
    const initData = StoreService.getInitData();
    const tenantId = ULBService.getCurrentTenantId();
    return initData.tenants.find((tenant) => tenant.code === tenantId);
  },
  //util function that returns the ulb dropdown data
  getUserUlbs:(userRole="") => {
    const stringReplaceAll = (str = "", searcher = "", replaceWith = "") => {
      if (searcher == "") return str;
      while (str?.includes(searcher)) {
        str = str?.replace(searcher, replaceWith);
      }
      return str;
    };
    
    const userloggedValues = Digit.SessionStorage.get("citizen.userRequestObject");
    let teantsArray = [], filteredArray = [];
    if(userRole===""){
      
      userloggedValues?.info?.roles?.forEach(role => teantsArray.push(role.tenantId));
      let unique = teantsArray.filter((item, i, ar) => ar.indexOf(item) === i);
    
      unique?.forEach(uniCode => {
        filteredArray.push({
          i18nKey: `TENANT_TENANTS_${stringReplaceAll(uniCode, ".", "_")?.toUpperCase()}`,
          value: uniCode,
          //label:t(`TENANT_TENANTS_${stringReplaceAll(uniCode, ".", "_")?.toUpperCase()}`),
          code : uniCode,
          name:uniCode.substring(uniCode.indexOf(".")+1)
        })
      });
      
      return filteredArray;
    }
    else{
      userloggedValues?.info?.roles?.forEach(role => {
        if(userRole === role.code)
          teantsArray.push(role.tenantId)});
      
      let unique = teantsArray.filter((item, i, ar) => ar.indexOf(item) === i)
    
      unique?.forEach(uniCode => {
        filteredArray.push({
          i18nKey: `TENANT_TENANTS_${stringReplaceAll(uniCode, ".", "_")?.toUpperCase()}`,
          value: uniCode,
          //label:t(`TENANT_TENANTS_${stringReplaceAll(uniCode, ".", "_")?.toUpperCase()}`),
          code : uniCode,
          name:uniCode.substring(uniCode.indexOf(".")+1)
        })
      });
      
      return filteredArray;
    }
  }
};
