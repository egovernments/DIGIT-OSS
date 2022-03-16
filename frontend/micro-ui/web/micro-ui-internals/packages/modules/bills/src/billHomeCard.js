import { EmployeeModuleCard, CollectionIcon } from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";

const BillsCard = () => {
  const { t } = useTranslation();

  const propsForModuleCard = {
    Icon: <CollectionIcon />,
    moduleName: "Bills",
    links: [
      {
        label: "Inbox",
        link: `/digit-ui/employee/bills/inbox/`,
      },
      {
        label: "Group Bills",
        link: `/digit-ui/employee/bills/gb`,
      },
    ],
  };
  return <EmployeeModuleCard {...propsForModuleCard} />;
};

export default BillsCard;
