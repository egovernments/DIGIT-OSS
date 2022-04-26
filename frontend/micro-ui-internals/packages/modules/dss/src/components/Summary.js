import React from "react";
import { useTranslation } from "react-i18next";
import { startOfMonth, endOfMonth, getTime } from "date-fns";
import { Card, Poll, Details, Loader, PrintIcon } from "@egovernments/digit-ui-react-components";
import { Link } from "react-router-dom";

const Chart = ({ data, todayValue = 15012, monthValue = 15.2, target = "72%", task = 133, monthlyTask = 4500, sla = "91%" }) => {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const { id, name, chartType } = data;
  const requestDate = {
    startDate: getTime(startOfMonth(new Date())),
    endDate: getTime(endOfMonth(new Date())),
    interval: "month",
    title: "",
  };
  const { isLoading, data: response } = Digit.Hooks.dss.useGetChart({
    key: id,
    type: chartType,
    tenantId,
    requestDate,
  });

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="blocks">
      <div>
        <p>{t(data?.name)}</p>
        <p>{response?.responseData?.data?.[0]?.headerValue}</p>
      </div>
      {/* <div>
        <p>This Month</p>
        <p>{ monthValue }</p>
      </div>
      <div>
        <p>Target</p>
        <p>{ target }</p>
      </div> */}
    </div>
  );
};

const Summary = ({
  title = "Total Collections",
  todayValue = 15012,
  monthValue = 15.2,
  target = "72%",
  task = 133,
  monthlyTask = 4500,
  sla = "91%",
  data,
}) => {
  const { t } = useTranslation();
  return (
    <Card style={{ flexBasis: "100%" }}>
      <div className="summary-wrapper">
        <Poll />
        <div className="wrapper-child">
          <div className="blocks">
            <p>{t(data?.name)}</p>
          </div>
          <div style={{ display: "flex" }}>
            {data.charts.map((chart, key) => (
              <Chart data={chart} key={key} />
            ))}
          </div>
        </div>
        <div className="wrapper-child">
          <div className="blocks cell-text" style={{ justifyContent: "space-around" }}>
            <p style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
              <Details />
              <Link to="/digit-ui/employee/dss/dashboard">View Details</Link>
            </p>
            <p style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
              <PrintIcon />
              Print
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default Summary;
