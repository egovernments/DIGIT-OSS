import { refreshTokenRequest } from "egov-ui-kit/redux/auth/actions";
import { USER_SEARCH_SUCCESS } from "./actionTypes";
import { getAccessToken, getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import { getNotificationCount, getNotifications } from "../app/actions";
import get from "lodash/get"

const auth = (store) => (next) => (action) => {
  const { type } = action;
  const state = store.getState();
  const notifications = get(state.app, "notificationObj.notificationsById");

  if (type === USER_SEARCH_SUCCESS) {
    if (process.env.REACT_APP_NAME === "Citizen") {
      const permanentCity = action.user && action.user.permanentCity;
      const queryObject = [
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
      if ((window.location.pathname === "/" || window.location.pathname === "/citizen/" || window.location.pathname === "/employee/inbox")) {
        store.dispatch(getNotifications(queryObject, requestBody));
        store.dispatch(getNotificationCount(queryObject, requestBody));
      }
    }
  }

  if (/(_ERROR|_FAILURE)$/.test(type) && action.error === "INVALID_TOKEN") {
    store.dispatch(refreshTokenRequest());
  } else {
    next(action);
  }
};

export default auth;
