import { Loader } from "@egovernments/digit-ui-react-components";
import { getDaysInMonth } from "date-fns";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Area, AreaChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import FilterContext from "./FilterContext";
import NoData from "./NoData";
const COLORS = ["#048BD0", "#FBC02D", "#8E29BF", "#EA8A3B", "#0BABDE", "#6E8459", "#D4351C", "#0CF7E4", "#F80BF4", "#22F80B"];
const increasedHeightCharts = [
  "nssOBPSTotalPermitsVsTotalOCSubmittedVsTotalOCIssued",
  "nssNOCApplicationVsProvisionalVsActual",
  "nocApplicationVsProvisionalVsActual",
  "permitsandOCissued",
];
const getColors = (index = 0) => {
  index = COLORS.length > index ? index : 0;
  return COLORS[index];
};

const getDenominatedValue = (denomination, plotValue) => {
  switch (denomination) {
    case "Unit":
      return plotValue;
    case "Lac":
      return Number((plotValue / 100000).toFixed(2));
    case "Cr":
      return Number((plotValue / 10000000).toFixed(2));
    default:
      return "";
  }
};

const getValue = (plot) => plot.value;

const renderUnits = (t, denomination, symbol) => {
  if (symbol == "percentage") {
    return " %";
  } else if (symbol == "number") {
    return "";
  }
  switch (denomination) {
    case "Unit":
      return `(${t("DSS_UNIT")})`;
    case "Lac":
      return `(${t("DSS_LAC")})`;
    case "Cr":
      return `(${t("DSS_CR")})`;
    default:
      return null;
  }
};

const CustomAreaChart = ({ xDataKey = "name", yDataKey = getValue, data, setChartDenomination }) => {
  const lineLegend = {
    margin: "10px",
  };
  const { t } = useTranslation();
  const { id } = data;
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const { value } = useContext(FilterContext);
  const [totalCapacity, setTotalCapacity] = useState(0);
  const [totalWaste, setTotalWaste] = useState(0);
  const [keysArr, setKeysArr] = useState([]);

  const [manageChart, setmanageChart] = useState("Area");
  const stateTenant = Digit.ULBService.getStateId();
  const { isMdmsLoading, data: mdmsData } = Digit.Hooks.useCommonMDMS(stateTenant, "FSM", "FSTPPlantInfo", {
    enabled: id === "fsmCapacityUtilization",
  });
  const { isLoading, data: response } = Digit.Hooks.dss.useGetChart({
    key: id,
    type: "metric",
    tenantId,
    requestDate: { ...value?.requestDate, startDate: value?.range?.startDate?.getTime(), endDate: value?.range?.endDate?.getTime() },
    filters: value?.filters,
    moduleLevel: value?.moduleLevel
  });

  useEffect(() => {
    if (mdmsData) {
      let fstpPlants = mdmsData;
      if (value?.filters?.tenantId?.length > 0) {
        fstpPlants = mdmsData.filter((plant) => value?.filters?.tenantId?.some((tenant) => plant?.ULBS.includes(tenant)));
      }
      const totalCapacity = fstpPlants.reduce((acc, plant) => acc + Number(plant?.PlantOperationalCapacityKLD), 0);
      setTotalCapacity(totalCapacity);
    }
  }, [mdmsData, value]);

  useEffect(() => {
    if (response) {
      const totalWaste = Digit.Utils.dss.formatter(Math.round(response?.responseData?.data?.[0]?.plots[response?.responseData?.data?.[0]?.plots.length - 1]?.value), 'number', value?.denomination, true, t);
      setTotalWaste(totalWaste);
      setChartDenomination(response?.responseData?.data?.[0]?.headerSymbol);
    }
  }, [response]);

  const chartData = useMemo(() => {
    if (response?.responseData?.data?.length == 1) {
      setmanageChart("Area");
      if (id !== "fsmCapacityUtilization") {
        return response?.responseData?.data?.[0]?.plots;
      }
      return response?.responseData?.data?.[0]?.plots.map((plot) => {
        const [month, year] = plot?.name.split("-");
        const totalDays = getDaysInMonth(Date.parse(`${month} 1, ${year}`));
        const value = Math.round((plot?.value / (totalCapacity * totalDays)) * 100);
        return { ...plot, value };
      });
    } else if (response?.responseData?.data?.length > 1) {
      setmanageChart("Line");
      let keys = {};
      const mergeObj = response?.responseData?.data?.[0]?.plots.map((x, index) => {
        let newObj = {};
        response?.responseData?.data.map((ob) => {
          keys[t(Digit.Utils.locale.getTransformedLocale(ob.headerName))] = t(Digit.Utils.locale.getTransformedLocale(ob.headerName));
          newObj[t(Digit.Utils.locale.getTransformedLocale(ob.headerName))] = ob?.plots[index].value;
        });
        return {
          label: null,
          name: response?.responseData?.data?.[0]?.plots[index].name,
          strValue: null,
          symbol: response?.responseData?.data?.[0]?.plots[index].symbol,
          ...newObj,
        };
      });
      setKeysArr(Object.values(keys));
      return mergeObj;
    }
  }, [response, totalCapacity]);

  const renderPlot = (plot, key) => {
    const plotValue = key ? plot?.[key] : plot?.value || 0;
    if (id === "fsmCapacityUtilization") {
      return Number(plotValue.toFixed(1));
    }
    if (plot?.symbol?.toLowerCase() === "amount") {
      const { denomination } = value;
      return getDenominatedValue(denomination, plotValue);
    } else if (plot?.symbol?.toLowerCase() === "number") {
      return Number(plotValue.toFixed(1));
    } else {
      return plotValue;
    }
  };

  const renderLegend = () => <span style={{ fontSize: "14px", color: "#505A5F" }}>{t(`DSS_${Digit.Utils.locale.getTransformedLocale(id)}`)}</span>;

  const renderLegendForLine = (ss, sss, index) => <span style={{ fontSize: "14px", color: "#505A5F" }}>{keysArr?.[index]}</span>;

  const tickFormatter = (value) => {
    if (typeof value === "string") {
      return value.replace("-", ", ");
    }
    return value;
  };
  const yAxistickFormatter = (value) => {
    if (typeof value === "string") {
      return value.replace("-", ", ");
    }
    else if(typeof value === "number")
      return Digit.Utils.dss.formatter(value, 'number', value?.denomination, true, t);
    return value;
  };

  const renderTooltip = ({ payload, label, unit }) => {
    let formattedLabel = tickFormatter(label);
    let payloadObj = payload?.[0] || {};
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
        {payloadObj?.payload?.symbol?.toLowerCase() === "amount" && (
          <p>{`${formattedLabel} : ${value?.denomination === "Unit" ? " ₹" : ""}${Digit.Utils.dss.formatter( payloadObj?.value, 'number', value?.denomination, true, t )} ${
            value?.denomination !== "Unit" ? t(Digit.Utils.locale.getTransformedLocale(`ES_DSS_${value?.denomination}`)) : ""
          }`}</p>
        )}
        {payloadObj?.payload?.symbol?.toLowerCase() === "percentage" && <p>{`${formattedLabel} : ${Digit.Utils.dss.formatter(payloadObj?.value, 'number', value?.denomination, true, t)} %`}</p>}
        {payloadObj?.payload?.symbol?.toLowerCase() === "number" && <p>{`${formattedLabel} : ${Digit.Utils.dss.formatter(payloadObj?.value, 'number', value?.denomination, true, t)} `}</p>}
        {!payloadObj?.payload?.symbol && <p>{`${formattedLabel} : ${payloadObj?.value} `}</p>}
      </div>
    );
  };

  const renderTooltipForLine = ({ payload, label, unit }) => {
    let payloadObj = payload?.[0] || {};
    let prefix = payloadObj?.payload?.symbol?.toLowerCase() === "amount" && value?.denomination === "Unit" ? " ₹" : " ";
    let postfix =
      payloadObj?.payload?.symbol?.toLowerCase() === "percentage"
        ? " %"
        : payloadObj?.payload?.symbol?.toLowerCase() === "amount" && value?.denomination !== "Unit"
        ? t(Digit.Utils.locale.getTransformedLocale(`ES_DSS_${value?.denomination}`))
        : "";
    let newPayload = { ...payloadObj?.payload };
    delete newPayload?.label;
    delete newPayload?.strValue;
    delete newPayload?.symbol;
    let newObjArray = [newPayload?.name];
    delete newPayload?.name;
    Object.keys(newPayload).map((key) => {
      newObjArray.push(
        `${key} -${prefix}${
          payloadObj?.payload?.symbol?.toLowerCase() === "amount" 
          ? Digit.Utils.dss.formatter(getDenominatedValue(value?.denomination, newPayload?.[key]), 'number', value?.denomination, true, t)
          : Digit.Utils.dss.formatter(newPayload?.[key], 'number', value?.denomination, true, t)
        } ${postfix}`
      );
    });
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
        {newObjArray.map((ele, i) => (
          <p key={i}>{ele}</p>
        ))}
      </div>
    );
  };

  if (isLoading) {
    return <Loader />;
  }
  return (
    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "100%" }}>
      {id === "fsmCapacityUtilization" && (
        <p>
          {t("DSS_FSM_TOTAL_SLUDGE_TREATED")} - {totalWaste} {t("DSS_KL")}
        </p>
      )}
      <ResponsiveContainer width="94%" height={increasedHeightCharts.includes(id) ? 700 : 450}>
        {!chartData || chartData?.length === 0 ? (
          <NoData t={t} />
        ) : manageChart == "Area" ? (
          <AreaChart width="100%" height="100%" data={chartData} margin={{ left: 30, top: 10 }}>
            <defs>
              <linearGradient id="colorUv" x1=".5" x2=".5" y2="1">
                <stop stopColor="#048BD0" stopOpacity={0.5} />
                <stop offset="1" stopColor="#048BD0" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip content={renderTooltip} />
            <XAxis dataKey={xDataKey} tick={{ fontSize: "14px", fill: "#505A5F" }} tickFormatter={tickFormatter} />
            <YAxis
              /*
              label={{
                value: `${t(`DSS_Y_${response?.responseData?.data?.[0]?.headerName.replaceAll(" ", "_").toUpperCase()}`)} ${
                  renderUnits(t, value.denomination,response?.responseData?.data?.[0]?.headerSymbol) 
                }`,
                angle: -90,
                position: "insideLeft",
                dy: 40,
                offset: -10,
                fontSize: "14px",
                fill: "#505A5F",
              }}
              */
              tick={{ fontSize: "14px", fill: "#505A5F" }}
              tickFormatter={yAxistickFormatter}
            />
            <Legend formatter={renderLegend} iconType="circle" />
            <Area type="monotone" dataKey={renderPlot} stroke="#048BD0" fill="url(#colorUv)" dot={true} />
          </AreaChart>
        ) : (
          <LineChart
            width={500}
            height={300}
            data={chartData}
            margin={{
              top: 15,
              right: 5,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis
            tickFormatter={yAxistickFormatter}
            /*
            Removed this custom yaxis label for all line charts 
            label={{
                value: `${t(`DSS_Y_${response?.responseData?.data?.[0]?.headerName.replaceAll(" ", "_").toUpperCase()}`)} ${
                  renderUnits(t, value.denomination,response?.responseData?.data?.[0]?.headerSymbol) 
                }`,
                angle: -90,
                position: "insideLeft",
                dy: 40,
                offset: -10,
                fontSize: "14px",
                fill: "#505A5F",
              }}
              */
            />
            <Tooltip content={renderTooltipForLine} />
            <Legend
              layout="horizontal"
              formatter={renderLegendForLine}
              verticalAlign="bottom"
              align="center"
              iconType="circle"
              className={lineLegend}
            />
            {keysArr?.map((key, i) => {
              return (
                <Line
                  type="monotone"
                  dataKey={(plot) => renderPlot(plot, key)}
                  stroke={getColors(i)}
                  activeDot={{ r: 8 }}
                  strokeWidth={2}
                  key={i}
                  dot={{ stroke: getColors(i), strokeWidth: 1, r: 2, fill: getColors(i) }}
                />
              );
            })}
            {/* <Line
              type="monotone"
              dataKey={response?.responseData?.data?.[0]?.headerName}
              stroke="#8884d8"
              activeDot={{ r: 8 }}
            />
            <Line type="monotone" dataKey={response?.responseData?.data?.[1]?.headerName} stroke="#82ca9d" /> */}
          </LineChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};

export default CustomAreaChart;
