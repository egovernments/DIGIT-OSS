import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const Username = ({ assigner }) => {
  const { t } = useTranslation();
  const [designation, setDesignation] = useState(null);
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const { data, isSuccess } = Digit.Hooks.useEmployeeSearch(
    tenantId,
    { uuids: assigner?.uuid },
    { enabled: Digit.UserService.getType() === "employee" && assigner?.type === "EMPLOYEE" }
  );

  return (
    <p>
      {assigner?.name}
      {` `}
      {data?.Employees?.[0]?.assignments?.[0]?.designation
        ? `(${t(`COMMON_MASTERS_DESIGNATION_${data?.Employees?.[0]?.assignments?.[0]?.designation}`)})`
        : ""}
      {assigner?.type === "CITIZEN" && assigner?.roles?.some((role) => role.code === "FSM_DSO") ? "(DSO)" : ""}
    </p>
  );
};

export default Username;
