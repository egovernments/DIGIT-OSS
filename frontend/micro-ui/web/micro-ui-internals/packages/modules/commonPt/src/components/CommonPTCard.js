import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { EmployeeModuleCard, PropertyHouse } from "@egovernments/digit-ui-react-components";

const CommonPTCard = () => {
  const { t } = useTranslation();

  if (!Digit.Utils.ptAccess()) {
    return null;
  }

  const propsForModuleCard = {
    Icon: <PropertyHouse />,
    moduleName: t("ACTION_TEST_COMMON_PROPERTY_TAX"),
    links: [
      {
        label: t("PT_SEARCH_AND_PAY"),
        link: `/digit-ui/employee/commonpt/search`,
      }
    ],
  };

  const PT_CEMP = Digit.UserService.hasAccess(["PT_CEMP"]) || false;
  if (PT_CEMP && !propsForModuleCard.links?.[1]) {
    propsForModuleCard.links.push({
      label: t("PT_CREATE_PROPERTY"),
      link: `/digit-ui/employee/commonpt/new-application`,
    });
  }

  return <EmployeeModuleCard {...propsForModuleCard} />;
};

export default CommonPTCard;
