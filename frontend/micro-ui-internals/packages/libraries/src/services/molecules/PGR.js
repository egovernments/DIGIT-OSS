import Urls from "../atoms/urls";
import { Request } from "../atoms/Utils/Request";

export const PGRService = {
  search: (tenantId, filters = {}) => {
    // console.log("----------------------------", filters);
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

  employeeSearch: (tenantId, roles) => {
    return Request({
      url: Urls.EmployeeSearch,
      params: { tenantId, roles },
      auth: true,
    });
  },
};
