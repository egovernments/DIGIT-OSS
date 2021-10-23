import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { OBPSIconSolidBg, EmployeeModuleCard } from "@egovernments/digit-ui-react-components";
import { FireNOCIcon } from "@egovernments/digit-ui-react-components/src";

const NOCEmployeeHomeCard = () => {
    const { t } = useTranslation()
  
    const tenantId = Digit.ULBService.getCurrentTenantId();
    const searchFormDefaultValues = {
        // mobileNumber: "",
        // applicationNumber
      }
  
      const filterFormDefaultValues = {
        moduleName: "noc-services",
        applicationStatus: "",
        locality: [],
        assignee: "ASSIGNED_TO_ALL"
      }
      const tableOrderFormDefaultValues = {
        sortBy: "",
        limit: 10,
        offset: 0,
        sortOrder: "DESC"
      }

      const formInitValue = Digit.SessionStorage.get("NOC.INBOX") || {
        filterForm: filterFormDefaultValues,
        searchForm: searchFormDefaultValues,
        tableForm: tableOrderFormDefaultValues
      }
  
    const { isLoading: isInboxLoading, data: {table , statuses, totalCount} = {} } = Digit.Hooks.obps.useBPAInbox({
      tenantId,
      filters: { ...formInitValue }
    });
  
    const propsForModuleCard = useMemo(()=>({
      Icon: <FireNOCIcon />,
      moduleName: t("MODULE_FIRENOC"),
      kpis:[
        {
            count: isInboxLoading ? "-" : totalCount ,
            label: t("TOTAL_FSM"),
            link: `/digit-ui/employee/noc/inbox`
        },
        {   
            count: "-",
            label: t("TOTAL_NEARING_SLA"),
            link: `/digit-ui/employee/noc/inbox`
        }  
      ],
      links: [
        {
          count: isInboxLoading ? "" : totalCount ,
          label: t("ES_COMMON_INBOX"),
          link: `/digit-ui/employee/noc/inbox`
        },
        {
          label: t("PROVISION_F_NOC"),
          link: `/digit-ui/employee/noc/inbox`
        },
        {
            label: t("NEW_F_NOC"),
            link: `/digit-ui/employee/noc/inbox`
          },
      ]
    }),[isInboxLoading, totalCount])
  
    return <EmployeeModuleCard {...propsForModuleCard} />
  }

  export default NOCEmployeeHomeCard