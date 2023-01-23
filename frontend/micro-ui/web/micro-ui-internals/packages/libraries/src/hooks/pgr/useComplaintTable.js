import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const useComplaintTable = ({ data }) => {
  const { t } = useTranslation();
  const [details, setDetails] = useState([]);

  useEffect(() => {
    const details = {
      CS_COMPLAINT_DETAILS_COMPLAINT_NO: data.serviceRequestId,
      CS_COMPLAINT_DETAILS_COMPLAINT_SUBTYPE: t(data.complaintSubType),
      CS_COMPLAINT_DETAILS_APPLICATION_STATUS: data.applicationStatus,
      CS_COMPLAINT_DETAILS_LOCALITY: t(data.locality),
      CS_COMPLAINT_DETAILS_TASK_OWNER: "task owner",
      CS_COMPLAINT_SLA_REMAINING: "",
    };
    setDetails(details);
  }, []);

  return details;
};

export default useComplaintTable;
