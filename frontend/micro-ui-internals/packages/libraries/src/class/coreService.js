import { mdmsServiceObj } from "./mdmsService";
import { workFlowServiceObj } from "./workflowService";
import { Request } from "../services/Utils/Request";

export class CoreService {
  constructor() {
    this.MdmsService = mdmsServiceObj;
    this.WorkFlowService = workFlowServiceObj;
    this.Request = Request;
  }

  employeeSearch = (cityCode, roles) => {
    return Request({
      url: Urls.EmployeeSearch,
      params: { tenantId: cityCode, roles: roles },
      auth: true,
    });
  };
}
