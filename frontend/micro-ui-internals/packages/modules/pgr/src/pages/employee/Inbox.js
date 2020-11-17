import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import DesktopInbox from "../../components/DesktopInbox";
import { searchComplaints } from "../../redux/actions";

const Inbox = () => {
  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  console.log("state::::>", state);
  const { t } = useTranslation();
  const [isDesktop, setIsDesktop] = useState(true);
  const getComplaints = useCallback(() => dispatch(searchComplaints()), [dispatch]);
  const complaints = state.complaints.list;

  const handleFilterChange = (filters) => {
    console.log("handleFilterChange hi:", filters);
  };

  useEffect(() => {
    getComplaints();
  }, [getComplaints]);

  return complaints ? <DesktopInbox data={complaints} onFilterChange={handleFilterChange} /> : "";
};

export default Inbox;
