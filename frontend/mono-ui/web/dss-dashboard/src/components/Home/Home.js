import { Typography } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { withStyles } from "@material-ui/core/styles";
import _ from "lodash";
import moment from "moment";
import React from "react";
import { isMobile } from "react-device-detect";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import APITransport from "../../actions/apitransport/apitransport";
import dashboardAPI from "../../actions/dashboardAPI";
import getFilterObj from "../../actions/getFilterObj";
import getFinancialYearObj from "../../actions/getFinancialYearObj";
import mdmsAPI from "../../actions/mdms/mdms";
import Variables from "../../styles/variables";
import { getLocaleLabels, isNurtDashboard } from "../../utils/commons";
import history from "../../utils/web.history";
import HorBarChart from "../Charts/HorBarChart";
import MapChart from "../Charts/MapChart";
import Card from "../common/Card/Card";
import CardBody from "../common/Card/CardBody.js";
import CardHeader from "../common/Card/CardHeader.js";
import CardIcon from "../common/Card/CardIcon.js";
import CustomCard from "../common/CustomCard/CustomCard";
import Icons from "../common/Icon/Icon";
import CustomizedMenus from "../Dashboard/download";
import CustomizedShare from "../Dashboard/share";
import style from "./styles";
import Arrow_Right from "../../images/arrows/Arrow_Right.svg";

class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      filter: this.props.GFilterData,
      page: _.get(this.props, "match.params.pageId"),
      dontShowHeader: true,
      getFYobj: getFinancialYearObj(),
      dashboardConfigData: [],
      selectedState: "",
      totalCount: 0,
      liveCount: 0,
    };
  }

  updateSelectedState = (obj = {}) => {
    this.setState({
      selectedState: obj.state,
      totalCount: obj.totalCount,
      liveCount: obj.liveCount,
    });
  };
  async componentDidMount() {
    await this.workingOnLabelText();
  }

  lightenDarkenColor(col, amt) {
    var usePound = false;

    if (col[0] == "#") {
      col = col.slice(1);
      usePound = true;
    }

    var num = parseInt(col, 16);
    var r = (num >> 16) + amt;

    if (r > 255) r = 255;
    else if (r < 0) r = 0;

    var b = ((num >> 8) & 0x00ff) + amt;

    if (b > 255) b = 255;
    else if (b < 0) b = 0;

    var g = (num & 0x0000ff) + amt;

    if (g > 255) g = 255;
    else if (g < 0) g = 0;
    let color = (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16);
    return color;
  }

  handleOnClick(path) {
    history.push(`${process.env.PUBLIC_URL}/` + path);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.dashboardConfigData !== this.props.dashboardConfigData) {
      this.setState({
        dashboardConfigData: this.props.dashboardConfigData,
      });
    }
  }

  renderChart(data, index, vizArray) {
    let { chartLabelName, selectedState, liveCount, totalCount } = this.state;
    let { classes, strings } = this.props;
    let filters = getFilterObj(
      this.props.GFilterData,
      this.props.mdmsData,
      this.state.page
    );
    let bgColor = Variables.colors[index].light;
    let iconColor = Variables.iconColors[index].light;
    let pageId = "";
    let moduleLevel = "";

    if (data) {
      if (data.ref && data.ref.url) {
        pageId = data.ref.url;
      }
      if (data.moduleLevel) {
        moduleLevel = data.moduleLevel;
        if (!filters["modulelevel"]) {
          filters.modulelevel = data.moduleLevel;
        }
      }
    }
    if (data.vizType.toUpperCase() === "COLLECTION") {
      if (data.charts[0].chartType == "map") {
        let newData = vizArray[1];
        return (
          <Grid
            item
            xs={12}
            sm={12}
            md={12}
            lg={12}
            xl={12}
            className={classes.paper}
            style={{ paddingBottom: "5px" }}
            data-html2canvas-ignore="true"
          >
            <Card color="blue" bgColor={"white"} page={pageId}>
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ width: "49%" }}>
                  <CardHeader color="rose" icon page={pageId || "overview"}>
                    <CardIcon color="rose" bgColor={"#F47738"}>
                      <Icons type={data.name}></Icons>
                    </CardIcon>
                    <div style={{ textAlign: "left", color: "black" }}>
                      <Typography className={classes.cardTitle}>
                        {selectedState
                          ? getLocaleLabels(`DSS_TB_${selectedState}`)
                          : strings[data.name] || data.name}
                        {selectedState && (
                          <span style={{ fontSize: "14px", display: "block" }}>
                            {strings[`DSS_TOTAL_ULBS`] || "DSS_TOTAL_ULBS"}{" "}
                            {Number(totalCount).toFixed()} |{" "}
                            {strings[`DSS_LIVE_ULBS`] || "DSS_LIVE_ULBS"}{" "}
                            {Number(liveCount).toFixed()}
                          </span>
                        )}
                      </Typography>
                    </div>
                  </CardHeader>
                  <CardBody page={pageId || "overview"}>
                    <Grid container spacing={24}>
                      <Grid
                        item
                        xs={12}
                        sm={12}
                        md={12}
                        lg={12}
                        xl={12}
                        className={classes.customCard}
                      >
                        <MapChart
                          moduleLevel={moduleLevel}
                          page={window.location.pathname || ""}
                          chartData={data.charts[0]}
                          chartId={data.charts[0].id}
                          filters={filters}
                          selectedState={selectedState}
                          totalCount={totalCount}
                          liveCount={liveCount}
                          updateSelectedState={this.updateSelectedState}
                        ></MapChart>
                      </Grid>
                    </Grid>
                  </CardBody>
                </div>
                <div style={{ width: "49%", borderLeft: "1px solid #D6D5D4" }}>
                  <CardHeader color="rose" icon page={pageId || "overview"}>
                    <CardIcon color="rose" bgColor={"#F47738"}>
                      <Icons type={newData.name}></Icons>
                    </CardIcon>
                    <div style={{ textAlign: "left", color: "black" }}>
                      <Typography className={classes.cardTitle}>
                        {getLocaleLabels(
                          selectedState
                            ? `${selectedState.toUpperCase()}_${newData.name}`
                            : newData.name
                        )}
                      </Typography>
                    </div>
                  </CardHeader>
                  <CardBody page={pageId || "overview"}>
                    <Grid container spacing={24}>
                      <Grid
                        item
                        xs={12}
                        sm={12}
                        md={12}
                        lg={12}
                        xl={12}
                        className={classes.customCard}
                      >
                        <HorBarChart
                          moduleLevel={moduleLevel}
                          page={window.location.pathname || ""}
                          chartData={newData.charts[0]}
                          chartId={newData.charts[0].id}
                          filters={filters}
                          selectedState={selectedState}
                        ></HorBarChart>
                      </Grid>
                    </Grid>
                  </CardBody>
                </div>
              </div>
            </Card>
          </Grid>
        );
      } else if (data.charts[0].chartType == "bar") {
        return data.charts[0].chartType == "bar" ? null : (
          <Grid
            item
            xs={12}
            sm={12}
            md={6}
            lg={6}
            xl={6}
            className={classes.paper}
            style={{ paddingBottom: "5px" }}
            data-html2canvas-ignore="true"
          >
            <Card color="blue" bgColor={"white"} page={pageId}>
              <CardHeader color="rose" icon page={pageId || "overview"}>
                <CardIcon color="rose" bgColor={"#F47738"}>
                  <Icons type={data.name}></Icons>
                </CardIcon>
                <div style={{ textAlign: "left", color: "black" }}>
                  <Typography className={classes.cardTitle}>
                    {selectedState
                      ? strings[`${selectedState.toUpperCase()}_${data.name}`]
                        ? strings[`${selectedState.toUpperCase()}_${data.name}`]
                        : `${selectedState.toUpperCase()}_${data.name}`
                      : strings[data.name] || data.name}
                  </Typography>
                </div>
              </CardHeader>
              <CardBody page={pageId || "overview"}>
                <Grid container spacing={24}>
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={12}
                    lg={12}
                    xl={12}
                    className={classes.customCard}
                  >
                    <HorBarChart
                      moduleLevel={moduleLevel}
                      page={window.location.pathname || ""}
                      chartData={data.charts[0]}
                      chartId={data.charts[0].id}
                      filters={filters}
                      selectedState={selectedState}
                    ></HorBarChart>
                  </Grid>
                </Grid>
              </CardBody>
            </Card>
          </Grid>
        );
      } else {
        return (
          <Grid
            item
            xs={12}
            sm={12}
            md={12}
            lg={12}
            xl={12}
            className={classes.paper}
            style={{ paddingBottom: "5px" }}
          >
            <Card
              color={"blue"}
              //              bgColor={isNurtDashboard()?"white":"rgba(33, 150, 243, 0.24)"}
              bgColor={"white"}
              page={pageId}
            >
              <CardHeader color="rose" icon page={pageId || "overview"}>
                <CardIcon
                  color="rose"
                  bgColor={"#F47738"}
                  // bgColor={isNurtDashboard()?"#F47738":"#2196F3"}
                >
                  <Icons type={data.name}></Icons>
                </CardIcon>
                {isNurtDashboard() && pageId === "national-overview" ? (
                  <div
                    style={{
                      textAlign: "right",
                      color: "#F47738",
                      fontSize: 16,
                      fontWeight: "bold",
                    }}
                  >
                    <span style={{ paddingRight: 10 }}>
                      {strings["DSS_OVERVIEW"] || "DSS_OVERVIEW"}
                    </span>
                    <span>
                      {" "}
                      <img src={Arrow_Right} width={14}></img>
                    </span>
                  </div>
                ) : (
                  <div></div>
                )}
                <div
                  style={{
                    textAlign: "left",
                    color: "black",
                    marginTop: isNurtDashboard() ? -20 : 0,
                  }}
                >
                  <Typography className={classes.cardTitle}>
                    {strings[data.name] || data.name}
                  </Typography>
                </div>
              </CardHeader>
              <CardBody page={pageId || "overview"}>
                <Grid container spacing={24}>
                  {data &&
                    data.charts &&
                    Array.isArray(data.charts) &&
                    data.charts.length > 0 &&
                    data.charts.map((d, i) => {
                      return (
                        <Grid
                          item
                          xs={6}
                          sm={12}
                          md={3}
                          lg={3}
                          xl={3}
                          className={classes.customCard}
                        >
                          <CustomCard
                            key={d.id}
                            moduleLevel={moduleLevel}
                            chartData={d}
                            filters={filters}
                            type="overview"
                            isHome={true}
                            page={window.location.pathname || ""}
                          ></CustomCard>
                        </Grid>
                      );
                    })}
                </Grid>
              </CardBody>
            </Card>
          </Grid>
        );
      }
    } else {
      return (
        <Grid
          item
          xs={12}
          sm={12}
          md={4}
          lg={4}
          xl={4}
          className={classes.root}
        >
          <Card color="blue" bgColor={bgColor} page={pageId}>
            <CardHeader color="rose" icon page={pageId || "overview"}>
              <CardIcon color="rose" bgColor={iconColor}>
                <Icons type={data.name}></Icons>
              </CardIcon>
              <div style={{ textAlign: "left", color: "black" }}>
                <Typography className={classes.cardTitle}>
                  {strings[data.name] || data.name}
                </Typography>
              </div>
            </CardHeader>
            <CardBody page={pageId || "overview"}>
              <Grid container spacing={24}>
                {data &&
                  data.charts &&
                  Array.isArray(data.charts) &&
                  data.charts.length > 0 &&
                  data.charts.map((d, i) => {
                    return (
                      <Grid
                        item
                        xs={6}
                        sm={12}
                        md={6}
                        lg={6}
                        xl={6}
                        className={classes.customCard}
                      >
                        <CustomCard
                          chartLabelName={chartLabelName}
                          key={d.id}
                          moduleLevel={moduleLevel}
                          chartData={d}
                          filters={filters}
                          type="module"
                          isHome={true}
                          page={window.location.pathname || ""}
                        ></CustomCard>
                      </Grid>
                    );
                  })}
              </Grid>
            </CardBody>
          </Card>
        </Grid>
      );
    }
  }

  callDashboardAPI() {
    let dashboardApi = new dashboardAPI(20000);
    let overview = false;
    if (
      _.toLower(this.state.page) === "dashboard" ||
      typeof this.state.page == "undefined"
    ) {
      overview = true;
    } else {
      this.setState({
        dontShowHeader: false,
      });
    }

    let path = "";
    if (window.location.pathname && window.location.pathname.includes("ulb-")) {
      path = "ulb-home";
    } else if (window.location.pathname && isNurtDashboard()) {
      path = "NURT_DASHBOARD";
    } else {
      path = "home";
    }
    this.props.APITransport(dashboardApi, path || "home");
  }

  componentDidMount() {
    let newFilterData = this.state.filter;
    newFilterData.duration.value.startDate =
      this.state.getFYobj.value.startDate;
    newFilterData.duration.value.endDate = this.state.getFYobj.value.endDate;

    this.setState({
      filter: newFilterData,
    });

    let mdmsApi = new mdmsAPI(20000);
    this.props.APITransport(mdmsApi);

    this.callDashboardAPI();
  }

  getTitleText(strings) {
    let title, fromTxt, toTxt;

    fromTxt = strings["DSS_FROM"] ? strings["DSS_FROM"] : "DSS_FROM";
    toTxt = strings["DSS_TO"] ? strings["DSS_TO"] : "DSS_TO";

    title =
      fromTxt +
      " " +
      moment.unix(this.state.getFYobj.value.startDate).format("MMM DD, YYYY") +
      " " +
      toTxt +
      " " +
      moment().format("MMM DD, YYYY");

    return title;
  }

  render() {
    let { classes, strings } = this.props;
    let { dashboardConfigData } = this.state;
    let tabsInitData =
      dashboardConfigData &&
      Array.isArray(dashboardConfigData) &&
      dashboardConfigData.length > 0 &&
      dashboardConfigData[0]
        ? dashboardConfigData[0]
        : "";
    let dashboardName =
      dashboardConfigData &&
      Array.isArray(dashboardConfigData) &&
      dashboardConfigData.length >= 0 &&
      dashboardConfigData[0] &&
      dashboardConfigData[0].name &&
      dashboardConfigData[0].name;
    return (
      <Grid container spacing={24} id="divToPrint">
        <Grid container spacing={24} className={classes.actions}>
          <Grid
            item
            xs={12}
            sm={12}
            md={6}
            lg={6}
            xl={6}
            className={classes.pageHeader}
          >
            {this.props.strings[dashboardName] || dashboardName}
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            md={6}
            lg={6}
            xl={6}
            style={{ textAlign: "right", justifyContent: "flex-end" }}
          >
            {/* {isMobile && <div id="divNotToPrint" data-html2canvas-ignore="true" className={classes.posit}>

                            <Menu type="download" bgColor="white" color="black" fileHeader="SURE Dashboard" fileName={dashboardName}></Menu>
                            {!this.state.dontShowHeader &&
                                <Button className={classes.btn1} data-html2canvas-ignore="true"
                                    onClick={this.handleFilters.bind(this)}
                                    fileName={dashboardName}
                                >
                                    <FilterIcon></FilterIcon>
                                </Button>
                            }
                        </div>
                        } */}

            {!isMobile && (
              <div
                id="divNotToPrint"
                className={classes.acbtn}
                data-html2canvas-ignore="true"
                style={{ display: "flex", justifyContent: "flex-end" }}
              >
                <CustomizedMenus
                  key="download"
                  fileName={dashboardName}
                  fileHeader="State Wide Urban Real-Time Executive (SURE) Dashboard"
                />
                <CustomizedShare key="share" fileName={dashboardName} />
              </div>
            )}
          </Grid>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <Typography
            className={classes.filter}
            style={{ color: "#505A5F", fontSize: "14px", fontWeight: "400" }}
          >
            {this.getTitleText(strings)}
          </Typography>
        </Grid>
        {isMobile && (
          <div
            id="divNotToPrint"
            className={classes.acbtn}
            data-html2canvas-ignore="true"
            style={{ display: "flex", justifyContent: "flex-end" }}
          >
            <CustomizedMenus
              key="download"
              fileName={dashboardName}
              fileHeader="State Wide Urban Real-Time Executive (SURE) Dashboard"
            />
            <CustomizedShare key="share" fileName={dashboardName} />
          </div>
        )}

        {/* {tabsInitData.visualizations && Array.isArray(tabsInitData.visualizations) && tabsInitData.visualizations.length > 0 && this.gettingData(tabsInitData.visualizations)} */}
        {tabsInitData.visualizations &&
          Array.isArray(tabsInitData.visualizations) &&
          tabsInitData.visualizations.length > 0 &&
          tabsInitData.visualizations.map((k, v) => {
            return (
              k.vizArray &&
              Array.isArray(k.vizArray) &&
              k.vizArray.length > 0 &&
              k.vizArray.map((data, index) => {
                // if (data.vizType.toUpperCase() !== 'COLLECTION') { this.gettingData(data) }
                return this.renderChart(data, index, k.vizArray);
              })
            );
          })}
      </Grid>
    );
  }
}

const mapStateToProps = (state) => ({
  strings: state.lang,
  dashboardConfigData: state.firstReducer.dashboardConfigData,
  mdmsData: state.mdmsData,
  GFilterData: state.GFilterData,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      APITransport: APITransport,
    },
    dispatch
  );

export default withStyles(style)(
  connect(mapStateToProps, mapDispatchToProps)(Home)
);
