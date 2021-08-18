import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRightInbox, ShippingTruck } from "@egovernments/digit-ui-react-components";

const ArrowRight = ({ to }) => (
  <Link to={to}>
    <ArrowRightInbox />
  </Link>
);

const FSMCard = () => {
  const { t } = useTranslation();
  const DSO = Digit.UserService.hasAccess(["FSM_DSO"]) || false;
  const COLLECTOR = Digit.UserService.hasAccess("FSM_COLLECTOR") || false;
  const FSM_ADMIN = Digit.UserService.hasAccess("FSM_ADMIN") || false;
  const FSM_EDITOR = Digit.UserService.hasAccess("FSM_EDITOR_EMP") || false;
  const FSM_CREATOR = Digit.UserService.hasAccess("FSM_CREATOR_EMP") || false;
  const isFSTPOperator = Digit.UserService.hasAccess("FSM_EMP_FSTPO") || false;

  const [total, setTotal] = useState("-");

  // Septage ready for Disposal ( 10 KL)
  // Septage disposed today ( 50 KL)
  const tenantId = Digit.ULBService.getCurrentTenantId();

  // TO DO get day time

  if (!Digit.Utils.fsmAccess()) {
    return null;
  }

  const config = {
    enabled: isFSTPOperator ? true : false,
    select: (data) => {
      const info = data.vehicleTrip.reduce(
        (info, trip) => {
          const totalVol = trip.tripDetails.reduce((vol, details) => details.volume + vol, 0);
          info[t("ES_READY_FOR_DISPOSAL")] += totalVol / 1000;
          return info;
        },
        { [t("ES_READY_FOR_DISPOSAL")]: 0 }
      );
      info[t("ES_READY_FOR_DISPOSAL")] = `(${info[t("ES_READY_FOR_DISPOSAL")]} KL)`;
      return info;
    },
  };

  const { isLoading, data: info, isSuccess } = Digit.Hooks.fsm.useVehicleSearch({
    tenantId,
    filters: { applicationStatus: "WAITING_FOR_DISPOSAL" },
    config,
  });

  const filters = {
    sortBy: "createdTime",
    sortOrder: "DESC",
    total: true,
  };

  const getUUIDFilter = () => {
    if (FSM_EDITOR || FSM_CREATOR || COLLECTOR || FSM_ADMIN) return { uuid: { code: "ASSIGNED_TO_ALL", name: t("ES_INBOX_ASSIGNED_TO_ALL") } };
    else return { uuid: { code: "ASSIGNED_TO_ME", name: t("ES_INBOX_ASSIGNED_TO_ME") } };
  };

  const { data: inbox, isFetching: pendingApprovalRefetching } = Digit.Hooks.fsm.useInbox(tenantId, { ...filters, ...getUUIDFilter() }, null, {
    enabled: !isFSTPOperator ? true : false,
  });

  useEffect(() => {
    if (inbox) {
      const total = inbox?.[0]?.totalCount || 0;
      setTotal(total);
    }
  }, [inbox]);

  if (isFSTPOperator) {
    return (
      <div className="employeeCard card-home">
        <div className="complaint-links-container">
          <div className="header">
            <span className="logo">
              <ShippingTruck />
            </span>
            <span className="text">{t("ES_TITLE_VEHICLE_LOG")}</span>
          </div>
          <div className="body">
            {info && (
              <div className="employeeCard-info-box">
                {Object.keys(info).map((key, index) => {
                  return (
                    <div key={index} className="employeeCard-info-data">
                      <span>{t(key)}</span>
                      <span>{t(info[key])}</span>
                    </div>
                  );
                })}
              </div>
            )}
            <span className="link">
              <Link to={`/digit-ui/employee/fsm/fstp-inbox`}>
                <span>{t("ES_TITLE_INBOX")}</span>
              </Link>
              {<ArrowRight to={`/digit-ui/employee/fsm/fstp-inbox`} />}
            </span>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="employeeCard card-home">
      <div className="complaint-links-container">
        <div className="header">
          <span className="logo">
            <ShippingTruck />
          </span>
          <span className="text">{t("ES_TITLE_FAECAL_SLUDGE_MGMT")}</span>
        </div>
        <div className="body">
          <span className="link">
            <Link to={`/digit-ui/employee/fsm/inbox`}>{t("ES_TITLE_INBOX")}</Link>
            <span className="inbox-total">{" " + total || "-"}</span>
            {<ArrowRight to={`/digit-ui/employee/fsm/inbox`} />}
          </span>
          {!DSO && !COLLECTOR && !FSM_EDITOR && (
            <React.Fragment>
              <span className="link">
                <Link to={`/digit-ui/employee/fsm/new-application`}>{t("ES_TITLE_NEW_DESULDGING_APPLICATION")}</Link>
              </span>
            </React.Fragment>
          )}
        </div>
      </div>
    </div>
  );
};
export default FSMCard;
