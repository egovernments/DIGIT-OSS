import React, { Component } from "react";
import { Dashboard } from "modules/common";
import { connect } from "react-redux";
import { Label } from "egov-ui-kit/utils/translationNode";

class LandingPage extends Component {
  state = { mdmsResponse: {}, dialogueOpen: false };

  onPGRClick = () => {
    this.setState({
      dialogueOpen: true,
    });
  };
  onDialogueClose = () => {
    this.setState({
      dialogueOpen: false,
    });
  };

  getModuleItems = (citiesByModule) => {
    const { moduleData } = this;
    const modulesToShow = Object.keys(moduleData);
    return (
      citiesByModule &&
      Object.keys(citiesByModule).reduce((acc, item) => {
        modulesToShow.indexOf(item) > -1 &&
          acc.push({
            cities: citiesByModule[item].tenants.map((item) => {
              return item.code;
            }),
            ...moduleData[item],
          });
        return acc;
      }, [])
    );
  };

  moduleData = {
    PGR: {
      moduleTitle: "COMMON_BOTTOM_NAVIGATION_COMPLAINTS",
      moduleDescription: "CS_LANDING_PAGE_COMPLAINTS_DESCRIPTION",
      button1: "COMMON_BOTTOM_NAVIGATION_COMPLAINTS",
      button2: "CS_HOME_HEADER_HOW_IT_WORKS",
      route: "pgr-home",
      //borderLeftColor: { borderLeft: "4px solid #a5d6a7" },
      id: "citizen-pgr-landingpage-button",
      iconAction: "action",
      iconName: "announcement",
      iconStyle: { width: "50px", height: "50px", marginTop: "10px", fill: "rgba(0, 0, 0, 0.60)" },
      className: "pgr-landing-card",
    },
    PT: {
      moduleTitle: "PT_PAYMENT_STEP_HEADER1",
      moduleDescription: "CS_LANDING_PAGE_PROPERTY_TAX_DESCRIPTION",
      button1: "PT_PAYMENT_STEP_HEADER1",
      button2: "CS_HOME_HEADER_HOW_IT_WORKS",
      //borderLeftColor: { borderLeft: "4px solid #ef9a9a" },
      iconAction: "custom",
      id: "citizen-pt-landingpage-button",
      route: "property-tax",
      iconName: "dashboard-complaint",
      iconStyle: { width: "60px", height: "60px", marginTop: "10px", fill: "rgba(0, 0, 0, 0.60)" },
      className: "pt-landing-card",
    },
    TL: {
      moduleTitle: "TL_COMMON_TL",
      moduleDescription: "CS_LANDING_PAGE_TRADE_LICENSE_DESCRIPTION",
      button1: "TL_COMMON_TL",
      button2: "CS_HOME_HEADER_HOW_IT_WORKS",
      // borderLeftColor: { borderLeft: "4px solid #add8e6" },
      id: "citizen-tl-landingpage-button",
      iconAction: "places",
      iconName: "business-center",
      route: "tradelicense-citizen/home",
      iconStyle: { width: "50px", height: "50px", marginBottom: "10px", fill: "rgba(0, 0, 0, 0.60)" },
    },
    FIRENOC: {
      moduleTitle: "ACTION_TEST_FIRENOC",
      moduleDescription: "CS_LANDING_PAGE_NOC_DESCRIPTION",
      button1: "ACTION_TEST_FIRENOC",
      button2: "CS_HOME_HEADER_HOW_IT_WORKS",
      id: "citizen-tl-landingpage-button",
      iconAction: "social",
      iconName: "people",
      route: "fire-noc/home",
      iconStyle: { width: "50px", height: "50px", marginBottom: "10px", fill: "rgba(0, 0, 0, 0.60)" },
    },
  };

  render() {
    const { history, name, citiesByModule } = this.props;
    const { getModuleItems, onPGRClick, onDialogueClose } = this;
    const moduleItems = getModuleItems(citiesByModule) || [];
    const renderCityPicker = moduleItems && moduleItems.findIndex((item) => item.moduleTitle === "Complaints") > -1;
    return (
      <Dashboard
        moduleItems={moduleItems}
        history={history}
        userName={name}
        onPGRClick={onPGRClick}
        onDialogueClose={onDialogueClose}
        dialogueOpen={this.state.dialogueOpen}
        renderCityPicker={renderCityPicker}
      />
    );
  }
}

const mapStateToProps = (state) => {
  const { auth, common } = state;
  const { citiesByModule } = common || {};
  const { userInfo } = auth;
  const name = userInfo && userInfo.name;

  return { name, citiesByModule };
};

export default connect(
  mapStateToProps,
  null
)(LandingPage);
