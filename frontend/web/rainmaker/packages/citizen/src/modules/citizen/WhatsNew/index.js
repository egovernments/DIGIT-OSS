import React from "react";
import { Notifications, Screen } from "modules/common";
import get from "lodash/get";
import { connect } from "react-redux";
import "../index.css";
import { getNotifications } from "egov-ui-kit/redux/app/actions";
import { getAccessToken, getUserInfo ,getTenantId} from "egov-ui-kit/utils/localStorageUtils";

class Updates extends React.Component {
  componentDidMount = () => {
    const { getNotifications, whatsNewNotifications } = this.props;
    const permanentCity = JSON.parse(getUserInfo()).permanentCity;
    if (!whatsNewNotifications) {
      let queryObject = [
        {
          key: "tenantId",
          value: permanentCity ? permanentCity : getTenantId(),
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
    }
  };

  render() {
    const { whatsNewNotifications, history, loading } = this.props;
    return (
      <Screen loading={loading} className="notifications-screen-style">
        {whatsNewNotifications && <Notifications notifications={Object.values(whatsNewNotifications)} history={history} />}
      </Screen>
    );
  }
}

const mapStateToProps = (state) => {
  const notifications = get(state.app, "notificationObj.notificationsById");
  const loading = get(state.app, "notificationObj.loading");
  let whatsNewNotifications =
    notifications &&
    Object.values(notifications).filter((item) => {
      return item.type === "BROADCAST" || (item.type === "SYSTEMGENERATED" && item.actions);
    });
  return { whatsNewNotifications, loading };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getNotifications: (queryObject, requestBody) => dispatch(getNotifications(queryObject, requestBody)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Updates);
