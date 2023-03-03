import { EmployeeModuleCard, DocumentIconSolid } from "@egovernments/digit-ui-react-components";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";


const OBPSCard = () => {
    sessionStorage.setItem("breadCrumbUrl", "home");
    const userRoles = Digit.SessionStorage.get('User')?.info?.roles
    const { t } = useTranslation();
    const tenantId = Digit.ULBService.getCurrentTenantId();
    const BgRole = ["SO_HQ", "AO_HQ", "CAO_HQ", "DTCP_HR", "DTP_HQ", "AD_HQ", "JD_HQ", "Patwari_HQ", "ATP_HQ", "NAYAB_TEHSILDAR"]
    const SP_Role = ["CTP_HR", "AO_HQ", "AD_HQ", "JD_HQ", "SD_HQ", "DTCP_HR", "DTP_HQ", "JE_HQ", "STP_HQ", "ASST_JE_HQ", "CE_HQ", "HSVP", "GMDA", "FMDA", "PMDA"]
    const EP_Role = ["CTP_HR","AO_HQ", "JD_HQ", "SD_HQ","DTCP_HR", "DTP_HQ", "JE_HQ", "STP_HQ", "ASST_JE_HQ", "EE_HQ", "PUD"]
    function isBankGuarrantee(){
        let isGuarantee = false
        for(let i=0; i<userRoles.length; i++){
          if(BgRole.includes(userRoles[i].code)){
            isGuarantee = true
          }
        }
        return isGuarantee
      }

      function isServiceEmp(){
        let isSP = false
        for(let i=0; i<userRoles.length; i++){
          if(SP_Role.includes(userRoles[i].code)){
            isSP = true
          }
        }
        return isSP
      }

      function isElectricEmp(){
        let isEP = false
        for(let i=0; i<userRoles.length; i++){
          if(EP_Role.includes(userRoles[i].code)){
            isEP = true
          }
        }
        return isEP
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

        // if(isBankGuarrantee()){
        //     obpsSubModuleProps.push(propsForBankModuleCard)
        // }
    
      //   if((Digit.Utils.tlAccess() || isServiceEmp())){
      //       obpsSubModuleProps.push(propsForServiceModuleCard)
      //   }
      //   if((Digit.Utils.tlAccess() || isElectricEmp())){
      //     obpsSubModuleProps.push(propsForElectricModuleCard)
      // }
      obpsSubModuleProps.push(propsForServiceModuleCard)
      obpsSubModuleProps.push(propsForElectricModuleCard)
      obpsSubModuleProps.push(propsForBankModuleCard)
        return (
        <React.Fragment>
        {
        obpsSubModuleProps.map((propsForModuleCard, index) => <EmployeeModuleCard key={index} {...propsForModuleCard} />)
        }
        </React.Fragment>
    )
};

export default OBPSCard;

