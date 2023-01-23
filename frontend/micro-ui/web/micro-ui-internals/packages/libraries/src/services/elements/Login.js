import Axios from "axios";
import Urls from "../atoms/urls";
import { Request } from "../atoms/Utils/Request";

export const LoginService = {
  sendOtp: (details, stateCode) =>
    Request({
      url: Urls.OTP_Send,
      data: details,
      auth: false,
      method: "POST",
      params: { tenantId: stateCode },
    }),
  authenticate: async (details, stateCode) => {
    const params = new URLSearchParams();
    Object.entries(details).forEach(([key, value]) => params.append(key, value));
    params.append("scope", "read");
    params.append("grant_type", "password");
    const config = {
      url: Urls.Authenticate,
      method: "post",
      params,
      headers: {
        authorization: `Basic ${window?.globalConfigs?.getConfig("JWT_TOKEN")||"ZWdvdi11c2VyLWNsaWVudDo="}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };

    return Axios(config);
  },
  registerUser: async (details, stateCode) =>
    Request({
      url: Urls.Register_User,
      data: {
        User: details,
      },
      method: "POST",
      params: { tenantId: stateCode },
    }),
  updateUser: async (details, stateCode) =>
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
