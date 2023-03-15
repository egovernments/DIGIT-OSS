import React, { useEffect, useState } from "react";
import { Loader } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import StatusCount from "./StatusCount";

const Status = ({ onAssignmentChange, searchParams, businessServices, statusMap, moduleCode }) => {
  const { t } = useTranslation();

  const [moreStatus, showMoreStatus] = useState(false);

  const { data: statusData, isLoading } = Digit.Hooks.useApplicationStatusGeneral({ businessServices }, {});

  const { userRoleStates, otherRoleStates } = statusData || {};

  const map = {
    "PT.CREATE": "ES_PT_NEW_PROPERTY",
    "PT.MUTATION": "ES_PT_TRANSFER_OWNERSHIP",
    "PT.UPDATE": "ES_PT_UPDATE_PROPERTY",
  };

  const translateState = (state, t) => {
    return `${t(map[state.stateBusinessService])}` + " - " + t(`ES_PT_COMMON_STATUS_${state.state || "CREATED"}`);
    // return t(`ES_PT_COMMON_STATUS_${state.state || "CREATED"}`);
  };


  if (isLoading) {
    return <Loader />;
  }

  return userRoleStates?.filter((e) => !e.isTerminateState).length ? (
    <div className="status-container">
      <div className="filter-label" style={{ fontWeight: "normal" }}>
        {t("ES_INBOX_STATUS")}
      </div>
      {userRoleStates
        ?.filter((e) => !e.isTerminateState)
        ?.slice(0, 4)
        ?.map((option, index) => {
          return (
            <StatusCount
              businessServices={businessServices}
              key={index}
              onAssignmentChange={onAssignmentChange}
              status={{ name: translateState(option, t), code: option.applicationStatus, ...option }}
              searchParams={searchParams}
              statusMap={statusMap}
            />
          );
        })}
      {userRoleStates?.filter((e) => !e.isTerminateState)?.slice(4).length > 0 ? (
        <React.Fragment>
          {moreStatus &&
            userRoleStates
              ?.filter((e) => !e.isTerminateState)
              ?.slice(4)
              ?.map((option, index) => {
                return (
                  <StatusCount
                    businessServices={businessServices}
                    key={option.uuid}
                    onAssignmentChange={onAssignmentChange}
                    status={{ name: translateState(option, t), code: option.applicationStatus, ...option }}
                    searchParams={searchParams}
                    statusMap={statusMap}
                  />
                );
              })}

          <div className="filter-button" onClick={() => showMoreStatus(!moreStatus)}>
            {" "}
            {moreStatus ? t("ES_COMMON_LESS") : t("ES_COMMON_MORE")}{" "}
          </div>
        </React.Fragment>
      ) : null}
    </div>
  ) : null;
};

export default Status;
