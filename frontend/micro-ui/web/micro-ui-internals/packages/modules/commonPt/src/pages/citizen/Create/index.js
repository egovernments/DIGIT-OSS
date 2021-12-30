import React from "react";
import { useTranslation } from "react-i18next";

const CreateProperty = ({ path }) => {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  console.log(tenantId);
  return <div>Citizen New App</div>;
};

export default CreateProperty;