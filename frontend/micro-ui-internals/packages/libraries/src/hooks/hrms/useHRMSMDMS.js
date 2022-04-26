import { MdmsService } from "../../services/elements/MDMS";
import { useQuery } from "react-query";

const useHrmsMDMS = (tenantId, moduleCode, type, config = {}) => {
  const useHrmsRolesandDesignations = () => {
    return useQuery(["HRMS_EMP_RD", tenantId], () => MdmsService.getHrmsEmployeeRolesandDesignation(tenantId), config);
  };
  const useHrmsEmployeeTypes = () => {
    return useQuery(["HRMS_EMP_TYPE", tenantId], () => MdmsService.getHrmsEmployeeTypes(tenantId, moduleCode, type), config);
  };

  const useHrmsEmployeeReasons = () => {
    return useQuery(["HRMS_EMP_REASON", tenantId], () => MdmsService.getHrmsEmployeeReason(tenantId, moduleCode, type), config);
  };

  switch (type) {
    case "HRMSRolesandDesignation":
      return useHrmsRolesandDesignations();
    case "EmployeeType":
      return useHrmsEmployeeTypes();
    case "DeactivationReason":
      return useHrmsEmployeeReasons();
  }
};
export default useHrmsMDMS;
