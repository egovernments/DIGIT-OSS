import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import DesktopInbox from "../../components/DesktopInbox";
import MobileInbox from "../../components/MobileInbox";
import { applyInboxFilters } from "../../redux/actions";

const Inbox = () => {
  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  const { t } = useTranslation();
  const [isDesktop, setIsDesktop] = useState(true);
  const getFilteredComplaints = useCallback((params) => dispatch(applyInboxFilters(params)), [dispatch]);
  const complaints = state.pgr.complaints.response || [];

  console.log("complaints:::::>", complaints);

  const handleFilterChange = (filters) => {
    console.log("handleFilterChange hi:", filters);
  };

  const onSubmit = (params = {}) => {
    console.log("onSubmit--------", params);
    getFilteredComplaints({ params });
  };

  // let tableData = complaints.map((obj) => ({
  //   "Complaint No.": obj.businessId,
  //   "Complaint Sub Type": "Complaint Sub Type",
  //   Locality: "Amritsar",
  //   Status: "assinged",
  //   "Task Owner": "test",
  //   "SLA Remaining": obj.businesssServiceSla,
  // }));

  useEffect(() => {
    getFilteredComplaints();
  }, [getFilteredComplaints]);

  let isMobile = window.mobileCheck();
  console.log("window.mobileCheck:", isMobile);
  if (complaints.length > 0) {
    if (isMobile) {
      return <MobileInbox data={complaints} onFilterChange={handleFilterChange} />;
    } else {
      return <DesktopInbox data={complaints} onFilterChange={handleFilterChange} onSubmit={onSubmit} />;
    }
  } else {
    return <div></div>;
  }
};

export default Inbox;
