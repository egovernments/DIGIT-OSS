import { HRIcon, EmployeeModuleCard, AttendanceIcon, PropertyHouse } from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";

const MuktaCard = () => {
 
  const { t } = useTranslation();

  const propsForModuleCard = {
    Icon: <PropertyHouse />,
    moduleName: t("Sample Module"),
    kpis: [
      // {
      //     count:  isLoading ? "-" : data?.EmployeCount?.totalEmployee,
      //     label: t("TOTAL_EMPLOYEES"),
      //     link: `/${window?.contextPath}/employee/hrms/inbox`
      // },
      // {
      //   count:  isLoading ? "-" : data?.EmployeCount?.activeEmployee,
      //     label: t("ACTIVE_EMPLOYEES"),
      //     link: `/${window?.contextPath}/employee/hrms/inbox`
      // }
    ],
    links: [
      {
        label: t("Create"),
        link: `/${window?.contextPath}/employee/Mukta/sample`,
      },
      {
        label: t("Inbox"),
        link: `/${window?.contextPath}/employee/Mukta/inbox`,
      },
      {
        label: t("Search"),
        link: `/${window?.contextPath}/employee/Mukta/search`,
      },
    ],
  };

  return <EmployeeModuleCard {...propsForModuleCard} />;
};

export default MuktaCard;
