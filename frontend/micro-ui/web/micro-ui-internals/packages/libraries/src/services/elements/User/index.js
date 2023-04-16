import Urls from "../../atoms/urls";
import { Request, ServiceRequest } from "../../atoms/Utils/Request";
import { Storage } from "../../atoms/Utils/Storage";

export const UserService = {
  authenticate: async(details) => {
    const data = new URLSearchParams();
    Object.entries(details).forEach(([key, value]) => data.append(key, value));
    data.append("scope", "read");
    data.append("grant_type", "password");
    
    let authResponse= await ServiceRequest({
      serviceName: "authenticate",
      url: Urls.Authenticate,
      data,
      headers: {
        authorization: `Basic ${window?.globalConfigs?.getConfig("JWT_TOKEN")||"ZWdvdi11c2VyLWNsaWVudDo="}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
      const invalidRoles = window?.globalConfigs?.getConfig("INVALIDROLES") || [];
      if (invalidRoles && invalidRoles.length > 0 && authResponse && authResponse?.UserRequest?.roles?.some((role) => invalidRoles.includes(role.code))) {
        throw new Error("ES_ERROR_USER_NOT_PERMITTED");
      }
      return authResponse;
  },
  logoutUser: () => {
    let user = UserService.getUser();
    if (!user || !user.info || !user.access_token) return false;
    const { type } = user.info;
    return ServiceRequest({
      serviceName: "logoutUser",
      url: Urls.UserLogout,
      data: { access_token: user?.access_token },
      auth: true,
      params: { tenantId: type === "CITIZEN" ? Digit.ULBService.getStateId() : Digit.ULBService.getCurrentTenantId() },
    });
  },
  getType: () => {
    return Storage.get("userType") || "citizen";
  },
  setType: (userType) => {
    Storage.set("userType", userType);
    Storage.set("user_type", userType);
  },
  getUser: () => {
    return Digit.SessionStorage.get("User");
  },
  logout: async () => {
    const userType = UserService.getType();
    try {
      await UserService.logoutUser();
    } catch (e) {
    }
    finally{
      window.localStorage.clear();
      window.sessionStorage.clear();
      if (userType === "citizen") {
        window.location.replace(`/${window?.contextPath}/citizen`);
      } else {
        window.location.replace(`/${window?.contextPath}/employee/user/language-selection`);
      }
    }
  },
  sendOtp: (details, stateCode) =>
    ServiceRequest({
      serviceName: "sendOtp",
      url: Urls.OTP_Send,
      data: details,
      auth: false,
      params: { tenantId: stateCode },
    }),
  setUser: (data) => {
    return Digit.SessionStorage.set("User", data);
  },
  setExtraRoleDetails: (data) => {
    const userDetails = Digit.SessionStorage.get("User");
    return Digit.SessionStorage.set("User", { ...userDetails, extraRoleInfo: data });
  },
  getExtraRoleDetails: () => {
    return Digit.SessionStorage.get("User")?.extraRoleInfo;
  },
  registerUser: (details, stateCode) =>
    ServiceRequest({
      serviceName: "registerUser",
      url: Urls.RegisterUser,
      data: {
        User: details,
      },
      params: { tenantId: stateCode },
    }),
  updateUser: async (details, stateCode) =>
    ServiceRequest({
      serviceName: "updateUser",
      url: Urls.UserProfileUpdate,
      auth: true,
      data: {
        user: details,
      },
      params: { tenantId: stateCode },
    }),
  hasAccess: (accessTo) => {
    const user = Digit.UserService.getUser();
    if (!user || !user.info) return false;
    const { roles } = user.info;
    return roles && Array.isArray(roles) && roles.filter((role) => accessTo.includes(role.code)).length;
  },

  changePassword: (details, stateCode) =>
    ServiceRequest({
      serviceName: "changePassword",
      url: Digit.SessionStorage.get("User")?.info ? Urls.ChangePassword1 : Urls.ChangePassword,
      data: {
        ...details,
      },
      auth: true,
      params: { tenantId: stateCode },
    }),

  employeeSearch: (tenantId, filters) => {
    return Request({
      url: Urls.EmployeeSearch,
      params: { tenantId, ...filters },
      auth: true,
    });
  },
  userSearch: async (tenantId, data, filters) => {
    
    return ServiceRequest({
      url: Urls.UserSearch,
      params: { ...filters },
      method: "POST",
      auth: true,
      useCache: true,
      userService: true,
      data: data.pageSize ? { tenantId, ...data } : { tenantId, ...data, pageSize: "100" },
    });
  },
};
