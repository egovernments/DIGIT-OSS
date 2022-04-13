import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import StatusCount from "./StatusCount";

const Status = ({ statuses, onAssignmentChange, searchParams }) => {
  const { t } = useTranslation();
  // const [applicationStatus, setApplicationStatus] = useState(statuses);
  return (
    <div className="status-container">
      <div className="filter-label sub-filter-label" style={{fontWeight:"400",fontSize:"16px"}}>{t("ES_INBOX_STATUS")}</div>
      {statuses?.map((option, index) => (
        <StatusCount key={index} onAssignmentChange={onAssignmentChange} searchParams={searchParams} status={option}  />
      ))}
    </div>
  );
};

export default Status;
