import { EmployeeModuleCard, PropertyHouse } from "@egovernments/digit-ui-react-components";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const PTCard = () => {
  const { t } = useTranslation();

  const [total, setTotal] = useState("-");
  const { data, isLoading, isFetching, isSuccess } = Digit.Hooks.useNewInboxGeneral({
    tenantId: Digit.ULBService.getCurrentTenantId(),
    ModuleCode: "PT",
    filters: { limit: 10, offset: 0, services: ["PT.CREATE", "PT.MUTATION", "PT.UPDATE"] },
    config: {
      select: (data) => {
        return data?.totalCount || "-";
      },
      enabled: Digit.Utils.ptAccess(),
    },
  });

  useEffect(() => {
    if (!isFetching && isSuccess) setTotal(data);
  }, [isFetching]);

  if (!Digit.Utils.ptAccess()) {
    return null;
  }
  const links = [
    {
      count: isLoading ? "-" : total,
      label: t("ES_COMMON_INBOX"),
      link: `/digit-ui/employee/pt/inbox`,
    },
    {
      label: t("ES_TITLE_NEW_REGISTRATION"),
      link: `/digit-ui/employee/pt/new-application`,
      role: "PT_CEMP",
    },
    {
      label: t("SEARCH_PROPERTY"),
      link: `/digit-ui/employee/pt/search`,
    },
    {
      label: t("ES_COMMON_APPLICATION_SEARCH"),
      link: `/digit-ui/employee/pt/application-search`,
    },
  ];
  const PT_CEMP = Digit.UserService.hasAccess(["PT_CEMP"]) || false;

  const propsForModuleCard = {
    Icon: <PropertyHouse />,
    moduleName: t("ES_TITLE_PROPERTY_TAX"),
    kpis: [
      {
        count: total,
        label: t("ES_TITLE_INBOX"),
        link: `/digit-ui/employee/pt/inbox`,
      },
    ],
    links: links.filter((link) => !link?.role || PT_CEMP),
  };

  if (PT_CEMP && !propsForModuleCard.links?.[2]) {
    propsForModuleCard.links.push({
      label: t("ES_TITLE_NEW_REGISTRATION"),
      link: `/digit-ui/employee/pt/new-application`,
    });
  }

  return <EmployeeModuleCard {...propsForModuleCard} />;
};

export default PTCard;
