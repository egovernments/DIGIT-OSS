import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const useComplaintStatus = () => {
  const { t } = useTranslation();
  const [complaintStatus, setComplaintStatus] = useState([]);

  useEffect(() => {
    let WorkflowService = null;
    (async () => {
      let stateCode =
        Digit.SessionStorage.get("userType") == "employee"
          ? Digit.SessionStorage.get("Employee.tenantId")
          : Digit.SessionStorage.get("Citizen.tenantId");
      WorkflowService = await Digit.WorkflowService.init(stateCode);
      let applicationStatus = WorkflowService.BusinessServices[0].states
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
