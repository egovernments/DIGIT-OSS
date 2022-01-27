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
  fetchPaymentDetails: ({ tenantId, consumerCodes, auth = true }) =>
    Request({
      url: Urls.ws.fetch_payment_details,
      useCache: false,
      method: "POST",
      auth: auth === false ? auth : true,
      userService: auth === false ? auth : true,
      params: { tenantId, consumerCode: consumerCodes, businessService: "PT" },
    }),
};
