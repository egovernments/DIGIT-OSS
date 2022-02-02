import { Loader } from "@egovernments/digit-ui-react-components";
import React, { Fragment, useContext, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts";
import FilterContext from "./FilterContext";

const formatValue = (value, symbol) => {
  if (symbol?.toLowerCase() === "percentage") {
    const Pformatter = new Intl.NumberFormat("en-IN", { maximumSignificantDigits: 3 });
    return `${parseFloat(Pformatter.format(Number(value)) || "0").toFixed(2)}`;
  } else {
    return value;
  }
};

const CustomLabel = ({ x, y, name, stroke, value }) => {
  const { t } = useTranslation();
  return (
    <>
      <text x={x} y={y} dx={-65} dy={10} fill={stroke} width="30">
        {`${value}%`}
      </text>
      <text x={x} y={y} dx={-170} dy={10}>
        {t(name)}
      </text>
    </>
  );
};

const CustomBarChart = ({
  xDataKey = "value",
  xAxisType = "number",
  yAxisType = "category",
  yDataKey = "name",
  hideAxis = true,
  layout = "vertical",
  fillColor = "#00703C",
  showGrid = false,
  showDrillDown = false,
  data,
  title,
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
  const chartData = useMemo(() => {
    if (!response) return null;
    return response?.responseData?.data?.map((bar) => {
      let plotValue = bar?.plots?.[0].value || 0;
      return {
        name: t(bar?.plots?.[0].name),
        value: formatValue(plotValue, bar?.plots?.[0].symbol),
      };
    });
  }, [response]);

  const goToDrillDownCharts = () => {
    history.push(`/digit-ui/employee/dss/drilldown?chart=${response?.responseData?.drillDownChartId}&ulb=${value?.filters?.tenantId}&title=${title}`);
  };
  if (isLoading) {
    return <Loader />;
  }
  if (chartData?.length === 0) {
    return (
      <div className="no-data">
        <p>{t("DSS_NO_DATA")}</p>
      </div>
    );
  }
  return (
    <Fragment>
      <ResponsiveContainer width="99%" height={320}>
        <BarChart width="100%" height="100%" data={chartData} layout={layout} maxBarSize={10} margin={{ left: 170 }} barGap={70}>
          {showGrid && <CartesianGrid />}
          <XAxis hide={hideAxis} dataKey={xDataKey} type={xAxisType} domain={[0, 100]} />
          <YAxis dataKey={yDataKey} hide={hideAxis} type={yAxisType} padding={{ right: 40 }} />
          <Bar
            dataKey={xDataKey}
            fill={fillColor}
            background={{ fill: "#D6D5D4", radius: 10 }}
            label={<CustomLabel stroke={fillColor} />}
            radius={[10, 10, 10, 10]}
          />
        </BarChart>
      </ResponsiveContainer>
      {showDrillDown && (
        <p className="showMore" onClick={goToDrillDownCharts}>
          {t("DSS_SHOW_MORE")}
        </p>
      )}
    </Fragment>
  );
};

export default CustomBarChart;
