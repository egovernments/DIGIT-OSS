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
        return d;
      })
      .catch((err) => {
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
  searchAmendment: (tenantId, filters = {}) => {
    return Request({
      url: Urls.payment.billAmendmentSearch,
      useCache: false,
      method: "POST",
      auth: true,
      userService: true,
      params: { tenantId, ...filters },
    });
  },
  createReciept: (tenantId, details = {}) =>
    Request({
      url: Urls.payment.create_reciept,
      useCache: false,
      method: "POST",
      auth: true,
      userService: true,
      locale: true,
      params: { tenantId },
      data: { ...details },
    }),

  getReciept: (tenantId, businessservice, filters = {}) =>
    Request({
      url:
        businessservice && businessservice !== "BPAREG"
          ? `${Urls.payment.print_reciept}/${businessservice}/_search`
          : `${Urls.payment.print_reciept}/_search`,
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
      locale: true,
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
      url:
        businessService === "BPAREG" && !params?.isEmployee /* || businessService.includes("BPA.") && !params?.isEmployee ) */
          ? Urls.payment.obps_Reciept_Search
          : Urls.payment.reciept_search,
      urlParams:
        businessService === "BPAREG" && !params?.isEmployee /* || businessService.includes("BPA.") && !params?.isEmployee) */
          ? {}
          : { buisnessService: businessService },
      method: "POST",
      // do not change this directly add a param if needed
      auth: true,
      params: { tenantId, ...params },
    }),

  getBulkPdfRecordsDetails: (filters) =>
    Request({
      url: Urls.payment.getBulkPdfRecordsDetails,
      useCache: false,
      method: "POST",
      auth: true,
      userService: true,
      params: { ...filters },
    }),
};
