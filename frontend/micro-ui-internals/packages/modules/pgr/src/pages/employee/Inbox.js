import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Loader } from "@egovernments/digit-ui-react-components";

import DesktopInbox from "../../components/DesktopInbox";
import MobileInbox from "../../components/MobileInbox";
import useInboxData from "../../hooks/useInboxData";
import { applyInboxFilters } from "../../redux/actions";

const Inbox = () => {
  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  const { t } = useTranslation();
  const getFilteredComplaints = useCallback((params) => dispatch(applyInboxFilters(params)), [dispatch]);
  const [searchParams, setSearchParams] = useState({ filters: {}, search: "", sort: {} });
  //const complaints = state.pgr.complaints.response || [];

  const handleFilterChange = (filterParam) => {
    setSearchParams({ ...searchParams, filters: filterParam });
  };

  const onSearch = (params = "") => {
    console.log("onSubmit--------", params);
    setSearchParams({ ...searchParams, search: params });
    //getFilteredComplaints({ params });
  };

  let complaints = useInboxData(searchParams) || [];

  console.log("complaints:", complaints);

  useEffect(() => {
    getFilteredComplaints();
  }, [getFilteredComplaints]);

  let isMobile = window.mobileCheck();
  console.log("window.mobileCheck:", isMobile);
  console.log("searchParams:::::>", searchParams);
  if (complaints.length > 0) {
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
