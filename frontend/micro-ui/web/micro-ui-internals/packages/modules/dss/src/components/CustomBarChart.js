import { Loader } from "@egovernments/digit-ui-react-components";
import React, { Fragment, useContext, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts";
import FilterContext from "./FilterContext";
import NoData from "./NoData";
import { checkCurrentScreen } from "./DSSCard";


const formatValue = (value, symbol) => {
  if (symbol?.toLowerCase() === "percentage") {
/*   Removed by  percentage formatter.
    const Pformatter = new Intl.NumberFormat("en-IN", { maximumSignificantDigits: 3 });
    return `${Pformatter.format(Number(value).toFixed(2))}`;
    */
    return `${Number(value).toFixed()}`;
  } else {
    return value;
  }
};

const CustomLabel = ({ x, y, name, stroke, value }) => {
  const { t } = useTranslation();
  return (
    <>
      <text x={x} y={y} dx={-55} dy={10} fill={stroke} width="35" style={{fontSize: "medium",
    fontVariantNumeric: "proportional-nums"}}>
       {`${value}%`}
      </text>
      <text x={x} y={y} dx={-170} dy={10}>
       {t(name)}
      </text>
    </>
  );
};
const COLORS={RED:"#00703C",GREEN:"#D4351C",default:"#00703C"}

const CustomBarChart = ({
  xDataKey = "value",
  xAxisType = "number",
  yAxisType = "category",
  yDataKey = "name",
  hideAxis = true,
  layout = "vertical",
  fillColor = "default",
  showGrid = false,
  showDrillDown = false,
  data,
  title,
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
  });
  const chartData = useMemo(() => {
    if (!response) return null;
    setChartDenomination(response?.responseData?.data?.[0]?.headerSymbol);
    return response?.responseData?.data?.map((bar) => {
      let plotValue = bar?.plots?.[0].value || 0;
      return {
        name: t(bar?.plots?.[0].name),
        value:formatValue(plotValue, bar?.plots?.[0].symbol),
        // value: Digit.Utils.dss.formatter(plotValue, bar?.plots?.[0].symbol),
      };
    });
  }, [response]);

  const goToDrillDownCharts = () => {
    history.push(`/digit-ui/employee/dss/drilldown?chart=${response?.responseData?.visualizationCode}&ulb=${value?.filters?.tenantId}&title=${title}&fromModule=${Digit.Utils.dss.getCurrentModuleName()}&type=performing-metric&fillColor=${fillColor}&isNational=${checkCurrentScreen()?"YES":"NO"}`);
  };
  if (isLoading) {
    return <Loader />;
  }
  if (chartData?.length === 0 || !chartData) {
    return <NoData t={t} />;
  }
  return (
    <Fragment>
      <ResponsiveContainer width="99%" height={320}>
        <BarChart width="100%" height="100%" data={showDrillDown?chartData?.slice(0,3):chartData} layout={layout} maxBarSize={8} margin={{ left: 170 }} barGap={50}>
          {showGrid && <CartesianGrid />}
          <XAxis hide={hideAxis} dataKey={xDataKey} type={xAxisType} domain={[0, 90]} />
          <YAxis dataKey={yDataKey} hide={hideAxis} type={yAxisType} padding={{ right: 40 }} />
          <Bar
            dataKey={xDataKey}
            fill={COLORS[fillColor]}
            background={{ fill: "#D6D5D4", radius: 8 }}
            label={<CustomLabel stroke={COLORS[fillColor]} />}
            radius={[8, 8, 8, 8]}
            isAnimationActive={false}
            maxBarSize={8}
          />
        </BarChart>
      </ResponsiveContainer>
      { chartData?.length>3&&showDrillDown&&(
        <p className="showMore" onClick={goToDrillDownCharts}>
          {t("DSS_SHOW_MORE")}
        </p>
      )}
    </Fragment>
  );
};

export default CustomBarChart;
