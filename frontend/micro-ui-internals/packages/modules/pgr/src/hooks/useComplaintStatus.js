import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const useComplaintStatus = () => {
  const { t } = useTranslation();
  const [complaintStatus, setComplaintStatus] = useState([]);

  useEffect(() => {
    let workflowService = null;
    let userType = Digit.SessionStorage.get("userType");
    let tenantId = userType == "CITIZEN" ? Digit.SessionStorage.get("Citizen.tenantId") : Digit.SessionStorage.get("Employee.tenantId");
    (async () => {
      workflowService = await Digit.workflowService.init(tenantId);
      let applicationStatus = workflowService.BusinessServices[0].states
        .filter((state) => state.applicationStatus)
        .map((state) => ({
          name: t(`CS_COMMON_${state.applicationStatus}`),
          code: state.applicationStatus,
        }));
      setComplaintStatus(applicationStatus);
    })();
  }, []);

  return complaintStatus;
};
export default useComplaintStatus;
