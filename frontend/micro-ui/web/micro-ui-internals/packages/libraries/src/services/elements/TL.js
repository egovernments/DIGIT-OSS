import Urls from "../atoms/urls";
import { Request } from "../atoms/Utils/Request";

export const TLService = {
  create: (details, tenantId) =>
    Request({
      url: Urls.tl.create,
      data: details,
      useCache: false,
      setTimeParam: false,
      userService: true,
      method: "POST",
      params: {},
      auth: true,
    }),
  search: (details) =>
    Request({
      url: Urls.tl.search,
      useCache: false,
      setTimeParam: false,
      userService: true,
      method: "POST",
      params: details,
      auth: true,
    }),
  search_bill: ({ tenantId, filters }) =>
    Request({
      url: filters.businesService !== "PT" ? Urls.mcollect.search_bill : Urls.mcollect.search_bill_pt,
      useCache: false,
      method: "POST",
      data: { searchCriteria: { tenantId, ...filters } },
      auth: true,
      userService: false,
      //params: { tenantId, ...filters },
    }),
  TLsearch: ({ tenantId, filters }) =>
     Request({
      url: Urls.tl.search,
      useCache: false,
      method: "POST",
      auth: true,
      userService: false,
      params: { tenantId, ...filters },
    }),
  update: (details, tenantId) =>
    Request({
      url: Urls.tl.update,
      data: details,
      useCache: false,
      setTimeParam: false,
      userService: true,
      method: "POST",
      params: {},
      auth: true,
    }),
  billingslab: ({ tenantId, filters, auth }) =>
    Request({
      url: Urls.tl.billingslab,
      useCache: false,
      setTimeParam: false,
      userService: true,
      method: "POST",
      params: { tenantId },
      auth: true,
    }),
  TLOpensearch: ({ tenantId, filters }) =>
    Request({
     url: Urls.tl.search,
     useCache: false,
     method: "POST",
     auth: false ,
     userService: false,
     params: { tenantId, ...filters },
   }),
};
