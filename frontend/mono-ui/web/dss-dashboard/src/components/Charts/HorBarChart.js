import { withStyles } from "@material-ui/core/styles";
import _ from "lodash";
import React from "react";
import { connect } from "react-redux";
import {
    Bar,
    BarChart,
    CartesianGrid,
    Legend,
    Tooltip,
    XAxis,
    YAxis
} from "recharts";
import { bindActionCreators } from "redux";
import APITransport from "../../actions/apitransport/apitransport";
import ChartsAPI from "../../actions/charts/chartsAPI";
import getChartOptions from "../../actions/getChartOptions";
import { getLocaleLabels, getTenantId } from "../../utils/commons";
import style from "./styles";

const COLORS = ["#298CFF", "#54D140"];

class HorBarChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tooltipContent: "",
      drillDown: false,
    };
  }

  callAPI(filterkey="") {
    let code = this.props.chartData["id"] ? this.props.chartData["id"] : "";
    let filters = this.props.filters;
    if (this.props.page.includes("ulb")) {
      if (!filters["tenantId"]) {
        let tenentFilter = [];
        tenentFilter.push(`${getTenantId()}`);
        filters["tenantId"] = tenentFilter;
      }
    }
    if(filterkey!=""){
      filters["state"] = this.props.selectedState;
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

  componentDidMount() {
    this.callAPI();
  }
  componentDidUpdate() {
    if (this.props.selectedState !== "" && !this.state.drillDown) {
      this.callAPI(this.props.selectedState);
      this.setState({ drillDown: true });
    }else if(this.props.selectedState == "" && this.state.drillDown){
      this.callAPI();
      this.setState({ drillDown: false });
    }
  }
  
  render() {
    let { strings } = this.props;

    let codekey = _.chain(this.props).get("chartData").get("id").value();
    codekey = codekey + this.props.moduleLevel;
    let data1 =
      _.chain(this.props)
        .get("chartsGData")
        .get(codekey)
        .get("data")
        .filter(data=>data)
        .map((dat) => {
          return { ...dat };
        })
        .value() || null;
    let keys = {};

    const mergeObj = data1?.[0]?.plots.map((x, index) => {
      let newObj = {};
      data1.map((ob) => {
        keys[getLocaleLabels(`DSS_${ob.headerName}`, strings)] = getLocaleLabels(`DSS_${ob.headerName}`, strings);
        newObj[getLocaleLabels(`DSS_${ob.headerName}`, strings)] =Number(ob?.plots[index].value).toFixed();
      });
      return {
        label: null,
        name: data1?.[0]?.plots[index].name,
        strValue: null,
        symbol: data1?.[0]?.plots[index].symbol,
        ...newObj,
      };
    });
    if (!data1) {
      return <div>Loading...</div>;
    }
    return (
      <div className="full-width-height container">
        <div style={{ height: "90%", width: "550px" }}>
          <BarChart
            width={600}
            height={400}
            data={mergeObj}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            {Object.values(keys).map((key, ind) => {
              return <Bar dataKey={key} fill={COLORS[ind]} />;
            })}
          </BarChart>
        </div>
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
  connect(mapStateToProps, mapDispatchToProps)(HorBarChart)
);
