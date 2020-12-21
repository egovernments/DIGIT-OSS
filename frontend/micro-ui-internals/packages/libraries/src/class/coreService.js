import { mdmsServiceObj } from "./mdmsService";
import { workFlowServiceObj } from "./workflowService";
import { Request } from "../services/Utils/Request";
import { fileStorageService } from "./uploadService";
import { basePGRobj } from "./moduleApis/basePgr";
import Urls from "../services/urls";

const createModule = (moduleCode) => {
  switch (moduleCode) {
    case "PGR":
      return basePGRobj;

    default:
      return {};
  }
};

export class CoreService {
  constructor(moduleCode) {
    this.MdmsService = mdmsServiceObj;
    this.WorkFlowService = workFlowServiceObj;
    this.fileStorageService = fileStorageService;
    this.module = createModule(moduleCode);
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
