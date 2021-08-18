import React, { useContext, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { startOfMonth, endOfMonth, getTime } from "date-fns";
import { Loader, ResponseComposer } from "@egovernments/digit-ui-react-components";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import FilterContext from "./FilterContext";

const barColors = ["#61A0FF", "#ECC478", "#ECC478"];

const CustomHorizontalBarChart = ({ data }) => {
  const { id } = data;
  const { t } = useTranslation();
  const { value } = useContext(FilterContext);
  const tenantId = Digit.ULBService.getCurrentTenantId();
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

  const constructChartData = (data) => {
    let result = {};
    for (let i = 0; i < data?.length; i++) {
      const row = data[i];
      for (let j = 0; j < row.plots.length; j++) {
        const plot = row.plots[j];
        result[plot.name] = { ...result[plot.name], [row.headerName]: plot.value };
      }
    }
    return Object.keys(result).map((key) => {
      return {
        name: key,
        ...result[key],
      };
    });
  };

  const chartData = useMemo(() => constructChartData(response?.responseData?.data), [response]);

  const renderLegend = (value) => <span>{value}</span>;

  if (isLoading) {
    return <Loader />;
  }

  const bars = response?.responseData?.data?.map((bar) => bar?.headerName);

  return (
    <ResponsiveContainer width="99%" height={300}>
      <BarChart
        width="100%"
        height="100%"
        // layout="vertical"
        data={chartData}
        barGap={14}
        barSize={15}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <YAxis />
        <XAxis dataKey="name" type="category" />
        {bars.map((bar, id) => (
          <Bar key={id} dataKey={bar} fill={barColors[id]} />
        ))}
        <Legend formatter={renderLegend} />
        {/* <Tooltip /> */}
      </BarChart>
    </ResponsiveContainer>
  );
};

export default CustomHorizontalBarChart;
