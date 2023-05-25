import React, { Fragment, useContext } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardSubHeader, Rating, UpwardArrow, DownwardArrow } from "@egovernments/digit-ui-react-components";
import { startOfMonth, endOfMonth, getTime } from "date-fns";
import FilterContext from "./FilterContext";

const MetricData = ({ t, data, code }) => {
  const { value } = useContext(FilterContext);
  return (
    <div>
      <p className="heading-m" style={{ textAlign: "right", paddingTop: "0px" }}>
        {code === "citizenAvgRating" ? (
          <Rating currentRating={Math.round(data?.headerValue * 10) / 10} styles={{ width: "unset" }} starStyles={{ width: "25px" }} />
        ) : (
          `${Digit.Utils.dss.formatter(data?.headerValue, data?.headerSymbol, value?.denomination, true)} ${
            code === "totalSludgeTreated" ? t(`DSS_KL`) : ""
          }`
        )}
      </p>
      {data?.insight && (
        <div>
          {data?.insight?.indicator === "upper_green" ? <UpwardArrow marginRight={9} /> : <DownwardArrow marginRight={9} />}
          <p className={`${data?.insight.colorCode}`}>{data?.insight.value.replace(/[+-]/g, "")}</p>
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
  const { isLoading, data: response } = Digit.Hooks.dss.useGetChart({
    key: id,
    type: chartType,
    tenantId,
    requestDate: { ...value?.requestDate, startDate: value?.range?.startDate?.getTime(), endDate: value?.range?.endDate?.getTime() },
    filters: value?.filters,
  });

  if (isLoading) {
    return false;
  }

  return (
    <div className="row">
      <div>{t(data.name)}</div>
      <MetricData t={t} data={response?.responseData?.data?.[0]} code={response?.responseData?.visualizationCode} />
      {/* <div>{`${displaySymbol(response.headerSymbol)} ${response.headerValue}`}</div> */}
    </div>
  );
};

const MetricChart = ({ data }) => {
  const { charts } = data;
  return (
    <>
      {charts.map((chart, index) => (
        <MetricChartRow data={chart} key={index} />
      ))}
    </>
  );
};

export default MetricChart;
