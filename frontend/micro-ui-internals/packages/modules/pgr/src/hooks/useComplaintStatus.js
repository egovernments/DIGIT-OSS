import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const useComplaintStatus = () => {
  const { t } = useTranslation();
  const [complaintStatus, setComplaintStatus] = useState([]);
  const tenantId = Digit.ULBService.getCurrentTenantId();

  useEffect(() => {
    let WorkflowService = null;
    (async () => {
      WorkflowService = await Digit.WorkflowService.init(tenantId);
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
