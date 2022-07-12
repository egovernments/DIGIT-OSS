import Urls from "../atoms/urls";
import { Request } from "../atoms/Utils/Request";

export const FSMService = {
  search: (tenantId, filters = {}) =>
    Request({
      url: Urls.fsm.search,
      useCache: false,
      method: "POST",
      auth: true,
      userService: false,
      params: { tenantId, ...filters },
    }),
  create: (details, tenantId) =>
    Request({
      url: Urls.fsm.create,
      data: details,
      useCache: true,
      userService: true,
      method: "POST",
      params: { tenantId },
      auth: true,
    }),
  update: (details, tenantId) =>
    Request({
      url: Urls.fsm.update,
      data: details,
      useCache: false,
      userService: true,
      method: "POST",
      params: { tenantId },
      auth: true,
    }),
  vendorSearch: (tenantId, filters) =>
    Request({
      url: Urls.fsm.vendorSearch,
      useCache: true,
      userService: true,
      method: "POST",
      params: { tenantId, ...filters },
      auth: true,
    }),
  audit: (tenantId, filters) =>
    Request({
      url: Urls.fsm.audit,
      useCache: false,
      userService: true,
      method: "POST",
      params: { tenantId, ...filters },
      auth: true,
    }),
  vehicleSearch: (tenantId, details) =>
    Request({
      url: Urls.fsm.vehicleTripSearch,
      useCache: false,
      userService: true,
      method: "POST",
      params: { tenantId, ...details },
      auth: true,
    }),
  vehiclesSearch: (tenantId, details) =>
    Request({
      url: Urls.fsm.vehicleSearch,
      useCache: false,
      userService: true,
      method: "POST",
      params: { tenantId, ...details },
      auth: true,
    }),
  billingSlabSearch: (tenantId, filters) =>
    Request({
      url: Urls.fsm.billingSlabSearch,
      useCache: false,
      userService: true,
      method: "POST",
      params: { tenantId, ...filters },
      auth: true,
    }),
  vehicleUpdate: (details) => {
    return Request({
      url: Urls.fsm.vehilceUpdate,
      data: details,
      useCache: false,
      userService: true,
      method: "POST",
      auth: true,
    });
  },
  vehicleTripCreate: (details) => {
    return Request({
      url: Urls.fsm.vehicleTripCreate,
      data: details,
      useCache: false,
      userService: true,
      method: "POST",
      auth: true,
    });
  },
};
