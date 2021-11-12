import React, { useState } from "react";
import { Loader } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import StatusCount from "./StatusCount";

const Status = ({ onAssignmentChange, searchParams, businessServices,clearCheck,setclearCheck }) => {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const stateId = Digit.ULBService.getStateId();
  const { data, isLoading } = Digit.Hooks.mcollect.useMCollectMDMS(stateId, "mCollect", "applicationStatus");
  const applicationStatus = data?.mCollect?.applicationStatus || [];
  const translateState = (state) => {
    return `${state.code || "ACTIVE"}`;
  };
  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="status-container">
      <div className="filter-label" style={{ fontWeight: "normal" }}>
        {t("UC_COMMON_TABLE_COL_STATUS")}
      </div>
      {applicationStatus?.map((option, index) => {
        return (
          <StatusCount
            key={index}
            clearCheck={clearCheck}
            setclearCheck={setclearCheck}
            onAssignmentChange={onAssignmentChange}
            status={{ name: translateState(option), code: option.code }}
            searchParams={searchParams}
          />
        );
      })}
    </div>
  );
};

export default Status;
