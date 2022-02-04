import React, { useContext, useMemo, Fragment } from "react";
import { useTranslation } from "react-i18next";
import { startOfMonth, endOfMonth, getTime } from "date-fns";
import { Loader, ResponseComposer } from "@egovernments/digit-ui-react-components";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis, Text } from "recharts";
import FilterContext from "./FilterContext";
import { useHistory } from "react-router-dom";

const barColors = ["#048BD0", "#FBC02D", "#8E29BF"];

const CustomHorizontalBarChart = ({
  data,
  xAxisType = "category",
  yAxisType = "number",
  xDataKey = "name",
  yDataKey = "",
  xAxisLabel = "",
  yAxisLabel = "",
  layout = "horizontal",
  title,
  showDrillDown = false,
}) => {
  const { id } = data;
  const { t } = useTranslation();
  const history = useHistory();
  const { value } = useContext(FilterContext);
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const { isLoading, data: response } = Digit.Hooks.dss.useGetChart({
    key: id,
    type: "metric",
    tenantId,
    requestDate: { ...value?.requestDate, startDate: value?.range?.startDate?.getTime(), endDate: value?.range?.endDate?.getTime() },
    filters: value?.filters,
  });
  const constructChartData = (data) => {
    let result = {};
    for (let i = 0; i < data?.length; i++) {
      const row = data[i];
      for (let j = 0; j < row.plots.length; j++) {
        const plot = row.plots[j];
        result[plot.name] = { ...result[plot.name], [t(row.headerName)]: plot.value, name: t(plot.name) };
      }
    }
    return Object.keys(result).map((key) => {
      return {
        name: key,
        ...result[key],
      };
    });
  };

  const goToDrillDownCharts = () => {
    history.push(`/digit-ui/employee/dss/drilldown?chart=${response?.responseData?.drillDownChartId}&ulb=${value?.filters?.tenantId}&title=${title}`);
  };

  const tooltipFormatter = (value, name) => {
    if (id === "fsmMonthlyWasteCal") {
      return [`${Math.round((value + Number.EPSILON) * 100) / 100} ${t("DSS_KL")}`, name];
    }
    return [Math.round((value + Number.EPSILON) * 100) / 100, name];
  };

  const chartData = useMemo(() => constructChartData(response?.responseData?.data), [response]);

  const renderLegend = (value) => <span style={{ fontSize: "14px", color: "#505A5F" }}>{value}</span>;

  const tickFormatter = (value) => {
    if (typeof value === "string") {
      return value.replace("-", ", ");
    }
    return value;
  };

  if (isLoading) {
    return <Loader />;
  }
  const formatXAxis = (tickFormat) => {
    if (tickFormat && typeof tickFormat == "string") {
      return `${tickFormat.slice(0, 16)}${tickFormat.length > 17? "..":""}`;
    }
    return `${tickFormat}`;
  };

  const bars = response?.responseData?.data?.map((bar) => bar?.headerName);
  return (
    <Fragment>
      <ResponsiveContainer
        width="89%"
        height={300}
        margin={{
          top: 5,
          right: 10,
          left: 10,
          bottom: 5,
        }}
      >
        {chartData?.length === 0 ? (
          <div className="no-data">
            <p>{t("DSS_NO_DATA")}</p>
          </div>
        ) : (
          <BarChart
            width="100%"
            height="100%"
            margin={{
              top: 5,
              right: 10,
              left: 10,
              bottom: 5,
            }}
            layout={layout}
            data={chartData}
            barGap={12}
            barSize={12}
          >
            <CartesianGrid />
            <YAxis
              dataKey={yDataKey}
              type={yAxisType}
              tick={{ fontSize: "12px", fill: "#505A5F" }}
              label={{
                value: yAxisLabel,
                angle: -90,
                position: "insideLeft",
                dy: 50,
                fontSize: "12px",
                fill: "#505A5F",
              }}
              tickCount={10}
              tickFormatter={(value) => formatXAxis(value)}
              unit={id === "fsmCapacityUtilization" ? "%" : ""}
            />
            <XAxis dataKey={xDataKey} type={xAxisType} tick={{ fontSize: "14px", fill: "#505A5F" }} tickCount={10} tickFormatter={tickFormatter} />
            {bars?.map((bar, id) => (
              <Bar key={id} dataKey={t(bar)} fill={barColors[id]} stackId={id > 1 ? 1 : id} />
            ))}
            <Legend formatter={renderLegend} iconType="circle" />
            <Tooltip cursor={false} formatter={tooltipFormatter} />
          </BarChart>
        )}
      </ResponsiveContainer>
      {showDrillDown && (
        <p className="showMore" onClick={goToDrillDownCharts}>
          {t("DSS_SHOW_MORE")}
        </p>
      )}
    </Fragment>
  );
};

export default CustomHorizontalBarChart;
