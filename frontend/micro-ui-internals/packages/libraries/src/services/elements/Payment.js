import Urls from "../atoms/urls";
import { Request } from "../atoms/Utils/Request";

export const PaymentService = {
  fetchBill: (tenantId, filters = {}) =>
    Request({
      url: Urls.payment.fetch_bill,
      useCache: false,
      method: "POST",
      auth: false,
      userService: false,
      params: { tenantId, ...filters },
    })
      .then((d) => {
        console.log("from request fetchbill", d);
        return d;
      })
      .catch((err) => {
        console.log(err, "inside the catch block of payment");
        if (err?.response?.data?.Errors?.[0]?.code === "EG_BS_BILL_NO_DEMANDS_FOUND") return { Bill: [] };
        else throw err;
      }),
  searchBill: (tenantId, filters = {}) =>
    Request({
      url: Urls.payment.search_bill,
      useCache: false,
      method: "POST",
      auth: true,
      userService: true,
      params: { tenantId, ...filters },
    }),
  createReciept: (tenantId, details = {}) =>
    Request({
      url: Urls.payment.create_reciept,
      useCache: false,
      method: "POST",
      auth: true,
      userService: true,
      reciept: true,
      params: { tenantId },
      data: { ...details },
    }),

  getReciept: (tenantId, businessservice, filters = {}) =>
    Request({
      url: businessservice ? `${Urls.payment.print_reciept}/${businessservice}/_search` : `${Urls.payment.print_reciept}/_search`,
      useCache: false,
      method: "POST",
      auth: true,
      userService: true,
      params: { tenantId, ...filters },
    }),

  generatePdf: (tenantId, data = {}, key) =>
    Request({
      url: Urls.payment.generate_pdf,
      useCache: false,
      method: "POST",
      auth: true,
      userService: true,
      reciept: true,
      params: { tenantId, key },
      data: data,
    }),

  printReciept: (tenantId, filters = {}) =>
    Request({
      url: Urls.FileFetch,
      useCache: false,
      method: "GET",
      auth: true,
      userService: true,
      params: { tenantId, ...filters },
    }),

  createCitizenReciept: (tenantId, details = {}) =>
    Request({
      url: Urls.payment.create_citizen_reciept,
      useCache: false,
      method: "POST",
      auth: false,
      userService: false,
      params: { tenantId },
      data: { ...details },
    }),

  updateCitizenReciept: (transactionId) =>
    Request({
      url: Urls.payment.update_citizen_reciept,
      useCache: false,
      method: "POST",
      auth: true,
      userService: true,
      params: { transactionId },
    }),

  demandSearch: (tenantId, consumerCode, businessService) =>
    Request({
      url: Urls.payment.demandSearch,
      useCache: false,
      method: "POST",
      auth: true,
      userService: true,
      params: { tenantId, consumerCode, businessService },
    }),

  recieptSearch: (tenantId, businessService, params) =>
    Request({
      url: Urls.payment.reciept_search,
      urlParams: { buisnessService: businessService },
      method: "POST",
      // do not change this directly add a param if needed
      auth: true,
      params: { tenantId, ...params },
    }),
};
