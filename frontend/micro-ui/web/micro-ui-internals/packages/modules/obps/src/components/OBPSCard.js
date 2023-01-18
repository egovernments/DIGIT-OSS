import { EmployeeModuleCard, DocumentIconSolid } from "@egovernments/digit-ui-react-components";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";


const OBPSCard = () => {
    sessionStorage.setItem("breadCrumbUrl", "home");
    const userRoles = Digit.SessionStorage.get('User')?.info?.roles
    const { t } = useTranslation();
    const tenantId = Digit.ULBService.getCurrentTenantId();
    const BgRole = ["SO_HQ", "AO_HQ", "CAO_HQ"]
    const SP_EPRole = ["CTP_HR","AD_HQ", "JD_HQ", "SD_HQ", "ATP_HQ", "DA_HQ", "DDA_HQ", "ADA_HQ", "DTCP_HR", "DTP_HQ", "JE_HQ", "Patwari_HQ", "STP_HQ", "STP_Circle"]

    function isBankGuarrantee(){
        let isGuarantee = false
        for(let i=0; i<userRoles.length; i++){
          if(BgRole.includes(userRoles[i].code)){
            isGuarantee = true
          }
        }
        return isGuarantee
      }

      function isServiceOrElectricEmp(){
        let isSP_EP = false
        for(let i=0; i<userRoles.length; i++){
          if(SP_EPRole.includes(userRoles[i].code)){
            isSP_EP = true
          }
        }
        return isSP_EP
      }
        
    const [isStateLocalisation, setIsStateLocalisation] = useState(true);

    useEffect(() => {
        if (tenantId && isStateLocalisation) {
            setIsStateLocalisation(false);
            Digit.LocalizationService.getLocale({ modules: [`rainmaker-${tenantId}`], locale: Digit.StoreData.getCurrentLanguage(), tenantId: `${tenantId}` });
        }
    }, [tenantId]);

    const propsForServiceModuleCard = {
        Icon: <DocumentIconSolid />,
        moduleName: t("SERVICE_PLAN_CARD"),
        kpis: [
          {
            count: "-",
            label: t("SERVICE_PLAN_CARD"),
            link: `/digit-ui/employee/tl/servicePlanInbox`,
          },
        ],
        links: [
          {
            count: "-",
            label: t("ES_TITLE_INBOX"),
            link: `/digit-ui/employee/tl/servicePlanInbox`,
          }
        ],
      };

      const propsForElectricModuleCard = {
        Icon: <DocumentIconSolid />,
        moduleName: t("ELECTRIC_PLAN_CARD"),
        kpis: [
          {
            count: "-",
            label: t("ELECTRIC_PLAN_CARD"),
            link: `/digit-ui/employee/tl/electricPlanInbox`,
          },
        ],
        links: [
          {
            count: "-",
            label: t("ES_TITLE_INBOX"),
            link: `/digit-ui/employee/tl/electricPlanInbox`,
          }
        ],
      };

      const propsForBankModuleCard = {
        Icon: <DocumentIconSolid />,
        moduleName: t("BANK_GUARANTEE_PLAN"),
        kpis: [
          {
            count: "-",
            label: t("BANK_GUARANTEE_PLAN"),
            link: `/digit-ui/employee/tl/bankGuaranteeInbox`,
          },
        ],
        links: [
          {
            count: "-",
            label: t("ES_TITLE_INBOX"),
            link: `/digit-ui/employee/tl/bankGuaranteeInbox`,
          },
        ],
      };

      const obpsSubModuleProps = []

        if(isBankGuarrantee()){
            obpsSubModuleProps.push(propsForBankModuleCard)
        }
    
        if((Digit.Utils.tlAccess() || isServiceOrElectricEmp())){
            obpsSubModuleProps.push(propsForElectricModuleCard, propsForServiceModuleCard)
        }
        return (
        <React.Fragment>
        {
        obpsSubModuleProps.map((propsForModuleCard, index) => <EmployeeModuleCard key={index} {...propsForModuleCard} />)
        }
        </React.Fragment>
    )
};

export default OBPSCard;

