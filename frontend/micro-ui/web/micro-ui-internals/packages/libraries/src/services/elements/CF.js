import Urls from "../atoms/urls";
import { Request } from "../atoms/Utils/Request";

export const CFService = {
    cfcreate: (details, tenantId) =>
        Request({
          url: Urls.pt.cfcreate,
          data: details,
          useCache: false,
          setTimeParam: false,
          userService: true,
          method: "POST",
          params: {},
          auth: true,
        }),
    cfdefinitionsearch: ({ filters, auth }) =>
    Request({
      url: Urls.pt.cfdefinitionsearch,
      useCache: false,
      method: "POST",
      auth: auth === false ? auth : true,
      userService: auth === false ? auth : true,
      data: {...filters},
      //params: { tenantId, ...filters },
    }),
    cfsearch: ({ filters, auth }) =>
    Request({
      url: Urls.pt.cfsearch,
      useCache: false,
      method: "POST",
      auth: auth === false ? auth : true,
      userService: auth === false ? auth : true,
      data: {...filters},
      //params: { tenantId, ...filters },
    }),
};