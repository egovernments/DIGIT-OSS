import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Loader, Header } from "@egovernments/digit-ui-react-components";

import DesktopInbox from "../../components/DesktopInbox";
import MobileInbox from "../../components/MobileInbox";

const Inbox = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useState({ filters: {}, search: "", sort: {} });

  const handleFilterChange = (filterParam) => {
    console.log("handleFilterChange", { ...searchParams, filters: filterParam });
    setSearchParams({ ...searchParams, filters: filterParam });
  };

  const onSearch = (params = "") => {
    setSearchParams({ ...searchParams, search: params });
  };

  // let complaints = Digit.Hooks.pgr.useInboxData(searchParams) || [];
  let { data: complaints, isLoading, revalidate } = Digit.Hooks.pgr.useInboxData(searchParams) || [];

  let isMobile = Digit.Utils.browser.isMobile;

  if (complaints?.length !== null) {
    if (isMobile) {
      return <MobileInbox data={complaints} isLoading={isLoading} onFilterChange={handleFilterChange} onSearch={onSearch} />;
    } else {
      return (
        <div>
          <Header>{t("ES_COMMON_INBOX")}</Header>
          <DesktopInbox data={complaints} isLoading={isLoading} onFilterChange={handleFilterChange} onSearch={onSearch} />;
        </div>
      );
    }
  } else {
    return <Loader />;
  }
};

export default Inbox;
