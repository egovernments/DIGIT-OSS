import React from "react";
import Grid from "@material-ui/core/Grid";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import APITransport from "../../../actions/apitransport/apitransport";
import { Typography, Tooltip } from "@material-ui/core";
import style from "./Style";
import { withStyles } from "@material-ui/core/styles";
import _ from "lodash";
import getChartOptions from "../../../actions/getChartOptions";
import ChartsAPI from "../../../actions/charts/chartsAPI";
import Arrow_Downward from "../../../images/arrows/Arrow_Downward.svg";
import Arrow_Upward from "../../../images/arrows/Arrow_Upward.svg";
import NFormatter from "../numberFormater";
import { getTenantId, removeSignFromInsightData } from "../../../utils/commons";

class CustomCard extends React.Component {
  constructor(props) {
    super(props);
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

  componentDidMount() {
    this.callAPI();
  }

  render() {
    const { classes, strings, isHome } = this.props;

    let codekey = _.chain(this.props).get("chartData").get("id").value();
    codekey = codekey + this.props.moduleLevel;
    let data =
      _.chain(this.props)
        .get("chartsGData")
        .get(codekey)
        .get("data")
        .map((d, i) => {
          return {
            label: _.chain(this.props).get("chartData").get("name").value(),
            valueSymbol: d.headerSymbol,
            value: d.headerValue,
            plots: d.plots,
            insight_data: d.insight ? d.insight : "",
          };
        })
        .first()
        .value() || null;

    if (data) {
      let insightColor = data.insight_data
        ? data.insight_data.colorCode === "lower_red"
          ? "#e54d42"
          : "#00703c"
        : "";
      let insightIcon = data.insight_data
        ? data.insight_data.colorCode === "lower_red"
          ? Arrow_Downward
          : Arrow_Upward
        : "";
      let value = "";
      if (data.insight_data.value) {
        if (data.insight_data.value.includes("last year")) {
          value = data.insight_data.value.replace("last year", "LY");
        } else if (data.insight_data.value.includes("last month")) {
          value = data.insight_data.value.replace("last month", "LM");
        }
        value = removeSignFromInsightData(value);
      }

      let label = data.label
        ? strings[data.label]
          ? strings[data.label]
          : data.label
        : "";
      let tool = data.label
        ? strings[`TIP_${data.label}`]
          ? strings[`TIP_${data.label}`]
          : `TIP_${data.label}`
        : "";
      return (
        <Grid container spacing={24}>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <div>
              <Tooltip title={tool} placement="top">
                <Typography className={classes.subTitle}>{label}</Typography>
              </Tooltip>
            </div>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <Typography className={classes.value}>
              <NFormatter
                value={data.value}
                nType={data.valueSymbol}
                isHome={isHome}
              />
            </Typography>
          </Grid>
          {value && (
            <Grid
              item
              xs={12}
              sm={12}
              md={12}
              lg={12}
              xl={12}
              style={{ textAlign: "left", marginBottom: "5px" }}
            >
              {
                <React.Fragment>
                  <span style={{ fontSize: "initial" }}>
                    <img
                      src={insightIcon}
                      style={{ height: "15px", color: insightColor }}
                    />
                  </span>
                  <span
                    style={{
                      color: insightColor,
                      fontSize: "14px",
                      marginLeft: "1vh",
                      fontWeight: "500",
                    }}
                  >
                    {value}
                  </span>
                </React.Fragment>
              }
            </Grid>
          )}
        </Grid>
      );
    }
    return <div className={classes.loader}>Loading...</div>;
  }
}

const mapStateToProps = (state) => ({
  strings: state.lang,
  dashboardConfigData: state.firstReducer.dashboardConfigData,
  chartsGData: state.chartsData,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      APITransport: APITransport,
    },
    dispatch
  );

export default withStyles(style)(
  connect(mapStateToProps, mapDispatchToProps)(CustomCard)
);
