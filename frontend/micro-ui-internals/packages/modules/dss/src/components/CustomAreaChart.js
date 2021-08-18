import React, { useContext } from "react";
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, Line, LineChart, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { Card, CardHeader, Loader } from "@egovernments/digit-ui-react-components";
import { startOfMonth, endOfMonth, sub, getTime } from "date-fns";
import FilterContext from "./FilterContext";

const getValue = (plot) => plot.value;

const CustomAreaChart = ({ xDataKey = "name", yDataKey = getValue, data }) => {
  const { id } = data;
  const tenantId = Digit.ULBService.getCurrentTenantId();
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

  const renderPlot = (plot) => {
    const { denomination } = value;
    switch (denomination) {
      case "Unit":
        return plot?.value;
      case "Lac":
        return Number((plot.value / 100000).toFixed(2));
      case "Cr":
        return Number((plot.value / 10000000).toFixed(2));
    }
  };

  const renderLegend = (value) => <span>{value}</span>;

  if (isLoading) {
    return <Loader />;
  }
  return (
    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", height: "85%" }}>
      <ResponsiveContainer width="99%" height={300}>
        <AreaChart width="100%" height="100%" data={response?.responseData?.data?.[0]?.plots}>
          <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#FF0000" stopOpacity={0.5} />
              <stop offset="95%" stopColor="#F89462" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid />
          <Tooltip />
          <XAxis dataKey={xDataKey} />
          <YAxis />
          <Legend
            verticalAlign="bottom"
            payload={[{ value: response?.responseData?.data?.[0]?.headerName, type: "circle", id: "id", color: "#F47738" }]}
            formatter={renderLegend}
          />
          <Area type="monotone" dataKey={renderPlot} stroke="#FF6726" fill="url(#colorUv)" dot={true} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomAreaChart;
