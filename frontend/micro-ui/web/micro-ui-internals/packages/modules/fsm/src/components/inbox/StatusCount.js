import React from "react";
import { useTranslation } from "react-i18next";
import { CheckBox } from "@egovernments/digit-ui-react-components";

const StatusCount = ({ status, fsmfilters, onAssignmentChange, statusMap }) => {
  const { t } = useTranslation();
  const count = statusMap?.filter(e => e?.applicationstatus === status.code)?.[0]?.count

  return (
    <CheckBox
      onChange={(e) => onAssignmentChange(e, status)}
      checked={fsmfilters?.applicationStatus.filter((e) => e.name === status.name).length !== 0 ? true : false}
      label={`${t(status.name)} (${count || 0})`}
    />
  );
};

export default StatusCount;