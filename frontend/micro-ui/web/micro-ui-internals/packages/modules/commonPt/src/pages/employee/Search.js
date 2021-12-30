import React from "react";
import { useTranslation } from "react-i18next";

const Search = ({ path }) => {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  return <div>Employee Search</div>;
};

export default Search;
