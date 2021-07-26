import React from "react";
import { useTranslation } from "react-i18next";
import { CheckBox } from "@egovernments/digit-ui-react-components";

const StatusCount = ({ status, searchParams, onAssignmentChange, businessServices }) => {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  // const { data } = Digit.Hooks.useInboxGeneral(
  //   {
  //     tenantId,
  //     businessService: "PT",
  //     filters: {
  //       applicationStatus: [status],
  //       total: true,
  //       uuid: { code: "ASSIGNED_TO_ME", name: t("ES_INBOX_ASSIGNED_TO_ME") },
  //       sortBy: "createdTime",
  //       sortOrder: "DESC",
  //       services: businessServices,
  //     },
  //   },
  //   null
  // );

  return (
    <CheckBox
      onChange={(e) => onAssignmentChange(e, status)}
      checked={(() => {
        //IIFE
        return searchParams?.applicationStatus.some((e) => e.code === status.code);
      })()}
      label={`${t(status.name)}`}
    />
  );
};

export default StatusCount;
