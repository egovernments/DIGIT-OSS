import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import { Dashboard } from "modules/common";
import React, { Component } from "react";
import { connect } from "react-redux";

class LandingPage extends Component {
  state = { mdmsResponse: {}, dialogueOpen: false };

  onPGRClick = () => {
    this.props.history.push("all-complaints");
  };
  onDialogueClose = () => {
    this.setState({
      dialogueOpen: false,
    });
  };

  getModuleItems = (citiesByModule) => {
    const { moduleData } = this;
    const tenantId = getTenantId();
    const modulesToShow = Object.keys(moduleData);

    return (
      citiesByModule &&
      Object.keys(citiesByModule).reduce((acc, item) => {
        const index = citiesByModule[item].tenants.findIndex((tenant) => {
          return tenant.code === tenantId;
        });
        if (index > -1) {
          modulesToShow.indexOf(item) > -1 &&
            acc.push({
              cities: citiesByModule[item].tenants.map((item, key) => {
                return item.code;
              }),
              ...moduleData[item],
            });
        }
        return acc;
      }, [])
    );
  };

  moduleData = {
    PGR: {
      moduleTitle: "COMMON_BOTTOM_NAVIGATION_COMPLAINTS",
      button1: "COMMON_BOTTOM_NAVIGATION_COMPLAINTS",
      //borderLeftColor: { borderLeft: "4px solid #a5d6a7" },
      iconAction: "action",
      route: "all-complaints",
      iconName: "announcement",
      iconStyle: { width: "50px", height: "50px", marginTop: "10px", fill: "rgba(0, 0, 0, 0.60)" },
    },
    PT: {
      moduleTitle: "PT_PAYMENT_STEP_HEADER1",
      button1: "PT_PAYMENT_STEP_HEADER1",
      //borderLeftColor: { borderLeft: "4px solid #ef9a9a" },
      iconAction: "custom",
      iconName: "dashboard-complaint",
      route: "property-tax",
      iconStyle: { width: "60px", height: "60px", marginTop: "10px", fill: "rgba(0, 0, 0, 0.60)" },
    },
    Finance: {
      moduleTitle: "Finance",
      button1: "Inbox",
      //borderLeftColor: { borderLeft: "4px solid #add8e6" },
      iconAction: "custom",
      iconName: "rupee",
      route: "services/EGF/inbox",
      iconStyle: { width: "50px", height: "50px", marginBottom: "10px", fill: "rgba(0, 0, 0, 0.60)" },
    },
    TL: {
      moduleTitle: "TL_COMMON_TL",
      button1: "TL_COMMON_TL",
      // borderLeftColor: { borderLeft: "4px solid #add8e6" },
      iconAction: "places",
      iconName: "business-center",
      route: "tradelicense/search",
      iconStyle: { width: "50px", height: "50px", marginBottom: "10px", fill: "rgba(0, 0, 0, 0.60)" },
    },
    NOC: {
      moduleTitle: "NOC_COMMON_NOC",
      button1: "NOC_COMMON_NOC",
      // borderLeftColor: { borderLeft: "4px solid #add8e6" },
      iconAction: "Action",
      iconName: "description",
      route: "fire-noc/search",
      iconStyle: { width: "50px", height: "50px", marginBottom: "10px", fill: "rgba(0, 0, 0, 0.60)" },
    },
  };
  render() {
    const { history, name, citiesByModule } = this.props;
    const { getModuleItems, onPGRClick, onDialogueClose } = this;
    const moduleItems = getModuleItems(citiesByModule) || [];
    // const renderCityPicker = moduleItems && moduleItems.findIndex((item) => item.moduleTitle === "Complaints") > -1;
    return (
      <Dashboard
        moduleItems={moduleItems}
        history={history}
        userName={name}
        onPGRClick={onPGRClick}
        onDialogueClose={onDialogueClose}
        dialogueOpen={this.state.dialogueOpen}
        renderCityPicker={false}
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
