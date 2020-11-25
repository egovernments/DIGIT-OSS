import Urls from "./urls";
import { Request } from "./Utils/Request";

export const PGRService = {
  search: (stateCode = "pb", filters = {}) =>
    Request({
      url: Urls.pgr_search,
      useCache: false,
      userInfo: true,
      method: "POST",
      auth: true,
      userService: true,
      params: { tenantId: stateCode, ...filters },
    }),
  create: (details, stateCode = "pb") =>
    Request({
      url: Urls.MDMS,
      data: details,
      useCache: true,
      method: "POST",
      params: { tenantId: stateCode },
    }),
  update: (details, stateCode = "pb") =>
    Request({
      url: Urls.pgr_update,
      data: details,
      useCache: true,
      auth: true,
      method: "POST",
      params: { tenantId: stateCode },
    }),
  count: (details, stateCode = "pb") =>
    Request({
      url: Urls.MDMS,
      data: details,
      useCache: true,
      method: "POST",
      params: { tenantId: stateCode },
    }),
};
