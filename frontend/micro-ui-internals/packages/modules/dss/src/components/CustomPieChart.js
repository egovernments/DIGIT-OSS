import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { startOfMonth, endOfMonth, getTime } from "date-fns";
import { ResponsiveContainer, Cell, Legend, Pie, PieChart, Tooltip } from "recharts";
import { Card, Loader } from "@egovernments/digit-ui-react-components";
import FilterContext from "./FilterContext";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const CustomPieChart = ({ dataKey = "value", data }) => {
  const { id } = data;
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
    type: "metric",
    tenantId,
    requestDate,
  });

  const renderLegend = (value) => <span>{t(`PROPERTYTYPE_MASTERS_${value}`)}</span>;

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, value, index, startAngle, endAngle }) => {
    const diffAngle = endAngle - startAngle;
    const delta = (360 - diffAngle) / 40 - 1;
    if (diffAngle < 5) {
      return null;
    }
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius);
    const x = cx + (radius + delta) * Math.cos(-midAngle * RADIAN);
    const y = cy + (radius + delta * delta) * Math.sin(-midAngle * RADIAN);
    return (
      <text x={x} y={y} textAnchor={x > cx ? "start" : "end"} dominantBaseline="central">
        {value}
      </text>
    );
  };

  if (isLoading) {
    return <Loader />;
  }
  return (
    <ResponsiveContainer width="99%" height={340}>
      <PieChart margin={{ bottom: 15 }}>
        <Pie
          data={response?.responseData?.data?.[0]?.plots}
          dataKey={dataKey}
          cy={100}
          innerRadius={50}
          outerRadius={70}
          margin={{ bottom: 10 }}
          fill="#8884d8"
          label={renderCustomLabel}
          labelLine={false}
        >
          {response?.responseData?.data?.[0]?.plots.map((entry, index) => (
            <Cell key={`cell-`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend layout="vertical" align="bottom" iconType="circle" formatter={renderLegend} />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default CustomPieChart;
