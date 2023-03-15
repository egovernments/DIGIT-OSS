import Urls from "../atoms/urls";
import { Request } from "../atoms/Utils/Request";

export const WSService = {
  create: (details, businessService) =>
    Request({
      url: businessService === "WATER" ? Urls.ws.water_create : Urls.ws.sewarage_create,
      data: details,
      useCache: false,
      setTimeParam: false,
      userService: true,
      method: "POST",
      params: {},
      auth: true,
    }),
  createBillAmendment: ({ filters }) =>
    Request({
      url: Urls.ws.billAmendmentCreate,
      method: "POST",
      auth: true,
      userService: true,
      data: { ...filters },
    }),
  search: ({ tenantId, filters, businessService }) =>
    Request({
      url: businessService === "WS" ? Urls.ws.water_search : Urls.ws.sewarage_search,
      useCache: false,
      method: "POST",
      auth: filters?.locality ? false : true,
      userService: filters?.locality ? false : true,
      setTimeParam: false,
      params: { tenantId, ...filters },
    }),
  WSWatersearch: ({ tenantId, filters }) =>
    Request({
      url: Urls.ws.water_search,
      useCache: false,
      method: "POST",
      auth: true,
      userService: false,
      params: { tenantId, ...filters },
    }),
  WSSewsearch: ({ tenantId, filters }) =>
    Request({
      url: Urls.ws.sewarage_search,
      useCache: false,
      method: "POST",
      auth: true,
      userService: false,
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
  updateBillAmend: (details) => {
    return Request({
      url: Urls.ws.billAmendmentUpdate,
      data: details,
      useCache: false,
      setTimeParam: false,
      userService: true,
      method: "POST",
      params: {},
      auth: true,
    });
  },
  wsCalculationEstimate: (details, businessService) =>
    Request({
      url: businessService === "WS" ? Urls.ws.ws_calculation_estimate : Urls.ws.sw_calculation_estimate,
      data: details,
      useCache: false,
      setTimeParam: false,
      userService: true,
      method: "POST",
      params: {},
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
  paymentsearch: ({ tenantId, filters, auth, BusinessService }) =>
    Request({
      url: BusinessService === "WS" ? Urls.ws.ws_payment_search : Urls.ws.sw_payment_search,
      useCache: false,
      method: "POST",
      auth: auth === false ? auth : true,
      userService: auth === false ? auth : true,
      params: { tenantId, ...filters },
    }),
  meterConnectioncreate: (details, businessService) =>
    Request({
      url: businessService === "WS" ? Urls.ws.ws_meter_conncetion_create : Urls.ws.sw_meter_conncetion_create,
      data: details,
      useCache: false,
      setTimeParam: false,
      userService: true,
      method: "POST",
      params: {},
      auth: true,
    }),
  wnsGroupBill: (filters) =>
    Request({
      url: Urls.ws.wns_group_bill,
      useCache: false,
      method: "POST",
      auth: true,
      userService: true,
      params: { ...filters },
    }),
  cancelGroupBill: (filters) =>
    Request({
      url: Urls.ws.cancel_group_bill,
      useCache: false,
      method: "POST",
      auth: true,
      userService: true,
      params: { ...filters },
    }),
  generateBillPdf: ({tenantId, filters}) =>
    Request({
      url: Urls.ws.wns_generate_pdf,
      useCache: true,
      method: "POST",
      auth: true,
      userService: true,
      params: { tenantId, ...filters },
      userDownload: true,
    }),
  WSOpensearch: (data) =>
    Request({
     url: Urls.ws.getSearchDetails,
     useCache: false,
     method: "POST",
     auth: false ,
     userService: false,
     noRequestInfo: true,
     data: data
   }),
  wsCalculationApplyAdhoc: (details, businessService) =>
    Request({
      url: businessService === "WS" ? Urls.ws.water_applyAdhocTax : Urls.ws.sewerage_applyAdhocTax,
      data: details,
      useCache: false,
      setTimeParam: false,
      userService: true,
      method: "POST",
      params: {},
      auth: true,
    }),
  WSDisconnectionNotice: (tenantId, data = {}, key) =>
    Request({
      url: Urls.payment.generate_pdf,
      useCache: false,
      method: "POST",
      auth: true,
      userService: true,
      locale: true,
      params: { tenantId, key },
      data: data,
    }),
};
