import Urls from "../../atoms/urls";
import { ServiceRequest } from "../../atoms/Utils/Request";
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
        authorization: "Basic ZWdvdi11c2VyLWNsaWVudDplZ292LXVzZXItc2VjcmV0",
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
    if (userType === "citizen") {
      window.localStorage.setItem("Citizen.user-info", "{}");
      window.localStorage.setItem("Citizen.token", "");
      window.localStorage.setItem("Citizen.refresh-token", "");
      window.localStorage.setItem("token", "");
      window.localStorage.setItem(".refresh-token", "");
      window.location.replace("/citizen");
    } else {
      window.localStorage.setItem("Employee.user-info", "{}");
      window.localStorage.setItem("Employee.token", "");
      window.localStorage.setItem("Employee.refresh-token", "");
      window.localStorage.setItem("token", "");
      window.localStorage.setItem(".refresh-token", "");
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
    const { roles } = Digit.UserService.getUser().info;
    return roles.filter((role) => accessTo.includes(role.code)).length;
  },
};
