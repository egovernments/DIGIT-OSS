import { Loader } from "@egovernments/digit-ui-react-components";
import React, { Fragment, useContext, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import FilterContext from "./FilterContext";
import NoData from "./NoData";

const barColors = ["#048BD0", "#FBC02D", "#8E29BF", "#EA8A3B", "#0BABDE" , "#6E8459", "#D4351C","#0CF7E4","#F80BF4","#22F80B"]

const renderPlot = (plot,key,denomination) => {
  const plotValue = key?plot?.[key]:plot?.value || 0;
  if (plot?.symbol?.toLowerCase() === "amount") {
    switch (denomination) {
      case "Unit":
        return plotValue;
      case "Lac":
        return Number((plotValue / 100000).toFixed(2));
      case "Cr":
        return Number((plotValue/ 10000000).toFixed(2));
      default:
        return "";
    }
  } else if (plot?.symbol?.toLowerCase() === "number") {
    return Number(plotValue.toFixed(1));
  } else {
    return plotValue;
  }
};

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
  setChartDenomination
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
    moduleLevel: value?.moduleLevel
  });
  const constructChartData = (data,denomination) => {
    let result = {};
    for (let i = 0; i < data?.length; i++) {
      const row = data[i];
      for (let j = 0; j < row.plots.length; j++) {
        const plot = row.plots[j];
        result[plot.name] = { ...result[plot.name], [t(row.headerName)]: renderPlot(plot,'value',denomination), name: t(plot.name) };
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
      return [`${Digit.Utils.dss.formatter(Math.round((value + Number.EPSILON) * 100) / 100, 'number', value?.denomination, true, t)} ${t("DSS_KL")}`, name];
    }
    return [Digit.Utils.dss.formatter(Math.round((value + Number.EPSILON) * 100) / 100  , 'number', value?.denomination, true, t), name];
  };

  useEffect(()=>{
    if(response)
    setChartDenomination(response?.responseData?.data?.[0]?.headerSymbol);
  },[response])

  const chartData = useMemo(() => constructChartData(response?.responseData?.data,value?.denomination), [response,value?.denomination]);

  const renderLegend = (value) => <span style={{ fontSize: "14px", color: "#505A5F" }}>{value}</span>;

  const tickFormatter = (value) => {
    if (typeof value === "string") {
      return value.replace("-", ", ");
    }
    else if(typeof value === "number")
      return Digit.Utils.dss.formatter(value, 'number', value?.denomination, true, t);
    return value;
  };


  if (isLoading) {
    return <Loader />;
  }
  const formatXAxis = (tickFormat) => {
    // if (tickFormat && typeof tickFormat == "string") {
    //   return `${tickFormat.slice(0, 16)}${tickFormat.length > 17 ? ".." : ""}`;
    // }
    return `${tickFormat}`;
  };

  const bars = response?.responseData?.data?.map((bar) => bar?.headerName);
  return (
    <Fragment>
      <ResponsiveContainer
        width="94%"
        height={450}
        margin={{
          top: 5,
          right: 5,
          left: 5,
          bottom: 5,
        }}
      >
        {chartData?.length === 0 || !chartData ? (
          <NoData t={t} />
        ) : (
          <BarChart
            width="100%"
            height="100%"
            margin={{
              top: 5,
              right: 5,
              left: 5,
              bottom: 5,
            }}
            layout={layout}
            data={chartData}
            barGap={12}
            barSize={12}
          >
            <CartesianGrid strokeDasharray="2 2"/>
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
              tickFormatter={tickFormatter}
              unit={id === "fsmCapacityUtilization" ? "%" : ""}
              width={layout === "vertical" ? 120 : 60}
            />
            <XAxis dataKey={xDataKey} type={xAxisType} tick={{ fontSize: "14px", fill: "#505A5F" }} tickCount={10} tickFormatter={tickFormatter} />
            {bars?.map((bar, id) => ( <Bar key={id} dataKey={t(bar)} fill={barColors[id]} stackId={bars?.length > 2 ? 1 : id} />
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
