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
          ...filters,
        },
      },
      auth: true,
      userService: false,
    }
    ),
}

export default AuditService
