import Urls from "../atoms/urls";
import { Request } from "../atoms/Utils/Request";

export const WSService = {
  search: ({ tenantId, filters, auth, businessService }) =>
    Request({
      url: businessService === "WS" ?Urls.ws.water_search : Urls.ws.sewarage_search,
      useCache: false,
      method: "POST",
      auth: filters?.locality?false:true,
      userService: filters?.locality?false:true,
      setTimeParam: false,
      params: { tenantId, ...filters },
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
};