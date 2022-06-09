import { EmployeeModuleCard, ReceiptIcon } from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";
import { getDefaultReceiptService } from "./utils";

const ReceiptsCard = () => {
  if (!Digit.Utils.receiptsAccess()) {
    return null;
  }
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const { t } = useTranslation();
  const searchParams = {
    tenantId: tenantId,
    businessServices: getDefaultReceiptService(),
    isCountRequest: true,
  };
  const { isLoading, isError, error, data, ...rest } = Digit.Hooks.receipts.useReceiptsSearch(searchParams, tenantId, [], false);
  const propsForModuleCard = {
    Icon: <ReceiptIcon />,
    moduleName: t("ACTION_TEST_RECEIPTS"),
    kpis: [
      {
        count: isLoading ? "-" : data?.Count,
        label: t("CR_TOTAL_RECEIPTS"),
        link: `/digit-ui/employee/receipts/inbox`,
      },
    ],
    links: [
      {
        count: isLoading ? "-" : data?.Count,
        label: t("CR_SEARCH_COMMON_HEADER"),
        link: `/digit-ui/employee/receipts/inbox`,
      },
    ],
  };
  return <EmployeeModuleCard {...propsForModuleCard} />;
};

export default ReceiptsCard;
