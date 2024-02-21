import { HRIcon, EmployeeModuleCard, AttendanceIcon, PropertyHouse } from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";

const SampleCard = () => {
 
  const { t } = useTranslation();

  const propsForModuleCard = {
    Icon: <PropertyHouse />,
    moduleName: t("Sample"),
    kpis: [

    ],
    links: [
   
      {
        label: t("Create"),
        link: `/${window?.contextPath}/employee/sample/create`,
      },
      {
        label: t("Inbox"),
        link: `/${window?.contextPath}/employee/sample/inbox`,
      },
      {
        label: t("Search"),
        link: `/${window?.contextPath}/employee/sample/search`,
      },
      {
        label: t("Advanced Form"),
        link: `/${window?.contextPath}/employee/sample/advanced`,
      },
      {
        label: t("Search individual"),
        link: `/${window?.contextPath}/employee/sample/search-individual`,
        
      },
      {
        label: t("Create Individual"),
        link: `/${window?.contextPath}/employee/sample/create-individual`,
       
      },
      
    ],
  };

  return <EmployeeModuleCard {...propsForModuleCard} />;
};

export default SampleCard;