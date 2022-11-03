import Urls from "../atoms/urls";
import { Request } from "../atoms/Utils/Request";

const AuditService = {
  audit_log: ({ tenantId, filters }) =>
    Request({
      url: `${Urls.audit}`,
      useCache: false,
      method: "POST",
      data: {
        InboxElasticSearchCriteria: {
          tenantId: tenantId,
          "indexKey": "userLogin",
          limit:10,
          offset:0,
          ...filters,
        },
      },
      auth: true,
      userService: false,
    }
    ),
}

export default AuditService
