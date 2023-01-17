import { EmployeeModuleCard, DocumentIconSolid } from "@egovernments/digit-ui-react-components";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";


const OBPSCard = () => {
    sessionStorage.setItem("breadCrumbUrl", "home");
    const userRoles = Digit.SessionStorage.get('User')?.info?.roles
    const { t } = useTranslation();
    const tenantId = Digit.ULBService.getCurrentTenantId();
    const BgRole = ["SO", "AO", "CAO"]

    function isBankGuarrantee(){
        let isGuarantee = false
        for(let i=0; i<userRoles.length; i++){
          if(BgRole.includes(userRoles[i].code)){
            isGuarantee = true
          }
        }
        return isGuarantee
      }

      function isCTP_HR(){
        let ctp_hr = false
        for(let i=0; i<userRoles.length; i++){
          if(userRoles[i].code === "CTP_HR"){
            ctp_hr = true
          }
        }
        return ctp_hr
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
            link: `/digit-ui/employee/obps/servicePlanInbox`,
          },
        ],
        links: [
          {
            count: "-",
            label: t("ES_TITLE_INBOX"),
            link: `/digit-ui/employee/obps/servicePlanInbox`,
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
            link: `/digit-ui/employee/obps/electricPlanInbox`,
          },
        ],
        links: [
          {
            count: "-",
            label: t("ES_TITLE_INBOX"),
            link: `/digit-ui/employee/obps/electricPlanInbox`,
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
            link: `/digit-ui/employee/obps/bankGuaranteeInbox`,
          },
        ],
        links: [
          {
            count: "-",
            label: t("ES_TITLE_INBOX"),
            link: `/digit-ui/employee/obps/bankGuaranteeInbox`,
          },
        ],
      };

      const obpsSubModuleProps = []

        if(!isBankGuarrantee()){
            obpsSubModuleProps.push(propsForBankModuleCard)
        }
    
        if((Digit.Utils.tlAccess() || isCTP_HR())){
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

