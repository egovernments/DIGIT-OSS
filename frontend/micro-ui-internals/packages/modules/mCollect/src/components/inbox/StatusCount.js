import React from "react";
import { useTranslation } from "react-i18next";
import { CheckBox } from "@egovernments/digit-ui-react-components";

const StatusCount = ({ status, searchParams, onAssignmentChange, businessServices,clearCheck,setclearCheck }) => {
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
        if(!clearCheck)
        return searchParams?.applicationStatus.some((e) => e.code === status.code);
        else{
          setclearCheck(false);
          return false;
        }
      })()}
      label={`${t(status.name)}`}
    />
  );
};

export default StatusCount;
