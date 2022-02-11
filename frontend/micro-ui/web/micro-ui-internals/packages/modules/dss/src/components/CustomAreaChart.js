import { Loader } from "@egovernments/digit-ui-react-components";
import { getDaysInMonth } from "date-fns";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Area, AreaChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import FilterContext from "./FilterContext";
import NoData from "./NoData";
const COLORS=["#EA8A3B",  "#048BD0",   "#8E29BF" ,"#FBC02D"]
const getColors =(index=0)=>{

index=COLORS.length>index?index:0;
return COLORS[index];
};

const getValue = (plot) => plot.value;

const renderUnits = (t, denomination) => {
  switch (denomination) {
    case "Unit":
      return `(${t("DSS_UNIT")})`;
    case "Lac":
      return `(${t("DSS_LAC")})`;
    case "Cr":
      return `(${t("DSS_CR")})`;
  }
};

const CustomAreaChart = ({ xDataKey = "name", yDataKey = getValue, data }) => {
  const { t } = useTranslation();
  const { id } = data;
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const { value } = useContext(FilterContext);
  const [totalCapacity, setTotalCapacity] = useState(0);
  const [totalWaste, setTotalWaste] = useState(0);
  const [keysArr, setKeysArr] = useState([]);

  const [manageChart,setmanageChart]=useState("Area");
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
  });

  useEffect(() => {
    if (mdmsData) {
      let fstpPlants = mdmsData;
      if (value?.filters?.tenantId.length > 0) {
        fstpPlants = mdmsData.filter((plant) => value?.filters?.tenantId?.some((tenant) => plant?.ULBS.includes(tenant)));
      }
      const totalCapacity = fstpPlants.reduce((acc, plant) => acc + Number(plant?.PlantOperationalCapacityKLD), 0);
      setTotalCapacity(totalCapacity);
    }
  }, [mdmsData, value]);

  useEffect(() => {
    if (response) {
      const totalWaste = Math.round(response?.responseData?.data?.[0]?.plots[response?.responseData?.data?.[0]?.plots.length - 1]?.value);
      setTotalWaste(totalWaste);
    }
  }, [response]);

  const chartData = useMemo(() => {
    
    if(response?.responseData?.data?.length==1){
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
    }else if(response?.responseData?.data?.length>1){
      setmanageChart("Line");
      let keys={};
      const mergeObj = response?.responseData?.data?.[0]?.plots.map((x, index) => {
        let newObj={};
     response?.responseData?.data.map(ob=>{
       keys[t(Digit.Utils.locale.getTransformedLocale(ob.headerName))]=t(Digit.Utils.locale.getTransformedLocale(ob.headerName));
      newObj[t(Digit.Utils.locale.getTransformedLocale(ob.headerName))]=ob?.plots[index].value
     })
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

  const renderPlot = (plot) => {
    if (id === "fsmCapacityUtilization") {
      return Number(plot?.value.toFixed(1));
    }
    const { denomination } = value;
    switch (denomination) {
      case "Unit":
        return plot?.value;
      case "Lac":
        return Number((plot.value / 100000).toFixed(2));
      case "Cr":
        return Number((plot.value / 10000000).toFixed(2));
      default:
        return ""
    }
  };

  const renderLegend = (value) => <span>{value}</span>;

  const tickFormatter = (value) => {
    if (typeof value === "string") {
      return value.replace("-", ", ");
    }
    return value;
  };

  const renderTooltip = ({ payload, label, unit }) => {
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
        <p>{`${tickFormatter(label)} :${id === "fsmTotalCumulativeCollection" ? " ₹" : ""}${payload?.[0]?.value}${
          id === "fsmTotalCumulativeCollection" ? (value?.denomination !== "Unit" ? value?.denomination : "") : `%`
        }`}</p>
      </div>
    );
  };

  if (isLoading) {
    return <Loader />;
  }
  return (
    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", height: "85%" }}>
      {id === "fsmCapacityUtilization" && (
        <p>
          {t("DSS_FSM_TOTAL_SLUDGE_TREATED")} - {totalWaste} {t("DSS_KL")}
        </p>
      )}
      <ResponsiveContainer width="99%" height={id === "fsmTotalCumulativeCollection" ? 400 : 300}>
        {!chartData || chartData?.length === 0 ? (
         <NoData t={t} />
        ) : (

          manageChart =="Area" ?( <AreaChart width="100%" height="100%" data={chartData} margin={{ left: 30, top: 10 }}>
            <defs>
              <linearGradient id="colorUv" x1=".5" x2=".5" y2="1">
                <stop stopColor="#048BD0" stopOpacity={0.5} />
                <stop offset="1" stopColor="#048BD0" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid />
            <Tooltip content={renderTooltip} />
            <XAxis dataKey={xDataKey} tick={{ fontSize: "14px", fill: "#505A5F" }} tickFormatter={tickFormatter} />
            <YAxis
              label={{
                value: `${t(`DSS_${response?.responseData?.data?.[0]?.headerName.replaceAll(" ", "_").toUpperCase()}`)} ${
                  id === "fsmTotalCumulativeCollection" ? renderUnits(t, value.denomination) : `(%)`
                }`,
                angle: -90,
                position: "insideLeft",
                dy: 40,
                offset: -10,
                fontSize: "14px",
                fill: "#505A5F",
              }}
              tick={{ fontSize: "14px", fill: "#505A5F" }}
            />
            <Area type="monotone" dataKey={renderPlot} stroke="#048BD0" fill="url(#colorUv)" dot={true} />
          </AreaChart>
          ):(
            <LineChart
            width={500}
            height={300}
            data={chartData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            {keysArr?.map((key,i)=>{
              return (<Line
              type="monotone"
              dataKey={key}
              stroke={getColors(i)}
              activeDot={{ r: 8 }}
            />)
            })}
            {/* <Line
              type="monotone"
              dataKey={response?.responseData?.data?.[0]?.headerName}
              stroke="#8884d8"
              activeDot={{ r: 8 }}
            />
            <Line type="monotone" dataKey={response?.responseData?.data?.[1]?.headerName} stroke="#82ca9d" /> */}
          </LineChart>
          ) 
        )
       
        
        
        }
      </ResponsiveContainer>
    </div>
  );
};

export default CustomAreaChart;
