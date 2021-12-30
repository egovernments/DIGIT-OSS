import React from "react";
import { useTranslation } from "react-i18next";

const NewApplication = ({ path }) => {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  return <div>Employee New App</div>;
};

export default NewApplication;