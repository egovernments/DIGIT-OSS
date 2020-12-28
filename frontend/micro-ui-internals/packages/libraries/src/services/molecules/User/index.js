import Urls from "../../atoms/urls";
import { ServiceRequest } from "../../atoms/Utils/Request";
import { Storage } from "../../atoms/Utils/Storage";

export const UserService = {
  authenticate: (details) => {
    const params = new URLSearchParams();
    Object.entries(details).forEach(([key, value]) => params.append(key, value));
    params.append("scope", "read");
    params.append("grant_type", "password");
    return ServiceRequest({
      serviceName: "authenticate",
      url: Urls.Authenticate,
      params,
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
  sendOtp: (details, stateCode = "pb") =>
    ServiceRequest({
      serviceName: "sendOtp",
      url: Urls.OTP_Send,
      data: details,
      auth: false,
      params: { tenantId: stateCode },
    }),
  setUser: () => {
    return Digit.SessionStorage.set("User");
  },
  registerUser: (details, stateCode = "pb") =>
    ServiceRequest({
      serviceName: "registerUser",
      url: Urls.RegisterUser,
      data: {
        User: details,
      },
      params: { tenantId: stateCode },
    }),
  updateUser: async (details, stateCode = "pb") =>
    ServiceRequest({
      serviceName: "updateUser",
      url: Urls.UserProfileUpdate,
      auth: true,
      data: {
        user: details,
      },
      params: { tenantId: stateCode },
    }),
};
