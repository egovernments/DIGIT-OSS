import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { OBPSIconSolidBg, EmployeeModuleCard } from "@egovernments/digit-ui-react-components";

const OBPSEmployeeHomeCard = () => {

    const { t } = useTranslation()
  
    const tenantId = Digit.ULBService.getCurrentTenantId();
  
    const searchFormDefaultValues = {}
  
    const filterFormDefaultValues = {
      moduleName: "bpa-services",
      businessService: {code: "BPA", name:t("BPA")},
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
  
    const formInitValue = {
      filterForm: filterFormDefaultValues,
      searchForm: searchFormDefaultValues,
      tableForm: tableOrderFormDefaultValues
    }
  
    const { isLoading: isInboxLoading, data: {table , statuses, totalCount} = {} } = Digit.Hooks.obps.useBPAInbox({
      tenantId,
      filters: { ...formInitValue }
    });
  
    const propsForModuleCard = useMemo(()=>({
      Icon: <OBPSIconSolidBg />,
      moduleName: t("MODULE_OBPS"),
      kpis:[
        {
            count: isInboxLoading ? "" : totalCount ,
            label: t("TOTAL_FSM"),
            link: `/digit-ui/employee/obps/inbox`
        },
        {   count:"-",
            label: t("TOTAL_NEARING_SLA"),
            link: `/digit-ui/employee/obps/inbox`
        }  
      ],
      links: [
        {
          count: isInboxLoading ? "" : totalCount ,
          label: t("ES_COMMON_INBOX"),
          link: `/digit-ui/employee/obps/inbox`
        },
        {
          count : "-",
          label: t("ES_COMMON_SEARCH_APPLICATION"),
          link: `/digit-ui/employee/obps/search/application`
        },
      ]
    }),[isInboxLoading, totalCount])
  
    return <EmployeeModuleCard {...propsForModuleCard} />
  }

  export default OBPSEmployeeHomeCard