import { HRIcon, EmployeeModuleCard, AttendanceIcon,  } from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";

const MuktaCard = () => {
 
  const { t } = useTranslation();

  const propsForModuleCard = {
    Icon: <AttendanceIcon />,
    moduleName: t("Mukta Customisation Module"),
    kpis: [
     
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
