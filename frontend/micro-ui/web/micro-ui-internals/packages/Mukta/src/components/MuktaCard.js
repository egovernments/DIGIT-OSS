import { HRIcon, EmployeeModuleCard, AttendanceIcon, PropertyHouse } from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";

const MuktaCard = () => {
 
  const { t } = useTranslation();

  const propsForModuleCard = {
    Icon: <PropertyHouse />,
    moduleName: t("Sample Mukta Customisation Module"),
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
        label: t("Sample"),
        link: `/${window?.contextPath}/employee/Mukta/pageone`,
      }
    ],
  };

  return <EmployeeModuleCard {...propsForModuleCard} />;
};

export default MuktaCard;
