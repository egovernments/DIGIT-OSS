import React from "react";
import { useTranslation } from "react-i18next";
import StatusCount from "./StatusCount";

const statuses = [
  "ACTIVE",
  "INACTIVE"
]

const Status = ({ onAssignmentChange, searchParams }) => {
  const { t } = useTranslation();

  return (
    <div className="status-container">
      <div className="filter-label">{t("ES_INBOX_STATUS")}</div>
      {statuses?.map((status, key) => (
        <StatusCount key={key} status={status} onAssignmentChange={onAssignmentChange} searchParams={searchParams} />
      ))}
    </div>
  )
}

export default Status; 