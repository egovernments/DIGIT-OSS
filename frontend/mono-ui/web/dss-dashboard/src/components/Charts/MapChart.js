import { withStyles } from "@material-ui/core/styles";
import _ from "lodash";
import React from "react";
import { connect } from "react-redux";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import ReactTooltip from "react-tooltip";
import { bindActionCreators } from "redux";
import APITransport from "../../actions/apitransport/apitransport";
import ChartsAPI from "../../actions/charts/chartsAPI";
import getChartOptions from "../../actions/getChartOptions";
import { getLocaleLabels, getTenantId } from "../../utils/commons";
import style from "./styles";

const INDIA_TOPO_JSON = require("./india.topo.json");

const PROJECTION_CONFIG = { scale: 350, center: [78.9629, 22.5937] };

// Red Variants
const COLOR_RANGE = ["#54D140", "#298CFF", "#F47738", "#D1D1D1"];

const STATUS = ["Live", "OnBoarded", "UnderImplementation", "None"];
const DEFAULT_COLOR = "#D1D1D1";

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

const Backsvg = ({ onClick }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    onClick={onClick}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M16 7H3.83L9.42 1.41L8 0L0 8L8 16L9.41 14.59L3.83 9H16V7Z"
      fill="#0B0C0C"
    />
  </svg>
);

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

class MapChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tooltipContent: "",
      drillDown: false,
    };
  }

  onMouseEnter(geo, current = { value: "0" }, event) {
    this.setState({
      tooltipContent: `${getLocaleLabels(`DSS_TB_${geo.properties.name}`)}: ${
        current.value ? Number(current.value).toFixed() + " ULBs" : "NA"
      } `,
    });
  }
  back() {
    this.props.updateSelectedState({ state: "", totalCount: 0, liveCount: 0 });
  }
  onMouseClick(geo, current = { value: "NA" }, event) {
    if (current && current.value > 0) this.props.updateSelectedState(current);
  }
  onMouseLeave(geo, current = { value: "NA" }, event) {
    this.setState({ tooltipContent: `` });
  }
  callAPI() {
    let code = this.props.chartData["id"] ? this.props.chartData["id"] : "";
    let filters = this.props.filters;
    if (this.props.page.includes("ulb")) {
      if (!filters["tenantId"]) {
        let tenentFilter = [];
        tenentFilter.push(`${getTenantId()}`);
        filters["tenantId"] = tenentFilter;
      }
    }
    let requestBody = getChartOptions(code, filters);
    let chartsAPI = new ChartsAPI(
      2000,
      "dashboard",
      code + this.props.moduleLevel,
      requestBody.dataoption
    );
    this.props.APITransport(chartsAPI);
  }
  callAPI2() {
    let code = this.props.chartData["id"] ? this.props.chartData["id"] : "";
    let filters = this.props.filters;
    if (this.props.page.includes("ulb")) {
      if (!filters["tenantId"]) {
        let tenentFilter = [];
        tenentFilter.push(`${getTenantId()}`);
        filters["tenantId"] = tenentFilter;
      }
    }
    filters["state"] = this.props.selectedState;
    let drillDownCode = this.props.chartsGData[code]
      ? this.props.chartsGData[code].drillDownChartId
      : "";
    let requestBody = getChartOptions(drillDownCode, filters);
    let chartsAPI = new ChartsAPI(
      2000,
      "dashboard",
      drillDownCode + this.props.moduleLevel,
      requestBody.dataoption
    );
    this.props.APITransport(chartsAPI);
  }
  componentDidMount() {
    this.callAPI();
  }
  componentDidUpdate() {
    if (this.props.selectedState !== "" && !this.state.drillDown) {
      this.callAPI2();
      this.setState({ drillDown: true });
    } else if(this.props.selectedState == "" && this.state.drillDown){
      this.callAPI();
      this.setState({ drillDown: false });
    }
  }
  render() {
    const data = [
      { id: "AP", state: "Andhra Pradesh", value: 0 },
      { id: "AR", state: "Arunachal Pradesh", value: 0 },
      { id: "AS", state: "Assam", value: 0 },
      { id: "BR", state: "Bihar", value: 0 },
      { id: "CT", state: "Chhattisgarh", value: 0 },
      { id: "GA", state: "Goa", value: 0 },
      { id: "GJ", state: "Gujarat", value: 0 },
      { id: "HR", state: "Haryana", value: 0 },
      { id: "HP", state: "Himachal Pradesh", value: 0 },
      { id: "JH", state: "Jharkhand", value: 0 },
      { id: "KA", state: "Karnataka", value: 0 },
      { id: "KL", state: "Kerala", value: 0 },
      { id: "MP", state: "Madhya Pradesh", value: 0 },
      { id: "MH", state: "Maharashtra", value: 0 },
      { id: "MN", state: "Manipur", value: 0 },
      { id: "ML", state: "Meghalaya", value: 0 },
      { id: "MZ", state: "Mizoram", value: 0 },
      { id: "NL", state: "Nagaland", value: 0 },
      { id: "OD", state: "Odissa", value: 0 },
      { id: "PB", state: "Punjab", value: 0 },
      { id: "RJ", state: "Rajasthan", value: 0 },
      { id: "SK", state: "Sikkim", value: 0 },
      { id: "TN", state: "Tamil Nadu", value: 0 },
      { id: "TS", state: "Telangana", value: 0 },
      { id: "TR", state: "Tripura", value: 0 },
      { id: "UK", state: "Uttarakhand", value: 0 },
      { id: "UP", state: "Uttar Pradesh", value: 0 },
      { id: "WB", state: "West Bengal", value: 0 },
      { id: "WB", state: "West Bengal", value: 0 },
      { id: "AN", state: "Andaman and Nicobar Islands", value: 0 },
      { id: "CH", state: "Chandigarh", value: 0 },
      { id: "DN", state: "Dadra and Nagar Haveli", value: 0 },
      { id: "DD", state: "Daman and Diu", value: 0 },
      { id: "DL", state: "Delhi", value: 0 },
      { id: "JK", state: "Jammu and Kashmir", value: 0 },
      { id: "LA", state: "Ladakh", value: 0 },
      { id: "LD", state: "Lakshadweep", value: 0 },
      { id: "PY", state: "Puducherry", value: 0 },
    ];
    let DataObj = data.reduce((acc, curr) => {
      acc[curr.state] = { ...curr };
      return { ...acc };
    }, {});

    /*
        const colorScale = scaleQuantile()
            .domain(data.map(d => d.value))
            .range(COLOR_RANGE);
        const gradientData = {
            fromColor: COLOR_RANGE[0],
            toColor: COLOR_RANGE[COLOR_RANGE.length - 1],
            min: 0,
            max: data.reduce((max, item) => (item.value > max ? item.value : max), 0)
        };
        */
    let codekey = _.chain(this.props).get("chartData").get("id").value();
    codekey = codekey + this.props.moduleLevel;
    let data1 =
      _.chain(this.props)
        .get("chartsGData")
        .get(codekey)
        .get("data")
        .filter(data=>data)
        .map((dat) => {
          let totalCount = dat.plots[3].value;
          let liveCount = dat.plots[4].value;
          let live = dat.plots[4].strValue > 0 ? true : false;
          DataObj[dat.headerName] = {
            ...DataObj[dat.headerName],
            status: dat.plots[2].strValue,
            value: live ? liveCount : totalCount,
            live,
            totalCount,
            liveCount,
          };
        })
        .value() || null;
    let drillDownCodes = _.chain(this.props)
      .get("chartsGData")
      .get(codekey)
      .get("drillDownChartId")
      .value();
    if (!data1) {
      return <div>Loading...</div>;
    }
    const { selectedState, liveCount, totalCount } = this.props;
    if (selectedState !== "") {
      let data2 =
        _.chain(this.props)
          .get("chartsGData")
          .get(drillDownCodes)
          .get("data")
          .map((dat) => ({ ...dat }))
          .value() || null;
      if (!data2) {
        return <div>Loading...</div>;
      }
      return (
        <div style={{ height: "410px" }}>
          {" "}
          {/* {selectedState}
          <span>{totalCount}</span>
          <span>{liveCount}</span> */}
          <div style={{ float: "left" }}>
            <Backsvg onClick={() => this.back()} />
          </div>
          {data2&&data2.length==0&&<div style={{ paddingTop: "60px"}}>{getLocaleLabels("DSS_NO_DATA")}</div>}
          {data2 && data2[0] && (
            <span className={"tab-rows tab-header"}>
              <span>{getLocaleLabels(`DSS_${data2[0].plots[1].name}`)}</span>
              <span>{getLocaleLabels(`DSS_${data2[0].plots[2].name}`)}</span>
            </span>
          )}
          {data2.map((dat, i) => {
            return (
              <span
                className={"tab-rows"}
                style={{
                  background: i % 2 == 0 ? "none" : "#EEEEEE",
                }}
              >
                <span>{getLocaleLabels(`DSS_${dat.plots[1].label}`)}</span>
                <span>{dat.plots[2].value}</span>
              </span>
            );
          })}
        </div>
      );
    }
    return (
      <div className="full-width-height container">
        <ReactTooltip>{this.state.tooltipContent}</ReactTooltip>
        <div style={{ height: "407px" }} className={"india-map-comp"}>
          <ComposableMap
            projectionConfig={PROJECTION_CONFIG}
            projection="geoMercator"
            width={"240"}
            height={"220"}
            data-tip=""
          >
            <Geographies geography={INDIA_TOPO_JSON}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const current = Object.values(DataObj).find(
                    (s) => s.id === geo.id
                  );
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      // fill={current ? colorScale(current.value) : DEFAULT_COLOR}
                      fill={getColor(current)}
                      style={geographyStyle}
                      onMouseEnter={(event) =>
                        this.onMouseEnter(geo, current, event)
                      }
                      onClick={(event) =>
                        this.onMouseClick(geo, current, event)
                      }
                      onMouseLeave={(event) =>
                        this.onMouseLeave(geo, current, event)
                      }
                    />
                  );
                })
              }
            </Geographies>
          </ComposableMap>
        </div>
        <span className="map-status">
          {STATUS.map((sta) => {
            return (
              <span className="map-row">
                <span
                  className="map-box"
                  style={{ background: getColor({ status: sta }) }}
                ></span>
                <span className="map-text">
                  {getLocaleLabels(`DSS_${sta}`)}
                </span>
              </span>
            );
          })}
        </span>
      </div>
    );
  }
}

// export default App;
const mapStateToProps = (state) => {
  return {
    GFilterData: state.GFilterData,
    chartsGData: state.chartsData,
    strings: state.lang,
  };
};
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      APITransport: APITransport,
    },
    dispatch
  );
};
export default withStyles(style)(
  connect(mapStateToProps, mapDispatchToProps)(MapChart)
);
