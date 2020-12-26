import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Loader } from "@egovernments/digit-ui-react-components";

import DesktopInbox from "../../components/DesktopInbox";
import MobileInbox from "../../components/MobileInbox";
import useInboxData from "../../hooks/useInboxData";

const Inbox = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useState({ filters: {}, search: "", sort: {} });

  const handleFilterChange = (filterParam) => {
    setSearchParams({ ...searchParams, filters: filterParam });
  };

  const onSearch = (params = "") => {
    console.log("onSubmit--------", params);
    setSearchParams({ ...searchParams, search: params });
  };

  let complaints = useInboxData(searchParams) || [];

  let isMobile = window.mobileCheck();

  if (complaints.length !== null) {
    if (isMobile) {
      return <MobileInbox data={complaints} onFilterChange={handleFilterChange} />;
    } else {
      return <DesktopInbox data={complaints} onFilterChange={handleFilterChange} onSearch={onSearch} />;
    }
  } else {
    return <Loader />;
  }
};

export default Inbox;
