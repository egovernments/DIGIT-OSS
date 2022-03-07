import { Request } from "../atoms/Utils/Request";
import Urls from "../atoms/urls";

const AccessControlService = {
  getAccessControl: (tenantId) =>
    Request({
      url: Urls.access_control,
      method: "POST",
      auth: true,
      useCache: false,
      userService: true,
      data: {
        roleCodes: ["FSM_VIEW_EMP", "EMPLOYEE", "EMPLOYEE ADMIN", "FSM_DASHBOARD_VIEWER"],
        tenantId: tenantId,
        actionMaster: "actions-test",
        enabled: true,
      },
    }),
};
export default AccessControlService;
