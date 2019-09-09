import * as actionTypes from "./actionTypes";
import { localStorageGet } from "egov-ui-kit/utils/localStorageUtils";

const token = localStorageGet(
  "CognitoIdentityServiceProvider.34l3gjbtidmeo10omi969ftoi5.07f4204e-c40e-438a-964e-a0442048e626.accessToken"
);

const intialState = {
  authenticated: false,
  authenticationFailed: false,
  token
};

const auth = (state = intialState, action) => {
  const { type } = action;

  switch (type) {
    case actionTypes.AUTHENTICATING:
      return { ...state, authenticated: false, authenticationFailed: true };
    case actionTypes.AUTHENTICATED:
      return {
        ...state,
        authenticated: true,
        authenticationFailed: false,
        token: action.accessToken
      };
    case actionTypes.AUTHENTICATION_FAILED:
      return { ...state, authenticated: false, authenticationFailed: true };
    case actionTypes.LOGOUT:
      return {
        ...state,
        authenticated: false,
        authenticationFailed: false,
        token: ""
      };
    default:
      return state;
  }
};

export default auth;
