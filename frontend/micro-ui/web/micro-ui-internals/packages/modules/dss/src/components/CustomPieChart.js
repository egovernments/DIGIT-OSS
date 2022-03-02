import React, { useContext, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { startOfMonth, endOfMonth, getTime } from "date-fns";
import { ResponsiveContainer, Cell, Legend, Pie, PieChart, Tooltip } from "recharts";
import { Card, Loader } from "@egovernments/digit-ui-react-components";
import FilterContext from "./FilterContext";

const COLORS = ["#048BD0", "#FBC02D", "#8E29BF", "#EA8A3B", "#0BABDE", "#FFBB28", "#FF8042"];

const CustomPieChart = ({ dataKey = "value", data }) => {
  const { id } = data;
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const { t } = useTranslation();
  const { value } = useContext(FilterContext);
  const { isLoading, data: response } = Digit.Hooks.dss.useGetChart({
    key: id,
    type: "metric",
    tenantId,
    requestDate: { ...value?.requestDate, startDate: value?.range?.startDate?.getTime(), endDate: value?.range?.endDate?.getTime() },
    filters: value?.filters,
  });

  const chartData = useMemo(() => {
    if (!response) return null;
    const compareFn = (a, b) => b.value - a.value;
    return response?.responseData?.data?.[0]?.plots.sort(compareFn).reduce((acc, plot, index) => {
      if (index < 4) acc = acc.concat(plot);
      else if (index === 4) acc = acc.concat({ label: null, name: "DSS.OTHERS", value: plot?.value, symbol: "amount" });
      else acc[4].value += plot?.value;
      return acc;
    }, []);
  }, [response]);

  const renderLegend = (value) => <span style={{ fontSize: "14px", color: "#505A5F" }}>{t(`PROPERTYTYPE_MASTERS_${value}`)}</span>;

  const renderCustomLabel = (args) => {
    const { value, endAngle, startAngle, x, cx, y, cy, percent, name } = args;
    const diffAngle = endAngle - startAngle;
    if (diffAngle < 7) {
      return null;
    }
    return (
      <text
        x={x}
        cx={cx}
        y={y}
        cy={cy}
        percent={percent}
        name={name}
        fill="#505A5F"
        alignmentBaseline="middle"
        className="recharts-pie-label-text"
        fontSize="14px"
        textAnchor={x > cx ? "start" : "end"}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const renderTooltip = ({ payload, label }) => {
    return (
      <div style={{
        margin: "0px",
        padding: "10px",
        backgroundColor: "rgb(255, 255, 255)",
        border: "1px solid rgb(204, 204, 204)",
        whiteSpace: "nowrap",
      }}>
        <p className="recharts-tooltip-label">{`${t(`PROPERTYTYPE_MASTERS_${payload?.[0]?.name}`)}: ${Digit.Utils.dss.formatter(payload?.[0]?.value, payload?.[0]?.payload?.payload?.symbol, value?.denomination, false)}`}</p>
      </div>
    );
  }

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
    <ResponsiveContainer width="99%" height={340}>
      <PieChart>
        <Pie
          data={chartData}
          dataKey={dataKey}
          cy={130}
          innerRadius={70}
          outerRadius={90}
          margin={{ top: 5 }}
          fill="#8884d8"
          label={renderCustomLabel}
          labelLine={false}
          isAnimationActive={false}
        >
          {response?.responseData?.data?.[0]?.plots.map((entry, index) => (
            <Cell key={`cell-`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip content={renderTooltip} />
        <Legend layout="horizontal" align="bottom" iconType="circle" formatter={renderLegend} />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default CustomPieChart;
