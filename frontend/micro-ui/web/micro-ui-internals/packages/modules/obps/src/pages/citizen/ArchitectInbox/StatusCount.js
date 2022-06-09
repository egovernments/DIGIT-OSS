import React from "react";
import { useTranslation } from "react-i18next";
import { CheckBox } from "@egovernments/digit-ui-react-components";

const StatusCount = ({ status, searchParams, onAssignmentChange }) => {
  const { t } = useTranslation();
  const count = status?.count;
  return (
    <CheckBox
      styles={{marginBottom: "21px"}}
      style={{marginTop: "4px"}}
      onChange={(e) => onAssignmentChange(e, status?.statusid)}
      checked={searchParams?.applicationStatus?.filter((e) => e === status.statusid).length !== 0 ? true : false}
      // label={`${t(`CS_COMMON_INBOX_${status?.businessservice}`)} - ${t(status.applicationstatus)} (${count || 0})`}
      label={`${t(`WF_STATE_${status.businessservice}_${status.applicationstatus}`)} (${count || 0})`}
    />
  );
};

export default StatusCount;