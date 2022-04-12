import { StoreService } from "../Store/service";
import { UserService } from "../../elements/User";

/**
 * Custom service which can be used to
 * get current tenantId
 * get state tenant
 * get current ulb
 * get citizen selected tenant
 * get all ulbs of employee
 *
 * @author jagankumar-egov
 *
 * @example
 * Digit.ULBService.getCurrentTenantId()
 *
 * @returns {Object} Returns based on the called function
 */
export const ULBService = {
  /**
   * Custom method to get employee's current selected city
   *
   * @author jagankumar-egov
   *
   * @example
   * Digit.ULBService.getCurrentTenantId()
   *
   * @returns {String}
   */
  getCurrentTenantId: () => {
    // TODO: change when setter is done.
    const user = UserService.getUser();
    if (user?.extraRoleInfo) {
      const isDsoRoute = Digit.Utils.detectDsoRoute(window.location.pathname);
      if (isDsoRoute) {
        return user.extraRoleInfo?.tenantId;
      }
    }
    //TODO: fix tenant id from userinfo
    const tenantId =
      user?.info?.type === "EMPLOYEE" && user?.info?.tenantId ? user?.info?.tenantId : window?.globalConfigs.getConfig("STATE_LEVEL_TENANT_ID");
    return tenantId;
  },
  /**
   * Custom method to get current environment home / state tenant
   *
   * @author jagankumar-egov
   *
   * @example
   * Digit.ULBService.getStateId()
   *
   * @returns {String}
   */
  getStateId: () => {
    return window?.globalConfigs?.getConfig("STATE_LEVEL_TENANT_ID");
  },
  /**
   * Custom method to get employee's current ulb object
   *
   * @author jagankumar-egov
   *
   * @example
   * Digit.ULBService.getCurrentUlb()
   *
   * @returns {Object}
   */
  getCurrentUlb: () => {
    const initData = StoreService.getInitData();
    const tenantId = ULBService.getCurrentTenantId();
    return initData.tenants.find((tenant) => tenant.code === tenantId);
  }
  /**
   * Custom method to get citizen's current selected city
   *
   * @author jagankumar-egov
   *
   * @example
   * Digit.ULBService.getCitizenCurrentTenant() -> will return selected home city if not loggedin users city if not state tenant
   *
   * Digit.ULBService.getCitizenCurrentTenant(true) -> will return selected home city
   * 
   * @returns {String}
   */,
  getCitizenCurrentTenant: (selectedCity=false) => {
    const homeCity=Digit.SessionStorage.get("CITIZEN.COMMON.HOME.CITY")?.code;
    if(selectedCity){
      return homeCity;
    }
    return homeCity|| Digit.UserService.getUser()?.info?.permanentCity || ULBService.getStateId();
  },
  /**
   * Custom method to get all ulb's which the loggedin employee has access to
   *
   *
   * @example
   * Digit.ULBService.getUserUlbs()
   *
   * @returns {Array}   array of objects in the following structure
   *
   *        [ {
   *         i18nKey:"",
   *         value:"",
   *         code:"",
   *         name:""
   *                 }]
   */
  getUserUlbs: (userRole = "") => {
    const stringReplaceAll = (str = "", searcher = "", replaceWith = "") => {
      if (searcher == "") return str;
      while (str?.includes(searcher)) {
        str = str?.replace(searcher, replaceWith);
      }
      return str;
    };

    const userloggedValues = Digit.SessionStorage.get("citizen.userRequestObject");
    let teantsArray = [],
      filteredArray = [];
    if (userRole === "") {
      userloggedValues?.info?.roles?.forEach((role) => teantsArray.push(role.tenantId));
      let unique = teantsArray.filter((item, i, ar) => ar.indexOf(item) === i);

      unique?.forEach((uniCode) => {
        filteredArray.push({
          i18nKey: `TENANT_TENANTS_${stringReplaceAll(uniCode, ".", "_")?.toUpperCase()}`,
          value: uniCode,
          code: uniCode,
          name: uniCode.substring(uniCode.indexOf(".") + 1),
        });
      });
      return filteredArray;
    } else {
      userloggedValues?.info?.roles?.forEach((role) => {
        if (userRole === role.code) teantsArray.push(role.tenantId);
      });
      let unique = teantsArray.filter((item, i, ar) => ar.indexOf(item) === i);
      unique?.forEach((uniCode) => {
        filteredArray.push({
          i18nKey: `TENANT_TENANTS_${stringReplaceAll(uniCode, ".", "_")?.toUpperCase()}`,
          value: uniCode,
          code: uniCode,
          name: uniCode.substring(uniCode.indexOf(".") + 1),
        });
      });
      return filteredArray;
    }
  },
};
