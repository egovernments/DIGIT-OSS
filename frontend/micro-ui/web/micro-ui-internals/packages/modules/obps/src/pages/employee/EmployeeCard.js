import React, { useMemo, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { OBPSIconSolidBg, EmployeeModuleCard } from "@egovernments/digit-ui-react-components";
import { showHidingLinksForStakeholder, showHidingLinksForBPA } from "../../utils";
import { useLocation } from "react-router-dom";

const OBPSEmployeeHomeCard = () => {

    const [totalCount, setTotalCount] = useState(0);
    const [totalCountEs, setTotalCountEs] = useState(0);
    
    const { t } = useTranslation();
    const location = useLocation()
  
    const tenantId = Digit.ULBService.getCurrentTenantId();
    const stateCode = Digit.ULBService.getStateId();
  
    const stakeholderEmployeeRoles = [ { code: "BPAREG_DOC_VERIFIER", tenantId: stateCode }, { code: "BPAREG_APPROVER", tenantId: stateCode }];
    const bpaEmployeeRoles = [ "BPA_FIELD_INSPECTOR", "BPA_NOC_VERIFIER", "BPA_APPROVER", "BPA_VERIFIER", "CEMP"];

    const checkingForStakeholderRoles = showHidingLinksForStakeholder(stakeholderEmployeeRoles);
    const checkingForBPARoles = showHidingLinksForBPA(bpaEmployeeRoles);

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
      filters: { ...formInitValueOfStakeholder },
      config:{ enabled: !!checkingForStakeholderRoles }
    });

    const { isLoading: isInboxLoading, data : dataOfBPA } = Digit.Hooks.obps.useBPAInbox({
      tenantId,
      filters: { ...formInitValue },
      config:{ enabled: !!checkingForBPARoles }
    });

  useEffect(() => {
    if (!isInboxLoading && !isInboxLoadingOfStakeholder) {
      const bpaCount = dataOfBPA?.totalCount ? dataOfBPA?.totalCount : 0;
      const stakeHolderCount = dataOfStakeholder?.totalCount ? dataOfStakeholder?.totalCount : 0;
      setTotalCount(bpaCount + stakeHolderCount);
      setTotalCountEs(dataOfBPA?.nearingSlaCount||0 + dataOfStakeholder?.nearingSlaCount||0  )
    }
  }, [dataOfBPA, dataOfStakeholder]);

  useEffect(()=>{
    if (location.pathname === "/digit-ui/employee"){
      Digit.SessionStorage.del("OBPS.INBOX")
      Digit.SessionStorage.del("STAKEHOLDER.INBOX")
    }
  },[location.pathname])
    const propsForModuleCard = useMemo(()=>({
      Icon: <OBPSIconSolidBg />,
      moduleName: t("MODULE_OBPS"),
      kpis:[
        {
            count: !isInboxLoading && !isInboxLoadingOfStakeholder ? totalCount : "",
            label: t("TOTAL_FSM"),
            link: `/digit-ui/employee/obps/inbox`
        },
        {   count:!isInboxLoading && !isInboxLoadingOfStakeholder ? totalCountEs : "",
            label: t("TOTAL_NEARING_SLA"),
            link: `/digit-ui/employee/obps/inbox`
        }  
      ],
      links: [
        {
          count: isInboxLoadingOfStakeholder ? "" : dataOfStakeholder?.totalCount ,
          label: t("ES_COMMON_STAKEHOLDER_INBOX_LABEL"),
          link: `/digit-ui/employee/obps/stakeholder-inbox`,
          field: "STAKEHOLDER"
        },
        {
          count: isInboxLoading ? "" : dataOfBPA?.totalCount ,
          label: t("ES_COMMON_OBPS_INBOX_LABEL"),
          link: `/digit-ui/employee/obps/inbox`,
          field: "BPA"
        },
        {
          label: t("ES_COMMON_SEARCH_APPLICATION"),
          link: `/digit-ui/employee/obps/search/application`
        },
      ]
    }),[isInboxLoading, isInboxLoadingOfStakeholder, dataOfStakeholder, dataOfBPA, totalCount, totalCountEs]);

    if (!checkingForStakeholderRoles) {
      propsForModuleCard.links = propsForModuleCard.links.filter(obj => {
        return obj.field !== 'STAKEHOLDER';
      });
    }

    if (!checkingForBPARoles) {
      propsForModuleCard.links = propsForModuleCard.links.filter(obj => {
        return obj.field !== 'BPA';
      });
    }
  
    return checkingForBPARoles || checkingForStakeholderRoles ? <EmployeeModuleCard {...propsForModuleCard} /> : null
  }

  export default OBPSEmployeeHomeCard