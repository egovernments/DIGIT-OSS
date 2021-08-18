import React, { Fragment, useContext } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardSubHeader, Rating } from "@egovernments/digit-ui-react-components";
import { startOfMonth, endOfMonth, getTime } from "date-fns";
import FilterContext from "./FilterContext";

const MetricData = ({ data, code }) => {
  const { value } = useContext(FilterContext);
  return (
    <div>
      <p className="heading-m" style={{ textAlign: "right", paddingTop: "0px" }}>
        {code === "citizenAvgRating" ? (
          <Rating currentRating={data?.headerValue} styles={{ width: "unset" }} starStyles={{ width: "25px" }} />
        ) : (
          Digit.Utils.dss.formatter(data?.headerValue, data.headerSymbol, value?.denomination, true)
        )}
      </p>
      {data.insight && (
        <div>
          <p className={`${data.insight.colorCode}`}>{data.insight.value}</p>
        </div>
      )}
    </div>
  );
};

const MetricChartRow = ({ data }) => {
  const { id, chartType } = data;
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const { t } = useTranslation();
  const { value } = useContext(FilterContext);
  const requestDate = {
    startDate: value?.range?.startDate.getTime(),
    endDate: value?.range?.endDate.getTime(),
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
    return false;
  }

  return (
    <div className="row">
      <div>{t(data.name)}</div>
      <MetricData data={response?.responseData?.data?.[0]} code={response?.responseData?.visualizationCode} />
      {/* <div>{`${displaySymbol(response.headerSymbol)} ${response.headerValue}`}</div> */}
    </div>
  );
};

const MetricChart = ({ data }) => {
  const { charts } = data;

  return (
    <>
      {charts.map((chart, index) => (
        <MetricChartRow data={chart} />
      ))}
    </>
  );
};

export default MetricChart;
