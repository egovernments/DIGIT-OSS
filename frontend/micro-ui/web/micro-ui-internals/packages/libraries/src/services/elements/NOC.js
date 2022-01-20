import { Request } from "../atoms/Utils/Request"
import Urls from "../atoms/urls";

export const NOCService = {
  NOCsearch: ({ tenantId, filters }) =>
    Request({
      url: Urls.noc.nocSearch,
      useCache: false,
      method: "POST",
      auth: true,
      userService: false,
      params: { tenantId, ...filters },
    }),
}