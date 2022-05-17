import React from "react";
import PropertyTaxIcon from "../../../images/property-tax.svg";
import DashBoardIcon from "../../../images/dashboards.svg";
import ComplaintsIcon from "../../../images/complaints.svg";
import TradeIcon from "../../../images/trade-license.svg";
import WaterSewerage from "../../../images/water_sewerage.svg";
import FSM from "../../../images/fsm.svg";
import FireNoc from "../../../images/firenocdashboard.svg";
import Mcollect from "../../../images/mcollect.svg";
import OBPS from "../../../images/obps.svg";
import Propertytax from "../../../images/propertytax_nurt.svg";
import Tradelic from "../../../images/tradeLic_nurt.svg";
import WandS from "../../../images/w&s_nurt.svg";
import BuildingPermission from "../../../images/building_permission.svg";
import BirthDeathIcon from "../../../images/birth_death.svg";
import Style from "./Styles";
import { withStyles } from "@material-ui/core/styles";

import SVG from "react-inlinesvg";

class Icon extends React.Component {
  constructor(props) {
    super(props);
  }

  renderIcons(type) {
    let { classes } = this.props;
    switch (type.toLowerCase()) {
      case "overview":
      case "dss_overview":
        return (
          <SVG
            src={DashBoardIcon}
            fill="white"
            className={classes.icon}
            style={{ width: "54px", height: "54px", color: "white" }}
          ></SVG>
        );
      case "property tax":
      case "dss_property_tax":
        return (
          <SVG
            src={PropertyTaxIcon}
            fill="white"
            className={classes.icon}
            style={{ width: "54px", height: "54px" }}
          ></SVG>
        );
      case "trade license":
      case "dss_trade_licence":
        return (
          <SVG
            src={TradeIcon}
            fill="white"
            className={classes.icon}
            style={{ width: "54px", height: "54px" }}
          ></SVG>
        );
      case "complains":
      case "dss_pgr_overview":
      case "dss_complains":
        return (
          <SVG
            src={ComplaintsIcon}
            fill="white"
            className={classes.icon}
            style={{ width: "54px", height: "54px" }}
          ></SVG>
        );
      case "water sewerage":
      case "dss_water_sewerage":
        return (
          <SVG
            src={WaterSewerage}
            fill="white"
            className={classes.icon}
            style={{ width: "54px", height: "54px" }}
          ></SVG>
        );
      case "fsm":
      case "dss_fsm":
        return (
          <SVG
            src={FSM}
            fill="white"
            className={classes.icon}
            style={{ width: "54px", height: "54px" }}
          ></SVG>
        );
      case "mCollect":
      case "dss_mcollect":
        return (
          <SVG
            src={Mcollect}
            fill="white"
            className={classes.icon}
            style={{ width: "54px", height: "54px" }}
          ></SVG>
        );
      case "fire noc dashboard":
      case "fire noc dashboard":
      case "dss_firenoc_overview":
        return (
          <SVG
            src={FireNoc}
            fill="white"
            className={classes.icon}
            style={{ width: "54px", height: "54px" }}
          ></SVG>
        );
      case "obps dashboard":
      case "obps dashboard":
      case "dss_obps_overview":
        return (
          <SVG
            src={OBPS}
            fill="white"
            className={classes.icon}
            style={{ width: "54px", height: "54px" }}
          ></SVG>
        );
      case "nurt_overview":
        return (
          <SVG
            src={DashBoardIcon}
            fill="white"
            className={classes.icon}
            style={{ width: "54px", height: "54px", color: "white" }}
          ></SVG>
        );
      case "nurt_project_staus":
        return (
          <SVG
            src={DashBoardIcon}
            fill="white"
            className={classes.icon}
            style={{ width: "54px", height: "54px", color: "white" }}
          ></SVG>
        );
      case "nurt_property_tax":
        return (
          <SVG
            src={PropertyTaxIcon}
            fill="white"
            className={classes.icon}
            style={{ width: "54px", height: "54px", color: "white" }}
          ></SVG>
        );
      case "nurt_trade_licence":
        return (
          <SVG
            src={Tradelic}
            fill="white"
            className={classes.icon}
            style={{ width: "54px", height: "54px", color: "white" }}
          ></SVG>
        );
      case "nurt_complains":
        return (
          <SVG
            src={ComplaintsIcon}
            fill="white"
            className={classes.icon}
            style={{ width: "54px", height: "54px", color: "white" }}
          ></SVG>
        );
      case "nurt_water_sewerage":
        return (
          <SVG
            src={WaterSewerage}
            fill="white"
            className={classes.icon}
            style={{ width: "54px", height: "54px", color: "white" }}
          ></SVG>
        );
      case "dss_building_permission":
        return (
          <SVG
            src={BuildingPermission}
            fill="white"
            className={classes.icon}
            style={{ width: "54px", height: "54px", color: "white" }}
          ></SVG>
        );
      case "nurt_firenoc":
        return (
          <SVG
            src={FireNoc}
            fill="white"
            className={classes.icon}
            style={{ width: "54px", height: "54px", color: "white" }}
          ></SVG>
        );
      case "nurt_mcollect":
        return (
          <SVG
            src={Mcollect}
            fill="white"
            className={classes.icon}
            style={{ width: "54px", height: "54px", color: "white" }}
          ></SVG>
        );
      case "nurt_live_active_ulbs":
        return (
          <SVG
            src={DashBoardIcon}
            fill="white"
            className={classes.icon}
            style={{ width: "54px", height: "54px", color: "white" }}
          ></SVG>
        );
      case "dss_birth_death":
      case "nss_birth_death":
      case "nurt_birth":
      case "nurt_death":
      case "nurt_bnd":
        return (
          <SVG
            src={BirthDeathIcon}
            fill="white"
            className={classes.icon}
            style={{ width: "54px", height: "54px", color: "white" }}
          ></SVG>
        );
      default:
        return <div></div>;
    }
  }

  render() {
    return <div>{this.renderIcons(this.props.type)}</div>;
  }
}

export default withStyles(Style)(Icon);
