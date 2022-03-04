import { Request } from "../atoms/Utils/Request";
import Urls from "../atoms/urls";

export const AccessControlService = {
  getAccessControl: (tenantId, details) =>
    Request({
      url: Urls.access_control,
      method: "POST",
      params: { tenantId, ...details },
      auth: true,
    }),
};
