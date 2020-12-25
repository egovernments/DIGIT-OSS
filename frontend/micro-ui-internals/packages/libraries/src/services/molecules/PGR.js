import Urls from "../atoms/urls";
import { Request } from "../atoms/Utils/Request";

export const PGRService = {
  search: (tenantId, filters = {}) => {
    console.log("----------------------------", filters);
    return Request({
      url: Urls.pgr_search,
      useCache: false,
      method: "POST",
      auth: true,
      userService: true,
      params: { tenantId: tenantId, ...filters },
    });
  },
  create: (details, tenantId) =>
    Request({
      url: Urls.PGR_Create,
      data: details,
      useCache: true,
      userInfo: true,
      method: "POST",
      params: { tenantId },
      auth: true,
    }),
  update: (details, tenantId) =>
    Request({
      url: Urls.pgr_update,
      data: details,
      useCache: true,
      auth: true,
      method: "POST",
      params: { tenantId },
    }),
  count: (details, tenantId) =>
    Request({
      url: Urls.MDMS,
      data: details,
      useCache: true,
      method: "POST",
      params: { tenantId },
    }),
  inboxFilter: (params = {}, details = {}, tenantId) => {
    return Request({
      // url: "https://run.mocky.io/v3/597a50a0-90e5-4a45-b82e-8a2186b760bd",
      url: "https://run.mocky.io/v3/4334951e-c395-4ffa-91c1-203be5b0e0ff",
      data: details,
      useCache: true,
      params: { tenantId: tenantId, ...params.params },
    });
  },
  employeeSearch: (tenantId, roles) => {
    return Request({
      url: Urls.EmployeeSearch,
      params: { tenantId, roles },
      auth: true,
    });
  },
};
