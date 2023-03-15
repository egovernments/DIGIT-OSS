import React, { Component } from "react";
import ServiceList from "egov-ui-kit/common/common/ServiceList"
import { getNotificationCount, getNotifications } from "egov-ui-kit/redux/app/actions";
import { connect } from "react-redux";
import Label from "egov-ui-kit/utils/translationNode";
import ServicesNearby from "./components/ServicesNearby";
import { Notifications, Screen } from "modules/common";
import LogoutDialog from "egov-ui-kit/common/common/Header/components/LogoutDialog";
import { getUserInfo } from "egov-ui-kit/utils/localStorageUtils";
import { toggleSpinner } from "egov-ui-kit/redux/common/actions";
import { setRoute } from "egov-ui-kit/redux/app/actions";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import get from "lodash/get";
import "./index.css";

class CitizenDashboard extends Component {
  state = {
    whatsNewEvents: [],
    openDialog: false,
  };
  constructor(props){
    super(props);
    /* RAIN-7250 Always Navigate to new UI Incase user clicks on Home  */
    window.location.href="/digit-ui/citizen";
  }
  componentWillReceiveProps = (nextProps) => {
    const { cityUpdateDialog } = nextProps;
    const permanentCity = get(nextProps, "userInfo.permanentCity");
    if (!permanentCity) {
      if (get(this.props, "userInfo.permanentCity") !== get(nextProps, "userInfo.permanentCity")) {
        if (cityUpdateDialog) {
          this.setState({
            openDialog: true,
          });
        }
      }
    }
  };

  handleClose = () => {
    const { prepareFinalObject } = this.props;
    prepareFinalObject("cityUpdateDialog", false);
    this.setState({ ...this.state, openDialog: false });
  };

  redirectToEditProfile = () => {
    const { setRoute } = this.props;
    setRoute("user/profile");
  };

  onServiceClick = (route) => {
    const { history } = this.props;
    const permanentCity = JSON.parse(getUserInfo()).permanentCity;
    permanentCity
      ? history.push(route)
      : this.setState({
          openDialog: true,
        });
  };

  render() {
    const { history, loading, whatsNewEvents, setRoute } = this.props;
    const { openDialog } = this.state;
    return (
      <Screen loading={loading}>
        {/* <SearchService history={history} /> */}
        <div className="citizen-dashboard-cont">
          {whatsNewEvents && (
            <Label
              label="DASHBOARD_CITIZEN_SERVICES_LABEL"
              fontSize={16}
              color="rgba(0, 0, 0, 0.87"
              containerStyle={{ paddingTop: 16, paddingBottom: 8 }}
            />
          )}
          <ServiceList history={history} setRoute={setRoute} />
          {whatsNewEvents && (
            <Label
              label="DASHBOARD_LOCAL_INFORMATION_LABEL"
              fontSize={16}
              color="rgba(0, 0, 0, 0.87"
              containerStyle={{ paddingTop: 16, paddingBottom: 8 }}
            />
          )}
          {whatsNewEvents && <ServicesNearby history={history} onServiceClick={this.onServiceClick} />}
          {whatsNewEvents && whatsNewEvents.length > 0 && (
            <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 16 }}>
              <Label label="DASHBOARD_WHATS_NEW_LABEL" fontSize={16} color="rgba(0, 0, 0, 0.8700000047683716)" />
              <div onClick={() => history.push("whats-new")} style={{ cursor: "pointer" }}>
                <Label label="DASHBOARD_VIEW_ALL_LABEL" color="#fe7a51" fontSize={14} />
              </div>
            </div>
          )}
          {whatsNewEvents && <Notifications notifications={whatsNewEvents} history={history} />}
        </div>
        <LogoutDialog
          logoutPopupOpen={openDialog}
          closeLogoutDialog={this.handleClose}
          logout={this.redirectToEditProfile}
          oktext={"CORE_CHANGE_TENANT_OK"}
          canceltext={"CORE_CHANGE_TENANT_CANCEL"}
          title={"Alert"}
          body={"Please update your City"}
        />
      </Screen>
    );
  }
}

const mapStateToProps = (state) => {
  const notifications = get(state.app, "notificationObj.notificationsById");
  const cityUpdateDialog = get(state.screenConfiguration, "preparedFinalObject.cityUpdateDialog");
  const userInfo = get(state.auth, "userInfo");
  const loading = get(state.app, "notificationObj.loading");
  let filteredNotifications =
    notifications &&
    Object.values(notifications).filter((item) => {
      return item.type === "BROADCAST" || (item.type === "SYSTEMGENERATED" && item.actions);
    });
  let whatsNewEvents = filteredNotifications && filteredNotifications.slice(0, Math.min(3, filteredNotifications.length));
  return { notifications, userInfo, loading, whatsNewEvents, cityUpdateDialog };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getNotificationCount: (queryObject, requestBody) => dispatch(getNotificationCount(queryObject, requestBody)),
    getNotifications: (queryObject, requestBody) => dispatch(getNotifications(queryObject, requestBody)),
    toggleSpinner: () => dispatch(toggleSpinner()),
    setRoute: (path) => dispatch(setRoute(path)),
    prepareFinalObject: (path, value) => dispatch(prepareFinalObject(path, value)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CitizenDashboard);
