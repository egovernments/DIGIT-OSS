import { EmployeeModuleCard, ReceiptIcon } from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";
import { checkForEmployee } from "../../../ws/src/utils";

const ReportsCard = () => {
    // if (!Digit.Utils.receiptsAccess()) {
    //     return null;
    // }
    const tenantId = Digit.ULBService.getCurrentTenantId();
    const { t } = useTranslation();

    let links = [
        {
            label: t("ACTION_TEST_RECEIPTREGISTER"),
            link: `/digit-ui/employee/reports/search/pt-reports/PTReceiptRegister`,
            roles: ["UC_EMP", "PT_CEMP"]
        },
        {
            label: t("ACTION_TEST_COLLECTION_REGISTER"),
            link: `/digit-ui/employee/reports/search/pt-reports/PTCollectionReport`,
            roles: ["PT_CEMP"]
        },
        {
            label: t("ACTION_TEST_DEFAULTER_REPORT"),
            link: `/digit-ui/employee/reports/search/pt-reports/DefaulterReport`,
            roles: ["PT_COLLECTION_EMP",]
        },
        {
            label: t("ACTION_TEST_RECEIPTREGISTER"),
            link: `/digit-ui/employee/reports/search/rainmaker-wns/WnsReceiptRegisterReport`,
            roles: ["WS_CEMP", "WS_APPROVER", "SW_CEMP", "SW_APPROVER"]
        },
        {
            label: t("ACTION_TEST_DEFAULTER_REPORT"),
            link: `/digit-ui/employee/reports/search/rainmaker-wns/WnsDefaulterReport`,
            roles: ["WS_CEMP"]
        },
        {
            label: t("ACTION_TEST_COLLECTION_REGISTER"),
            link: `/digit-ui/employee/reports/search/rainmaker-wns/WnsCollectionRegisterReport`,
            roles: ["WS_CEMP", "WS_APPROVER", "SW_CEMP", "SW_APPROVER"]
        },
    ]
    links = links.filter(link => link.roles ? checkForEmployee(link?.roles):true)
    if(links.length === 0) return null

    const propsForModuleCard = {
        Icon: <ReceiptIcon />,
        moduleName: t("ACTION_TEST_REPORTS"),
        kpis: [
            
        ],
        links
    };
    return <EmployeeModuleCard {...propsForModuleCard} />;
};

export default ReportsCard;
