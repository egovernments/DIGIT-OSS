import { EmployeeModuleCard, ReceiptIcon } from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";

const ReportsCard = () => {
    // if (!Digit.Utils.receiptsAccess()) {
    //     return null;
    // }
    const tenantId = Digit.ULBService.getCurrentTenantId();
    const { t } = useTranslation();

    const propsForModuleCard = {
        Icon: <ReceiptIcon />,
        moduleName: t("ACTION_TEST_REPORTS"),
        kpis: [
            
        ],
        links: [
            {
                label: t("ACTION_TEST_DEFAULTER_REPORT"),
                link: `/digit-ui/employee/reports/search/pt-reports/DefaulterReport`,
            },
        ],
    };
    return <EmployeeModuleCard {...propsForModuleCard} />;
};

export default ReportsCard;
