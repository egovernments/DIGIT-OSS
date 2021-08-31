import Urls from "../atoms/urls";
import { Request } from "../atoms/Utils/Request";

export const FSMService = {
  search: (tenantId, filters = {}) =>
    Request({
      url: Urls.engagement.search,
      useCache: false,
      method: "POST",
      auth: true,
      userService: false,
      params: { tenantId, ...filters },
    }),
  create: (tenantId, details) =>
    Request({
      url: Urls.engagement.create,
      data: details,
      useCache: true,
      userService: true,
      method: "POST",
      params: { tenantId },
      auth: true,
    }),
};
