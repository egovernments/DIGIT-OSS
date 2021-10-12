import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import MobileInbox from "./MobileInbox";

const Inbox = ({ tenants, parentRoute }) => {
  const { t } = useTranslation()
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const stateCode = Digit.ULBService.getStateId();
  const [searchParams, setSearchParams] = useState({});
  let isMobile = window.Digit.Utils.browser.isMobile();
  const userInfo = Digit.UserService.getUser();
  const inboxSearchParams = { limit: 10, offset: 0, mobileNumber: userInfo?.info?.mobileNumber }
  
  const { isLoading: bpaLoading, data: bpaInboxData } = Digit.Hooks.obps.useBPAInbox({
    tenantId: stateCode,
    moduleName: "bpa-services",
    businessService: ["BPA_LOW", "BPA", "BPA_OC"],
    filters: { ...inboxSearchParams },
    config: {}
  });

  const getSearchFields = () => {
    return [
      {
        label: t("BPA_COMMON_APP_NO"),
        name: "applicationNo",
        type: "ulb",
      },
    ]
  }

  const links = [
    {
      text: t("NEW_PUBLIC_MESSAGE_BUTTON_LABEL"),
      link: "/digit-ui/employee/engagement/messages/create",
    }
  ]

  const onSearch = (params) => {
    setSearchParams({ ...searchParams, ...params });
  }

  const handleFilterChange = (data) => {
    setSearchParams({ ...searchParams, ...data })
  }

  if (isMobile) {
    return (
      <MobileInbox
        data={bpaInboxData}
        searchParams={searchParams}
        searchFields={getSearchFields()}
        t={t}
        onFilterChange={handleFilterChange}
        onSearch={onSearch}
        isLoading={bpaLoading}
        title = {"EVENTS_PUBLIC_MESSAGE_NOTICE_HEADER"}
        iconName={"calender"}
        links={links}
      />
    )
  } 
}

export default Inbox; 
