import React from "react";
import { useTranslation } from "react-i18next";
import { CheckBox } from "@egovernments/digit-ui-react-components";

const StatusCount = ({ status, fsmfilters, onAssignmentChange }) => {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const DSO = Digit.UserService.hasAccess(["FSM_DSO"]);
  const { data } = Digit.Hooks.fsm.useInbox(
    tenantId,
    {
      applicationStatus: [status],
      locality: fsmfilters?.locality,
      total: true,
      uuid: DSO ? { code: "ASSIGNED_TO_ME", name: t("ES_INBOX_ASSIGNED_TO_ME") } : { code: "ASSIGNED_TO_ALL", name: t("ES_INBOX_ASSIGNED_TO_ALL") },
      sortBy: "createdTime",
      sortOrder: "DESC",
    },
    null
  );

  return (
    <CheckBox
      onChange={(e) => onAssignmentChange(e, status)}
      checked={fsmfilters?.applicationStatus.filter((e) => e.name === status.name).length !== 0 ? true : false}
      label={`${t(status.name)} (${data?.[0]?.totalCount ? data?.[0]?.totalCount : 0})`}
    />
  );
};

export default StatusCount;
