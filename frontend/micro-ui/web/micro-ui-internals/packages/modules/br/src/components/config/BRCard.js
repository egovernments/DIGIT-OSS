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
                link: `/digit-ui/employee/myapplication`
            },
            {
            //   count:  isLoading ? "-" : data?.EmployeCount?.activeEmployee,
                label: t("Track Application"),
                link: `/digit-ui/employee/myapplication`
            }  
        ],
        links: [
            {
                label: t("Inbox"),
                link: `/digit-ui/employee/myapplication`
            },
            {
                label: t("HR_COMMON_CREATE_EMPLOYEE_HEADER"),
                link: `/digit-ui/employee/myapplication`
            }           
        ]
    }

    return <EmployeeModuleCard {...propsForModuleCard} />
};

export default BRCard;

