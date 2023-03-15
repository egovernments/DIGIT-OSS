import React from "react";
import { useTranslation } from "react-i18next";
import { CheckBox } from "@egovernments/digit-ui-react-components";

const StatusCount = ({ status, searchParams, onAssignmentChange, statusMap, businessServices }) => {
  const { t } = useTranslation();


  return (
    <CheckBox
      styles={{ height: "unset" }}
      onChange={(e) => onAssignmentChange({ ...e, state: status.state }, status)}
      checked={(() => {
        return searchParams?.applicationStatus.some((e) => e.uuid === status.uuid);
      })()}
      label={`${status.name} (${statusMap?.find((e) => e.statusid === status.uuid)?.count || "-"})`}
    />
  );
};

export default StatusCount;
