import Urls from "../atoms/urls";
import { Request } from "../atoms/Utils/Request";

export const WSService = {
  search: ({ tenantId, filters, auth, businessService }) =>
    Request({
      url: businessService === "WS" ? Urls.ws.water_search : Urls.ws.sewarage_search,
      useCache: false,
      method: "POST",
      auth: filters?.locality ? false : true,
      userService: filters?.locality ? false : true,
      setTimeParam: false,
      params: { tenantId, ...filters },
    }),
  update: (details, businessService) =>
    Request({
      url: businessService === "WATER" ? Urls.ws.water_update : Urls.ws.sewarage_update,
      data: details,
      useCache: false,
      setTimeParam: false,
      userService: true,
      method: "POST",
      params: {},
      auth: true,
    }),
  wsCalculationEstimate: (details, tenantId) =>
    Request({
      url: Urls.ws.ws_calculation_estimate,
      data: details,
      useCache: false,
      userService: true,
      method: "POST",
      params: { tenantId },
      auth: true,
    }),
  consumptionSearch: ({ tenantId, filters, auth, businessService }) =>
    Request({
      url: Urls.ws.ws_connection_search,
      useCache: false,
      userService: true,
      method: "POST",
      params: { tenantId, ...filters },
      auth: true,
    }),
};