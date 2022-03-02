import React, { Fragment, useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import CustomAreaChart from "./CustomAreaChart";
import CustomBarChart from "./CustomBarChart";
import CustomHorizontalBarChart from "./CustomHorizontalBarChart";
import CustomPieChart from "./CustomPieChart";
import CustomTable from "./CustomTable";
import FilterContext from "./FilterContext";
import GenericChart from "./GenericChart";
import MetricChart from "./MetricChart";
import Summary from "./Summary";

let index = 1;

const Layout = ({ rowData }) => {
  const { t } = useTranslation();
  const { value } = useContext(FilterContext);
  const [searchQuery, onSearch] = useState("");

  const renderChart = (chart, title) => {
    switch (chart.chartType) {
      case "table":
        return <CustomTable data={chart} onSearch={searchQuery} title={title} />;
      case "donut":
        return <CustomPieChart data={chart} title={title} />;
      case "line":
        return <CustomAreaChart data={chart} title={title} />;
      case "horizontalBar":
        return (
          <CustomHorizontalBarChart
            data={chart}
            xAxisType="number"
            yAxisType="category"
            layout="vertical"
            yDataKey="name"
            xDataKey=""
            showDrillDown={true}
            title={title}
          />
        );
      case "bar":
        return <CustomHorizontalBarChart data={chart} title={title} yAxisLabel={`${t("DSS_WASTE_RECIEVED")} ${t(`DSS_WASTE_UNIT`)}`} />;
    }
  };

  const renderVisualizer = (visualizer, key) => {
    switch (visualizer.vizType) {
      case "metric-collection":
        return (
          <GenericChart header={visualizer.name} className="metricsTable" key={key}>
            <MetricChart data={visualizer} />
          </GenericChart>
        );
      case "chart":
        if (
          value?.filters?.tenantId?.length === 0 &&
          (visualizer?.charts?.[0].id === "fsmTopDsoByPerformance" || visualizer?.charts?.[0].id === "fsmBottomDsoByPerformance")
        )
          return null;
        return (
          <GenericChart
            key={key}
            header={visualizer.name}
            showDownload={visualizer?.charts?.[0].chartType === "table"}
            showSearch={visualizer?.charts?.[0].chartType === "table"}
            className={visualizer?.charts?.[0].chartType === "table" && "fullWidth"}
            onChange={(e) => onSearch(e.target.value)}
          >
            {/* {visualizer.charts.map((chart, key) => renderChart(chart, key))} */}
            {renderChart(visualizer?.charts?.[0], visualizer.name)}
          </GenericChart>
        );
      case "performing-metric":
        if (
          value?.filters?.tenantId?.length > 0 &&
          (visualizer?.charts?.[0].id === "fsmTopUlbByPerformance" || visualizer?.charts?.[0].id === "fsmBottomUlbByPerformance")
        )
          return null;
        return (
          <GenericChart header={visualizer.name} subHeader={`(${t(`DSS_SLA_ACHIEVED`)})`} key={key}>
            <CustomBarChart
              data={visualizer?.charts?.[0]}
              fillColor={index++ % 2 ? "#00703C" : "#D4351C"}
              title={visualizer.name}
              showDrillDown={true}
            />
          </GenericChart>
        );
      case "collection":
      case "module":
        return <Summary key={key} ttile={visualizer.name} data={visualizer} key={key} />;
    }
  };
  return <div className="chart-row">{rowData.vizArray.map((chart, key) => renderVisualizer(chart, key))}</div>;
};

export default Layout;
