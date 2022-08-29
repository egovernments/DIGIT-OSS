import { PersonIcon, EmployeeModuleCard } from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";

const BRCard = () => {
  const ADMIN = Digit.Utils.hrmsAccess();
  if (!ADMIN) {
    return null;
  }
    const { t } = useTranslation();
    const tenantId = Digit.ULBService.getCurrentTenantId();
   
    const propsForModuleCard = {
        Icon : <PersonIcon/>,
        moduleName: t("Birth Registration"),
        kpis: [
            {
                // count:  isLoading ? "-" : data?.EmployeCount?.totalEmployee,
                label: t("TOTAL Application"),
                link: `/digit-ui/employee/br/Inbox`
            },
         
        ],
        links: [
            {
                label: t("Inbox"),
                link: `/digit-ui/employee/br/Inbox`
            },
            {
                label: t("Create Birth-Registration"),
                link: `/digit-ui/citizen/br/birth`
            }           
        ]
    }

    return <EmployeeModuleCard {...propsForModuleCard} />
};

export default BRCard;

