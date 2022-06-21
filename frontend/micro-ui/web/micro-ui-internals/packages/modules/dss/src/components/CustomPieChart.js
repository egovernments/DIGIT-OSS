import { Loader, RemoveableTag } from "@egovernments/digit-ui-react-components";
import React, { useContext, useMemo, useState, Fragment, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import FilterContext from "./FilterContext";
import NoData from "./NoData";
// ["#048BD0", "#FBC02D", "#8E29BF","#EA8A3B","#0BABDE","#6E8459"]
const COLORS = ["#048BD0", "#FBC02D", "#8E29BF", "#EA8A3B", "#0BABDE", "#6E8459", "#D4351C", "#0CF7E4", "#F80BF4", "#22F80B"];
const mobileView = innerWidth <= 640;

const CustomPieChart = ({ dataKey = "value", data, setChartDenomination }) => {
  const { id } = data;
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const { t } = useTranslation();
  const { value } = useContext(FilterContext);
  const [isPieClicked, setIsPieClicked] = useState(false);
  const [pieSelected, setPieSelected] = useState(null);
  const [drillDownId, setdrillDownId] = useState(null);
  const { isLoading, data: response } = Digit.Hooks.dss.useGetChart({
    key: isPieClicked ? drillDownId : id,
    type: "metric",
    tenantId,
    requestDate: { ...value?.requestDate, startDate: value?.range?.startDate?.getTime(), endDate: value?.range?.endDate?.getTime() },
    filters: isPieClicked ? { ...value?.filters, selectedType: pieSelected } : value?.filters,
    moduleLevel: value?.moduleLevel
  });

  const chartData = useMemo(() => {
    if (!response) return null;
    setChartDenomination(response?.responseData?.data?.[0]?.headerSymbol);
    const compareFn = (a, b) => b.value - a.value;
    return (drillDownId === "deathByCategoryDrilldownAge" || response?.responseData?.visualizationCode === "nssNumberOfDeathsByAge"    )// || drillDownId === "nssDeathByCategoryDrillDownAge") 
    ? response?.responseData?.data?.[0]?.plots.reduce((acc, plot, index) => {
      acc = acc.concat(plot);
      return acc;
    }, []) 
    : response?.responseData?.data?.[0]?.plots.sort(compareFn).reduce((acc, plot, index) => {
      // if (index < 4) acc = acc.concat(plot);
      //else if (index === 4) acc = acc.concat({ label: null, name: "DSS.OTHERS", value: plot?.value, symbol: "amount" });
      // else acc[3].value += plot?.value;
      /* Commnted logic of pie chart which hides more that 4 and show max of 4*/
      acc = acc.concat(plot);
      return acc;
    }, []);
  }, [response]);

  const renderLegend = (value) => (
    <span style={{ fontSize: "14px", color: "#505A5F" }}>{t(`COMMON_MASTERS_${value && Digit.Utils.locale.getTransformedLocale(value)}`)}</span>
  );

  const renderCustomLabel = (args) => {
    const { value, endAngle, startAngle, x, cx, y, cy, percent, name } = args;
    const diffAngle = endAngle - startAngle;
    if (diffAngle > 1.5 && diffAngle < 7) {
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
    } else if (diffAngle < 1.5) {
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
      <div
        style={{
          margin: "0px",
          padding: "10px",
          backgroundColor: "rgb(255, 255, 255)",
          border: "1px solid rgb(204, 204, 204)",
          whiteSpace: "nowrap",
        }}
      >
        <p className="recharts-tooltip-label">{`${t(
          `COMMON_MASTERS_${payload?.[0]?.name && Digit.Utils.locale.getTransformedLocale(payload?.[0]?.name)}`
        )}: ${Digit.Utils.dss.formatter(payload?.[0]?.value, payload?.[0]?.payload?.payload?.symbol, value?.denomination, true, t)}`}</p>
        <p>{`(${Number((payload?.[0]?.value / response?.responseData?.data?.[0]?.headerValue) * 100).toFixed(1)}%)`}</p>
      </div>
    );
  };

  ///chartIDArray : Array of id's which are placed in a row of 2 charts
  const chartIDArray = [
    "mcCollectionByPaymentModev2",
    "mcRceiptsByPaymentModev2",
    "nssWsCollectionByChannel",
    "nssWsCollectionByUsage",
    "nssOBPSPermitIssuedByOccupancyType",
    "nssOBPSPermitIssuedByRiskType",
    "mcCollectionByPaymentType",
    "mcReceiptsByPaymentMode",
    "wscollectionByUsage",
    "wscollectionByChannel",
    "permitIssuedByOccupancyType",
    "permitIssuedByRiskType",
  ];

  ///checkChartID: This function will check if the id is of chartIDArray
  const checkChartID = (chartID) => {
    return chartIDArray.includes(chartID);
  };

  const onPieClick = ({ payload }) => {
    setIsPieClicked(true);
    setdrillDownId(response?.responseData?.drillDownChartId);
    setPieSelected(payload.name);
  };

  const removeFilter = () => {
    setIsPieClicked(false);
  };

  useEffect(() => {
    setIsPieClicked(false);
    setdrillDownId(null);
    setPieSelected(null);
  }, [id]);

  if (isLoading) {
    return <Loader />;
  }
  return (
    <Fragment>
      { (id === "deathByCategory" ) && (  //|| id === "nssNumberOfDeathsByCategory") && ( 
            <span className={"dss-pie-subheader" } style={{position:"sticky" ,left:0}}>
              {t('DSS_CMN_PIE_INFO')}
            </span>
          )}
      {isPieClicked && (
        <div>
          <div className="tag-container" style={{ marginBottom: "unset" }}>
            <span style={{ marginTop: "20px" }}>{t("DSS_FILTERS_APPLIED")}: </span>
            <RemoveableTag key={id} text={`${t("COMMON_MASTERS_" + Digit.Utils.locale.getTransformedLocale(pieSelected))}`} onClick={removeFilter} />
          </div>
          {/* <div className="tag-container" style={{marginBottom:"unset"}}>
            <span >{t("DSS_FILTERS_APPLIED")}: </span>
            <RemoveableTag extraStyles={{tagStyles:{ marginTop: "unset" }}} key={id} text={`${t("COMMON_MASTERS_" + Digit.Utils.locale.getTransformedLocale(pieSelected))}`} onClick={removeFilter} />
          </div> */}
        </div>
      )}
      {chartData?.length === 0 || !chartData ? (
        <NoData t={t} />
      ) : (
        <ResponsiveContainer width="99%" height={340}>
          <PieChart cy={100}>
            <Pie
              data={chartData}
              dataKey={dataKey}
              cy={150}
              style={{ cursor: response?.responseData?.drillDownChartId !== "none" ? "pointer" : "default" }}
              innerRadius={checkChartID(id) && !mobileView ? 90 : 70} ///Charts in rows(which contains 2 charts) are little bigger in size than charts in rows(which contains 3 charts) charts
              outerRadius={checkChartID(id) && !mobileView ? 110 : 90}
              margin={{ top: isPieClicked ? 0 : 5 }}
              fill="#8884d8"
              //label={renderCustomLabel}
              labelLine={false}
              isAnimationActive={false}
              onClick={response?.responseData?.drillDownChartId !== "none" ? onPieClick : null}
            >
              {response?.responseData?.data?.[0]?.plots.map((entry, index) => (
                <Cell key={`cell-`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={renderTooltip} />
            <Legend
              layout="vertical"
              verticalAlign="middle"
              align="right"
              iconType="circle"
              formatter={renderLegend}
              iconSize={10}
              wrapperStyle={
                chartData?.length > 6
                  ? {
                      paddingRight: checkChartID(id) && !mobileView ? 60 : 0, ///Padding for 2 charts in a row cases
                      overflowY: "scroll",
                      height: 250,
                      width: "35%",
                      overflowX: "auto",
                      paddingTop: -20,
                    }
                  : { paddingRight: checkChartID(id) && !mobileView ? 60 : 0, width: "27%", overflowX: "auto", paddingTop: -20 } ///Padding for 2 charts in a row cases
              }
            />
          </PieChart>
        </ResponsiveContainer>
      )}
      {isPieClicked && (
        <div
          style={{
            marginTop: "-4%",
            position: "absolute",
            width: "30%",
            textAlign: "center",
          }}
        >
          {t(Digit.Utils.locale.getTransformedLocale(`${response?.responseData?.data?.[0]?.headerName}_${pieSelected}`))}
        </div>
      )}
    </Fragment>
  );
};

export default CustomPieChart;
