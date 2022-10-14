import { EmployeeModuleCard, CollectionIcon } from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";

const BillsCard = () => {
  const { t } = useTranslation();
  const userRoles = Digit.SessionStorage.get("User")?.info?.roles;
  const isEmployee = userRoles.find((role) => role.code === "SUPERUSER");
  if (!isEmployee) return null;
  const propsForModuleCard = {
    Icon: <CollectionIcon />,
    moduleName: t("ACTION_TEST_BILLGENIE"),
    links: [
      {
        label: t("ABG_SEARCH_BILL_COMMON_HEADER"),
        link: `/digit-ui/employee/bills/inbox`,
      },
      {
        label: t("ACTION_TEST_GROUP_BILLS"),
        link: `/digit-ui/employee/bills/group-bill`,
      },
      {
        label: t("ACTION_TEST_CANCEL_BILL"),
        link: `/digit-ui/employee/bills/cancel-bill`,
      },
      {
        label: t("ACTION_TEST_DOWNLOAD_BILL_PDF"),
        link: `/digit-ui/employee/bills/download-bill-pdf`,
      }
    ],
  };
  return <EmployeeModuleCard {...propsForModuleCard} />;
};

export default BillsCard;
