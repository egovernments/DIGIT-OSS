import Urls from "../atoms/urls";
import { Request } from "../atoms/Utils/Request";

export const PTService = {
  search: ({ tenantId, filters, auth }) =>
    Request({
      url: Urls.pt.search,
      useCache: false,
      method: "POST",
      auth: auth === false ? auth : true,
      userService: auth === false ? auth : true,
      params: { tenantId, ...filters },
    }),
  fetchPaymentDetails: ({ tenantId, consumerCodes ,auth=true}) =>
    Request({
      url: Urls.pt.fetch_payment_details,
      useCache: false,
      method: "POST",
      auth: auth === false ? auth : true,
      userService: auth === false ? auth : true,
      params: { tenantId, consumerCode: consumerCodes, businessService: "PT" },
    }),
  create: (details, tenantId) =>
    Request({
      url: Urls.pt.create,
      data: details,
      useCache: false,
      setTimeParam: false,
      userService: true,
      method: "POST",
      params: {},
      auth: true,
    }),
  update: (details, tenantId) =>
    Request({
      url: Urls.pt.update,
      data: details,
      useCache: false,
      setTimeParam: false,
      userService: true,
      method: "POST",
      params: {},
      auth: true,
    }),
  ptCalculationEstimate: (details, tenantId) =>
    Request({
      url: Urls.pt.pt_calculation_estimate,
      data: details,
      useCache: false,
      userService: true,
      method: "POST",
      params: { tenantId },
      auth: true,
    }),
  assessmentCreate: (details, tenantId) =>
    Request({
      url: Urls.pt.assessment_create,
      data: details,
      useCache: false,
      userService: true,
      method: "POST",
      params: { tenantId },
      auth: true,
    }),
  assessmentSearch: ({ tenantId, filters }) =>
    Request({
      url: Urls.pt.assessment_search,
      useCache: false,
      method: "POST",
      auth: true,
      userService: true,
      params: { tenantId, ...filters },
    }),
  paymentsearch: ({ tenantId, filters, auth }) =>
    Request({
      url: Urls.pt.payment_search,
      useCache: false,
      method: "POST",
      auth: auth === false ? auth : true,
      userService: auth === false ? auth : true,
      params: { tenantId, ...filters },
    }),
  ptCalculateMutation: (details, tenantId) =>
    Request({
      url: Urls.pt.pt_calculate_mutation,
      data: details,
      useCache: false,
      userService: true,
      method: "POST",
      params: { tenantId },
      auth: true,
    }),
  PTOpenSearch : ({ tenantId, filters }) =>
  Request({
   url: Urls.pt.search,
   useCache: false,
   method: "POST",
   auth: false ,
   userService: false,
   params: { tenantId, ...filters },
 }),
};

// export const PTService = {
//   fetchProperties: ({ tenantId, filters }) =>
//     Request({
//       url: Urls.pt.fectch_property,
//       useCache: false,
//       method: "POST",
//       auth: true,
//       userService: true,
//       params: { tenantId, ...filters },
//     }),

//   fetchPaymentDetails: ({ tenantId, consumerCodes }) =>
//     Request({
//       url: Urls.pt.fetch_payment_details,
//       useCache: false,
//       method: "POST",
//       auth: true,
//       userService: true,
//       params: { tenantId, consumerCode: consumerCodes, businessService: "PT" },
//     }),
// };
