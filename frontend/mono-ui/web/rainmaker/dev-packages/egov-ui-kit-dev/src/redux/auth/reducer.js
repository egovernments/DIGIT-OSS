import * as actionTypes from "./actionTypes";
import { getTenantId, getAccessToken, getUserInfo } from "egov-ui-kit/utils/localStorageUtils";

const userInfo = JSON.parse(getUserInfo());
const authenticated = userInfo ? true : false;
const tenantId = getTenantId();
const token = getAccessToken();

const intialState = {
  authenticating: false,
  authenticated,
  authenticationFailed: !authenticated,
  userInfo,
  token,
  tenantId,
};

const auth = (state = intialState, action) => {
  const { type } = action;

  switch (type) {
    case actionTypes.USER_SEARCH_SUCCESS:
      return { ...state, userInfo: action.user };
    case actionTypes.AUTHENTICATING:
      return { ...state, authenticated: false, authenticationFailed: true, authenticating: true };
    case actionTypes.AUTHENTICATED:
      return {
        ...state,
        authenticated: true,
        authenticationFailed: false,
        authenticating: false,
        userInfo: action.userInfo,
        token: action.accessToken,
      };
    case actionTypes.AUTHENTICATION_FAILED:
      return { ...state, authenticated: false, authenticationFailed: true, authenticating: false };
    case actionTypes.USER_PROFILE_UPDATED:
      return { ...state, userInfo: action.user };
    case actionTypes.LOGOUT:
      return {
        ...state,
        authenticated: false,
        authenticationFailed: false,
        authenticating: false,
        userInfo: {},
        token: "",
      };
    case actionTypes.SEND_OTP_STARTED:
      return { ...state, authenticating: true };
    case actionTypes.SEND_OTP_COMPLETED:
      return { ...state, authenticating: false };
    default:
      return state;
  }
};

export default auth;
