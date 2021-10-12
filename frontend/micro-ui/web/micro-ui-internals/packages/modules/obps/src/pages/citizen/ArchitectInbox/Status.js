import React, { useState } from "react";
import { Loader } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import StatusCount from "./StatusCount";

const Status = ({ statuses, onAssignmentChange, searchParams }) => {
  const { t } = useTranslation();
  const [applicationStatus, setApplicationStatus] = useState(statuses)
  return (
    <div className="status-container">
      <div className="filter-label">{t("ES_INBOX_STATUS")}</div>
      {applicationStatus?.map((option, index) => (
        <StatusCount key={index} onAssignmentChange={onAssignmentChange} searchParams={searchParams} status={option} statusMap={statuses} />
      ))}
    </div>
  );
}

export default Status;