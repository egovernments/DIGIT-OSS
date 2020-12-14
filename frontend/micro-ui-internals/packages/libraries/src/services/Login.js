import Axios from "axios";
import Urls from "./urls";
import { Request } from "./Utils/Request";

export const LoginService = {
  sendOtp: (details, stateCode = "pb") =>
    Request({
      url: Urls.OTP_Send,
      data: details,
      auth: false,
      method: "POST",
      params: { tenantId: stateCode },
    }),
  authenticate: async (details, stateCode = "pb") => {
    const params = new URLSearchParams();
    Object.entries(details).forEach(([key, value]) => params.append(key, value));
    params.append("scope", "read");
    params.append("grant_type", "password");
    const config = {
      url: Urls.Authenticate,
      method: "post",
      params,
      headers: {
        authorization: "Basic ZWdvdi11c2VyLWNsaWVudDplZ292LXVzZXItc2VjcmV0",
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };

    return Axios(config);
  },
  registerUser: async (details, stateCode = "pb") =>
    Request({
      url: Urls.Register_User,
      data: {
        User: details,
      },
      method: "POST",
      params: { tenantId: stateCode },
    }),
  updateUser: async (details, stateCode = "pb") =>
    Request({
      url: Urls.UserProfileUpdate,
      auth: true,
      data: {
        user: details,
      },
      method: "POST",
      params: { tenantId: stateCode },
    }),
};
