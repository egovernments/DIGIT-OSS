import React from "react";
import { useTranslation } from "react-i18next";
import { CheckBox } from "@egovernments/digit-ui-react-components";

const StatusCount = ({ status, onAssignmentChange, searchParams }) => {
  const { t } = useTranslation();

  return (
    <CheckBox
      onChange={(e) => onAssignmentChange(e, status)}
      checked={searchParams?.eventStatus?.filter(event => event === status)?.length > 0 ? true : false}
      label={t(status)}
      pageType={'employee'}
    />
  )
}

export default StatusCount; 