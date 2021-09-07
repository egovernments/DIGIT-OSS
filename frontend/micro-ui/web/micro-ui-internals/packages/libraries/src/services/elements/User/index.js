import Urls from "../../atoms/urls";
import { Request, ServiceRequest } from "../../atoms/Utils/Request";
import { Storage } from "../../atoms/Utils/Storage";

export const UserService = {
  authenticate: (details) => {
    const data = new URLSearchParams();
    Object.entries(details).forEach(([key, value]) => data.append(key, value));
    data.append("scope", "read");
    data.append("grant_type", "password");
    return ServiceRequest({
      serviceName: "authenticate",
      url: Urls.Authenticate,
      data,
      headers: {
        authorization: "Basic ZWdvdi11c2VyLWNsaWVudDo=",
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
  },
  getType: () => {
    return Storage.get("userType") || "citizen";
  },
  getUser: () => {
    return Digit.SessionStorage.get("User");
  },
  logout: () => {
    const userType = UserService.getType();
    Digit.SessionStorage.set("User", {});
    window.localStorage.clear();
    window.sessionStorage.clear();
    if (userType === "citizen") {
      window.location.replace("/digit-ui/citizen");
    } else {
      window.location.replace("/employee");
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
      url: Urls.ChangePassword,
      data: {
        ...details,
      },
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
    return Request({
      url: Urls.UserSearch,
      params: { ...filters },
      method: "POST",
      auth: true,
      userService: true,
      data: data.pageSize ? { tenantId, ...data } : { tenantId, ...data, pageSize: "100" },
    });
  },
};
