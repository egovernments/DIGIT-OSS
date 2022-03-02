import React, { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ArrowRightInbox, ShippingTruck } from "@egovernments/digit-ui-react-components";

const ArrowRight = ({ to }) => (
  <Link to={to}>
    <ArrowRightInbox />
  </Link>
);

const DSSCard = () => {
  const { t } = useTranslation();
  const ADMIN = Digit.UserService.hasAccess("FSM_ADMIN") || Digit.UserService.hasAccess("EMPLOYEE ADMIN") || false;
  return (
    <>
      {null ? (
        <div className="employeeCard card-home">
          <div className="complaint-links-container">
            <div className="header">
              <span className="logo">
                <ShippingTruck />
              </span>
              <span className="text">{t("ES_TITLE_DSS")}</span>
            </div>
            <div className="body">
              <span className="link">
                <Link to={`/digit-ui/employee/dss/dashboard/fsm`}>{t("ES_TITLE_DSS_OVERVIEW")}</Link>
                {<ArrowRight to={`/digit-ui/employee/dss/dashboard/fsm`} />}
              </span>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default DSSCard;
