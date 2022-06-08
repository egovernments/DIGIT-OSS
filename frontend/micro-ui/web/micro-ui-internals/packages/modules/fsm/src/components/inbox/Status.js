import React, { useState } from "react";
import { Loader } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import StatusCount from "./StatusCount";

const Status = ({ onAssignmentChange, fsmfilters, mergedRoleDetails, statusMap }) => {
  const { t } = useTranslation();

  const { data: applicationsWithCount, isLoading } = Digit.Hooks.fsm.useApplicationStatus(true, true, statusMap);

  const [moreStatus, showMoreStatus] = useState(false);
  const finalApplicationWithCount = mergedRoleDetails.statuses
    .map((roleDetails) => applicationsWithCount?.filter((application) => application.code === roleDetails)[0])
    .filter((status) => status?.code);

  const moreApplicationWithCount = applicationsWithCount?.filter(
    (application) => !finalApplicationWithCount.find((listedApplication) => listedApplication.code === application.code)
  );

  if (isLoading) {
    return <Loader />;
  }

  return finalApplicationWithCount?.length > 0 ? (
    <div className="status-container">
      <div className="filter-label">{t("ES_INBOX_STATUS")}</div>
      {finalApplicationWithCount?.map((option, index) => (
        <StatusCount key={index} onAssignmentChange={onAssignmentChange} status={option} fsmfilters={fsmfilters} statusMap={statusMap} />
      ))}
      {moreStatus
        ? moreApplicationWithCount?.map((option, index) => (
          <StatusCount key={index} onAssignmentChange={onAssignmentChange} status={option} fsmfilters={fsmfilters} statusMap={statusMap} />
        ))
        : null}
      {mergedRoleDetails.fixed === false && moreApplicationWithCount.length > 0 ? (
        <div className="filter-button" onClick={() => showMoreStatus(!moreStatus)}>
          {" "}
          {moreStatus ? t("ES_COMMON_LESS") : t("ES_COMMON_MORE")}{" "}
        </div>
      ) : null}
    </div>
  ) : null;
};

export default Status;
