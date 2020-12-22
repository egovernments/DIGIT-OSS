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

  employeeSearch = (cityCode, roles) => {
    return Request({
      url: Urls.EmployeeSearch,
      params: { tenantId: cityCode, roles: roles },
      auth: true,
    });
  };
}

export const basePGRobj = new PGRBaseService();
