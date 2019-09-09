import * as authType from "./actionTypes";
import { localStorageGet } from "egov-ui-kit/utils/localStorageUtils";

export const authenticating = () => {
  return { type: authType.AUTHENTICATING };
};

export const authenticated = (payload = {}) => {
  //its depends on where your storing token
  const token = localStorageGet(
    "CognitoIdentityServiceProvider.34l3gjbtidmeo10omi969ftoi5.07f4204e-c40e-438a-964e-a0442048e626.accessToken"
  );
  return { type: authType.AUTHENTICATED, token };
};

export const authenticationFailed = () => {
  return { type: authType.AUTHENTICATION_FAILED };
};

export const logout = () => {
  return { type: authType.LOGOUT };
};
