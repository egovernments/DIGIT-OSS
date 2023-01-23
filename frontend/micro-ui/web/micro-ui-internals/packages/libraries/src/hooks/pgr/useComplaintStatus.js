import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const useComplaintStatus = () => {
  const { t } = useTranslation();
  const [complaintStatus, setComplaintStatus] = useState([]);
  const tenantId = Digit.ULBService.getCurrentTenantId();

  useEffect(() => {
    let WorkflowService = null;
    // const user = Digit.UserService.getUser();
    // const tenantId = user?.info?.tenantId;
    (async () => {
      // let stateCode =
      //   Digit.SessionStorage.get("userType") == "employee"
      //     ? Digit.SessionStorage.get("Employee.tenantId")
      //     : Digit.SessionStorage.get("Citizen.tenantId");
      WorkflowService = await Digit.WorkflowService.init(tenantId, "PGR");
      let applicationStatus = WorkflowService.BusinessServices[0].states
        .filter((state) => state.applicationStatus)
        .map((state) => ({
          name: t(`CS_COMMON_${state.applicationStatus}`),
          code: state.applicationStatus,
        }));
      setComplaintStatus(applicationStatus);
    })();
  }, [t, tenantId]);

  return complaintStatus;
};
export default useComplaintStatus;
