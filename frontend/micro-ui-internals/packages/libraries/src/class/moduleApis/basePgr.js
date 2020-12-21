import Urls from "../../services/urls";
import { Request } from "../../services/Utils/Request";

class PGRBaseService {
  constructor() {}
  search = (stateCode, filters = {}) => {
    console.log("----------------------------", filters);
    return Request({
      url: Urls.pgr_search,
      useCache: false,
      method: "POST",
      auth: true,
      userService: true,
      params: { tenantId: stateCode, ...filters },
    });
  };

  create = (details, stateCode) =>
    Request({
      url: Urls.PGR_Create,
      data: details,
      useCache: true,
      userInfo: true,
      method: "POST",
      params: { tenantId: stateCode },
      auth: true,
    });

  update = (details, stateCode) =>
    Request({
      url: Urls.pgr_update,
      data: details,
      useCache: true,
      auth: true,
      method: "POST",
      params: { tenantId: stateCode },
    });

  count = (details, stateCode) =>
    Request({
      url: Urls.MDMS,
      data: details,
      useCache: true,
      method: "POST",
      params: { tenantId: stateCode },
    });

  inboxFilter = (params = {}, details = {}, stateCode) => {
    return Request({
      // url: "https://run.mocky.io/v3/597a50a0-90e5-4a45-b82e-8a2186b760bd",
      url: "https://run.mocky.io/v3/4334951e-c395-4ffa-91c1-203be5b0e0ff",
      data: details,
      useCache: true,
      params: { tenantId: stateCode, ...params.params },
    });
  };

  employeeSearch = (cityCode, roles) => {
    return Request({
      url: Urls.EmployeeSearch,
      params: { tenantId: cityCode, roles: roles },
      auth: true,
    });
  };
}

export const basePGRobj = new PGRBaseService();
