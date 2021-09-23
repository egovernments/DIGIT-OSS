import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { EmployeeModuleCard, PropertyHouse } from "@egovernments/digit-ui-react-components";

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
    links: [
      {
        count: isLoading ? "-" : total,
        label: t("ES_COMMON_INBOX"),
        link: `/digit-ui/employee/pt/inbox`,
      },
    ],
  };

  const PT_CEMP = Digit.UserService.hasAccess(["PT_CEMP"]) || false;
  if (PT_CEMP && !propsForModuleCard.links?.[1]) {
    propsForModuleCard.links.push({
      label: t("ES_TITLE_NEW_REGISTRATION"),
      link: `/digit-ui/employee/pt/new-application`,
    });
  }

  return <EmployeeModuleCard {...propsForModuleCard} />;
};

export default PTCard;
