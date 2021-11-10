import React, { useMemo, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { OBPSIconSolidBg, EmployeeModuleCard } from "@egovernments/digit-ui-react-components";

const OBPSEmployeeHomeCard = () => {

    const [totalCount, setTotalCount] = useState(0);
    const { t } = useTranslation();
  
    const tenantId = Digit.ULBService.getCurrentTenantId();
  
    const searchFormDefaultValues = {}
  
    const filterFormDefaultValues = {
      moduleName: "bpa-services",
      applicationStatus: "",
      locality: [],
      assignee: "ASSIGNED_TO_ALL",
      applicationType: []
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

    const searchFormDefaultValuesOfStakeholder = {}

    const filterFormDefaultValuesOfStakeholder = {
      moduleName: "BPAREG",
      // businessService: {code: "BPAREG", name:t("BPAREG")},
      applicationStatus: "",
      locality: [],
      assignee: "ASSIGNED_TO_ALL"
    }
    const tableOrderFormDefaultValuesOfStakeholder = {
      sortBy: "",
      limit: 10,
      offset: 0,
      sortOrder: "DESC"
    }
  
    const formInitValueOfStakeholder = {
      filterForm: filterFormDefaultValuesOfStakeholder,
      searchForm: searchFormDefaultValuesOfStakeholder,
      tableForm: tableOrderFormDefaultValuesOfStakeholder
    }
  
    const { isLoading: isInboxLoadingOfStakeholder, data: dataOfStakeholder } = Digit.Hooks.obps.useBPAInbox({
      tenantId,
      filters: { ...formInitValueOfStakeholder }
    });

    const { isLoading: isInboxLoading, data : dataOfBPA } = Digit.Hooks.obps.useBPAInbox({
      tenantId,
      filters: { ...formInitValue }
    });

  useEffect(() => {
    if (!isInboxLoading && !isInboxLoadingOfStakeholder) {
      const bpaCount = dataOfBPA?.totalCount ? dataOfBPA?.totalCount : 0;
      const stakeHolderCount = dataOfStakeholder?.totalCount ? dataOfStakeholder?.totalCount : 0;
      setTotalCount(bpaCount + stakeHolderCount);
    }
  }, [dataOfBPA, dataOfStakeholder]);

  
    const propsForModuleCard = useMemo(()=>({
      Icon: <OBPSIconSolidBg />,
      moduleName: t("MODULE_OBPS"),
      kpis:[
        {
            count: !isInboxLoading && !isInboxLoadingOfStakeholder ? totalCount : "",
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
          count: isInboxLoadingOfStakeholder ? "" : dataOfStakeholder?.totalCount ,
          label: t("ES_COMMON_STAKEHOLDER_INBOX_LABEL"),
          link: `/digit-ui/employee/obps/stakeholder-inbox`
        },
        {
          count: isInboxLoading ? "" : dataOfBPA?.totalCount ,
          label: t("ES_COMMON_OBPS_INBOX_LABEL"),
          link: `/digit-ui/employee/obps/inbox`
        },
        {
          // count : "-",
          label: t("ES_COMMON_SEARCH_APPLICATION"),
          link: `/digit-ui/employee/obps/search/application`
        },
      ]
    }),[isInboxLoading, isInboxLoadingOfStakeholder, dataOfStakeholder, dataOfBPA, totalCount])
  
    return <EmployeeModuleCard {...propsForModuleCard} />
  }

  export default OBPSEmployeeHomeCard