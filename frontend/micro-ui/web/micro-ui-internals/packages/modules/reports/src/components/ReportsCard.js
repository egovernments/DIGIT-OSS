import { EmployeeModuleCard, ReceiptIcon } from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";

const ReportsCard = () => {
    if (!Digit.Utils.receiptsAccess()) {
        return null;
    }
    const tenantId = Digit.ULBService.getCurrentTenantId();
    const { t } = useTranslation();

    const propsForModuleCard = {
        Icon: <ReceiptIcon />,
        moduleName: t("ACTION_TEST_REPORTS"),
        kpis: [
            
        ],
        links: [
            {
                label: t("CR_SEARCH_COMMON_HEADER"),
                link: `/digit-ui/employee/receipts/inbox`,
            },
        ],
    };
    return <EmployeeModuleCard {...propsForModuleCard} />;
};

export default ReportsCard;
