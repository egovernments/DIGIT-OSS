import React from "react";
import { Notifications, Screen } from "modules/common";
import get from "lodash/get";
import { connect } from "react-redux";
import "../index.css";
import { getNotifications } from "egov-ui-kit/redux/app/actions";
import { getAccessToken, getUserInfo } from "egov-ui-kit/utils/localStorageUtils";

class Events extends React.Component {
  componentDidMount = () => {
    const { getNotifications } = this.props;

    let queryObject = [
      {
        key: "tenantId",
        value: JSON.parse(getUserInfo()).permanentCity,
      },
      {
        key: "eventTypes",
        value: "EVENTSONGROUND",
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
  };

  render() {
    const { notifications, history, loading } = this.props;
    let eventarray = notifications && Object.values(notifications).filter((item) => item.type === "EVENTSONGROUND" && !item.referenceId);
    return (
      <Screen className="notifications-screen-style" loading={loading}>
        <Notifications notifications={eventarray} history={history} />
      </Screen>
    );
  }
}

const mapStateToProps = (state) => {
  const notifications = get(state.app, "notificationObj.notificationsById");
  const loading = get(state.app, "notificationObj.loading");
  return { notifications, loading };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getNotifications: (queryObject, requestBody) => dispatch(getNotifications(queryObject, requestBody)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Events);
