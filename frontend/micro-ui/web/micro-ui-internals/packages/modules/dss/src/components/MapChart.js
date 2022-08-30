import React, { useState, Fragment } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import ReactTooltip from "react-tooltip";
import { useTranslation } from "react-i18next";
import { get } from "lodash";
import FilterContext from "./FilterContext";
import { endOfMonth, getTime, startOfMonth } from "date-fns";
import { Loader } from "@egovernments/digit-ui-react-components"
import { ResponsiveContainer } from "recharts";
import { format } from "date-fns";



const PROJECTION_CONFIG = { scale: 320, center: [85.9629, 22.5937] };

// Red Variants
const COLOR_RANGE = ["#54D140", "#298CFF", "#F47738", "#D1D1D1"];

const STATUS = ["Live", "UnderImplementation", "OnBoarded", "None"];
const DEFAULT_COLOR = "#D1D1D1";
const key = "DSS_FILTERS";


const getInitialRange = () => {
  const data = Digit.SessionStorage.get(key);
  const startDate = data?.range?.startDate ? new Date(data?.range?.startDate) : Digit.Utils.dss.getDefaultFinacialYear().startDate;
  const endDate = data?.range?.endDate ? new Date(data?.range?.endDate) : Digit.Utils.dss.getDefaultFinacialYear().endDate;
  const title = `${format(startDate, "MMM d, yyyy")} - ${format(endDate, "MMM d, yyyy")}`;
  const interval = Digit.Utils.dss.getDuration(startDate, endDate);
  const denomination = data?.denomination || "Lac";
  const tenantId = data?.filters?.tenantId || [];
  return { startDate, endDate, title, interval, denomination, tenantId };
};

const getColor = (current) => {
  const status = current && current.status;
  if (current) {
    switch (status) {
      case "Live":
        return COLOR_RANGE[0];
      case "OnBoarded":
        return COLOR_RANGE[1];
      case "UnderImplementation":
        return COLOR_RANGE[2];
      case "None":
        return DEFAULT_COLOR;
      default:
        return DEFAULT_COLOR;
    }
  }
  return DEFAULT_COLOR;
};

const geographyStyle = {
  default: {
    outline: "none",
    stroke: "white",
    strokeWidth: "0.5",
    strokeOpacity: "0.9",
  },
  hover: {
    outline: "none",
    stroke: "white",
    strokeWidth: "0.5",
    strokeOpacity: "0.9",
  },
  pressed: {
    outline: "none",
    stroke: "white",
    strokeWidth: "0.5",
    strokeOpacity: "0.9",
  },
};

const MapChart = ({
  data,
  drillDown = false,
  setselectedState,
  setdrilldownId,
  settotalCount,
  setliveCount
}) => {

  const { t } = useTranslation();
  const { id } = data;
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const [tooltipContent, settooltipContent] = useState("");
  const { startDate, endDate, interval, } = getInitialRange();
  const requestDate = {
    startDate: startDate.getTime(),
    endDate: endDate.getTime(),
    interval: interval,
    title: "home",
  };

  const { data: topoJSON, isLoading: isLoadingNAT } = Digit.Hooks.dss.useMDMS(Digit.ULBService.getStateId(), "dss-dashboard", ["dashboard-config"], {
    select: (data) => {
      const topoJson = data?.["dss-dashboard"]?.["dashboard-config"]?.[0]?.["MAP_CONFIG"]?.[0] || {};
      return topoJson;
    },
    enabled: true,
  });
  const { isLoading, data: response } = Digit.Hooks.dss.useGetChart({
    key: id,
    type: "metric",
    tenantId,
    requestDate: requestDate,
  });


  const onMouseEnter = (geo, current = { value: "0" }, event) => {
    return settooltipContent(`${t(`${geo.properties.name}`)}: ${current.value ? Number(current.value).toFixed() + " ULBs" : "NA"} `);
  }
  const onMouseClick = (geo, current = { value: "NA" }, event) => {
    /*  to make the map clickable only on the live states */
    if (current && current.value > 0 && current.status === "Live")
      setselectedState(current.state);
    setdrilldownId(response?.responseData?.drillDownChartId);
    settotalCount(current.totalCount);
    setliveCount(current.liveCount);
  }
  const onMouseLeave = (geo, current = { value: "NA" }, event) => {
    settooltipContent("");
  }

  const mapData = get(topoJSON, "objects.india.geometries", [])?.map(
    (ee) => {
      return { state: ee.properties.name, value: 0, id: ee.id };
    }
  );
  let DataObj =
    mapData?.reduce((acc, curr) => {
      acc[curr.state] = { ...curr };
      return { ...acc };
    }, {}) || {};


  if (isLoading || isLoadingNAT) {
    return <Loader />
  }

  return (
    <ResponsiveContainer
      width="40%"
      height={220}
      margin={{
        top: 5,
        right: 5,
        left: 5,
        bottom: 5,
      }}
    >
      <div style={{ position: "relative" }}>
        <ReactTooltip>{tooltipContent}</ReactTooltip>
        <ComposableMap
          projectionConfig={PROJECTION_CONFIG}
          projection="geoMercator"
          width={240}
          height={170}
          data-tip=""
        >
          <Geographies geography={topoJSON}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const current = Object.values(DataObj).find(
                  (s) => s.id === geo.id
                );
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={getColor(current)}
                    style={geographyStyle}
                    onMouseEnter={(event) =>
                      onMouseEnter(geo, current, event)
                    }
                    onClick={(event) =>
                      onMouseClick(geo, current, event)
                    }
                    onMouseLeave={(event) =>
                      onMouseLeave(geo, current, event)
                    }
                  />
                );
              })
            }
          </Geographies>
        </ComposableMap>
        <span className="map-status">
          {STATUS.map((sta) => {
            return (
              <span className="map-row">
                <span
                  className="map-box"
                  style={{ background: getColor({ status: sta }) }}
                ></span>
                <span className="map-text">
                  {t(`DSS_${sta.toUpperCase()}`)}
                </span>
              </span>
            );
          })}
        </span>
      </div>
    </ResponsiveContainer>);
}

export default MapChart;
