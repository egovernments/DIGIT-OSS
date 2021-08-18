import React, { useState } from "react";
import { Loader } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import StatusCount from "./StatusCount";

const Status = ({ onAssignmentChange, searchParams, businessServices }) => {
  const { t } = useTranslation();

  const [moreStatus, showMoreStatus] = useState(false);

  const { data: statusData, isLoading } = Digit.Hooks.useApplicationStatusGeneral({ businessServices }, {});

  const { userRoleStates, otherRoleStates } = statusData || {};

  const translateState = (state) => {
    return `ES_PT_STATUS_${state.state || "CREATED"}`;
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="status-container">
      <div className="filter-label" style={{ fontWeight: "normal" }}>
        {t("ES_INBOX_STATUS")}
      </div>
      {userRoleStates?.map((option, index) => {
        return (
          <StatusCount
            businessServices={businessServices}
            key={index}
            onAssignmentChange={onAssignmentChange}
            status={{ name: translateState(option), code: option.applicationStatus }}
            searchParams={searchParams}
          />
        );
      })}
      {moreStatus &&
        otherRoleStates?.map((option, index) => {
          return (
            <StatusCount
              businessServices={businessServices}
              key={index}
              onAssignmentChange={onAssignmentChange}
              status={{ name: translateState(option), code: option.applicationStatus }}
              searchParams={searchParams}
            />
          );
        })}
      <div className="filter-button" onClick={() => showMoreStatus(!moreStatus)}>
        {" "}
        {moreStatus ? t("ES_COMMON_LESS") : t("ES_COMMON_MORE")}{" "}
      </div>
    </div>
  );
};

export default Status;
