import React, { Component } from "react";
import { Link } from "react-router-dom";
import SearchService from "./components/SearchService";
import ServiceList from "./components/ServiceList";
import { getNotificationCount, getNotifications } from "egov-ui-kit/redux/app/actions";
import { connect } from "react-redux";
import Label from "egov-ui-kit/utils/translationNode";
import ServicesNearby from "./components/ServicesNearby";
import { Notifications, Screen } from "modules/common";
import LogoutDialog from "egov-ui-kit/common/common/Header/components/LogoutDialog";
import "./index.css";
import get from "lodash/get";
import { getTransformedNotifications, onNotificationClick } from "egov-ui-kit/utils/commons";
import { getAccessToken } from "egov-ui-kit/utils/localStorageUtils";
import { toggleSpinner } from "egov-ui-kit/redux/common/actions";
import { setRoute } from "egov-ui-kit/redux/app/actions";

class CitizenDashboard extends Component {
  state = {
    whatsNewEvents: [],
    openDialog: false,
  };

  componentDidMount = () => {
    const { getNotificationCount, getNotifications, userInfo } = this.props;
    if (get(userInfo, "permanentCity")) {
      const queryObject = [
        {
          key: "tenantId",
          value: get(userInfo, "permanentCity"),
        },
      ];
      const requestBody = {
        RequestInfo: {
          apiId: "org.egov.pt",
          ver: "1.0",
          ts: 1502890899493,
          action: "asd",
          did: "4354648646",
          key: "xyz",
          msgId: "654654",
          requesterId: "61",
          authToken: getAccessToken(),
        },
      };

      getNotifications(queryObject, requestBody);
      getNotificationCount(queryObject, requestBody);
    } else {
      // this.setState({
      //   openDialog: true,
      // });
    }
  };

  componentWillReceiveProps = (nextProps) => {
    const { getNotificationCount, getNotifications } = nextProps;
    if (!get(this.props, "userInfo.permanentCity")) {
      if (get(nextProps, "userInfo.permanentCity")) {
        const permanentCity = get(nextProps, "userInfo.permanentCity");
        const queryObject = [
          {
            key: "tenantId",
            value: permanentCity,
          },
        ];
        const requestBody = {
          RequestInfo: {
            apiId: "org.egov.pt",
            ver: "1.0",
            ts: 1502890899493,
            action: "asd",
            did: "4354648646",
            key: "xyz",
            msgId: "654654",
            requesterId: "61",
            authToken: getAccessToken(),
          },
        };

        getNotifications(queryObject, requestBody);
        getNotificationCount(queryObject, requestBody);
      }
    }
  };

  handleClose = () => {
    this.setState({ ...this.state, openDialog: false });
  };

  redirectToEditProfile = () => {
    const { setRoute } = this.props;
    setRoute("user/profile");
  };

  render() {
    const { history, loading, whatsNewEvents } = this.props;
    const { openDialog } = this.state;
    return (
      <Screen loading={loading}>
        <SearchService history={history} />
        <div className="citizen-dashboard-cont">
          <Label
            label="DASHBOARD_CITIZEN_SERVICES_LABEL"
            fontSize={16}
            fontWeight={900}
            color="rgba(0, 0, 0, 0.87"
            containerStyle={{ paddingTop: 16, paddingBottom: 8 }}
          />
          <ServiceList history={history} />
          <Label
            label="DASHBOARD_LOCAL_INFORMATION_LABEL"
            fontSize={16}
            fontWeight={900}
            color="rgba(0, 0, 0, 0.87"
            containerStyle={{ paddingTop: 16, paddingBottom: 8 }}
          />
          <ServicesNearby history={history} />
          <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 16 }}>
            <Label label="DASHBOARD_WHATS_NEW_LABEL" fontSize={16} fontWeight={900} color="rgba(0, 0, 0, 0.8700000047683716)" />
            <div onClick={() => onNotificationClick(history)} style={{ cursor: "pointer" }}>
              <Label label="DASHBOARD_VIEW_ALL_LABEL" color="#fe7a51" fontSize={14} />
            </div>
          </div>
          <Notifications notifications={whatsNewEvents} history={history} />
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
  const notifications = get(state.app, "notificationObj.notifications");
  // const cities = state.common.cities || [];
  const userInfo = get(state.auth, "userInfo");
  const loading = get(state.app, "notificationObj.loading");
  let filteredNotifications =
    notifications &&
    notifications.filter((item) => {
      return item.eventType === "SYSTEMGENERATED" || item.eventType === "BROADCAST";
    });
  let whatsNewEvents =
    filteredNotifications && getTransformedNotifications(filteredNotifications).slice(0, Math.min(3, filteredNotifications.length));

  return { notifications, userInfo, loading, whatsNewEvents };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getNotificationCount: (queryObject, requestBody) => dispatch(getNotificationCount(queryObject, requestBody)),
    getNotifications: (queryObject, requestBody) => dispatch(getNotifications(queryObject, requestBody)),
    toggleSpinner: () => dispatch(toggleSpinner()),
    setRoute: (path) => dispatch(setRoute(path)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CitizenDashboard);
