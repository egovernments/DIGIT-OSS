import React, { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import Complaint from "../components/Complaint";
import { searchComplaints } from "../redux/actions";
import { Header } from "@egovernments/digit-ui-react-components";

const ComplaintsPage = () => {
  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  const { t } = useTranslation();

  const complaints = state.complaints.list;
  const getComplaints = useCallback(() => dispatch(searchComplaints()), [dispatch]);

  useEffect(() => {
    getComplaints();
  }, [getComplaints]);

  return (
    <React.Fragment>
      <Header>{t("CS_HOME_MY_COMPLAINTS")}</Header>
      {complaints &&
        complaints.length > 0 &&
        complaints.map(({ service }, index) => (
          <div key={index}>
            <Complaint data={service} />
          </div>
        ))}
    </React.Fragment>
  );
};

export default ComplaintsPage;
