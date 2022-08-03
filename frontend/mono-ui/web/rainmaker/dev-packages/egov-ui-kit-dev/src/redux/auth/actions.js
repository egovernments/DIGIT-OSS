import * as authType from "./actionTypes";
import { toggleSnackbarAndSetText } from "egov-ui-kit/redux/app/actions";
import { httpRequest, loginRequest } from "egov-ui-kit/utils/api";
import { AUTH, USER, OTP } from "egov-ui-kit/utils/endPoints";
import { prepareFormData ,getUserSearchedResponse} from "egov-ui-kit/utils/commons";
import get from "lodash/get";
import {
  setTenantId,
  getAccessToken,
  setUserInfo,
  setAccessToken,
  setRefreshToken,
  localStorageSet,
  localStorageGet,
  clearUserDetails,
  setUserObj,
} from "../../utils/localStorageUtils";

// temp fix
const fixUserDob = (user = {}) => {
  const dob = user.dob;
  let transformeddob = null;
  if (dob && dob !== null) {
    let date = new Date(dob);
    transformeddob = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
    user = { ...user, dob: transformeddob };
  }
  return user;
};

export const userProfileUpdated = (payload = {}) => {
  const user = fixUserDob(payload.user[0]);
  setUserInfo(JSON.stringify(user));
  setUserObj(JSON.stringify(user));
  return { type: authType.USER_PROFILE_UPDATED, user };
};

export const userProfileUpdateError = (error) => {
  return { type: authType.USER_PROFILE_UPDATE_ERROR, error };
};

//user search success/failure
export const searchUserSuccess = (user = {}) => {
  user = fixUserDob(user.user[0]);
  //temporary fix for dat of birth format issue in prfile update
  setUserInfo(JSON.stringify(user));
  return { type: authType.USER_SEARCH_SUCCESS, user };
};

export const searchUserError = (error) => {
  return { type: authType.USER_SEARCH_ERROR, error };
};

export const authenticating = () => {
  return { type: authType.AUTHENTICATING };
};

export const authenticated = (payload = {}) => {
  const userInfo = fixUserDob(payload["UserRequest"]);
  const accessToken = payload.access_token;
  const refreshToken = payload.refresh_token;
  const expiresIn = payload.expires_in;
  const lastLoginTime = new Date().getTime();

  setUserInfo(JSON.stringify(userInfo));
  setAccessToken(accessToken);
  setRefreshToken(refreshToken);
  setTenantId(userInfo.tenantId);
  localStorageSet("expires-in", expiresIn);
  localStorageSet("last-login-time", lastLoginTime);

  return { type: authType.AUTHENTICATED, userInfo, accessToken };
};

export const authenticationFailed = () => {
  return { type: authType.AUTHENTICATION_FAILED };
};

// sending otp
export const sendOtpStarted = () => {
  return { type: authType.SEND_OTP_STARTED };
};

export const sendOtpCompleted = () => {
  return { type: authType.SEND_OTP_COMPLETED };
};

export const searchUser = () => {
  return async (dispatch, getState) => {
    const state = getState();
    const { userName, tenantId } = state.auth.userInfo || {};
    try {
      // const user = await httpRequest(USER.SEARCH.URL, USER.SEARCH.ACTION, [], { userName, tenantId });
      // delete user.responseInfo;
      const response=getUserSearchedResponse();
      dispatch(searchUserSuccess(response));
    } catch (error) {
      dispatch(searchUserError(error.message));
    }
  };
};

export const refreshTokenRequest = () => {
  return async (dispatch) => {
    const refreshToken = localStorageGet("refresh-token");
    const grantType = "refresh_token";
    const userType = process.env.REACT_APP_NAME === "Citizen" ? "CITIZEN" : "EMPLOYEE";
    try {
      const response = await loginRequest(null, null, refreshToken, grantType, "", userType);
      delete response.ResponseInfo;
      dispatch(authenticated(response));
      // only option for the time being!
      window.location.reload();
    } catch (error) {
      dispatch(logout());
    }
  };
};

// in future if you want to keep a track the number of times otp is sent
export const sendOTP = (intent) => {
  return async (dispatch, getState) => {
    const state = getState();
    const form = state.form[intent];
    const formData = prepareFormData(form);
    dispatch(sendOtpStarted());
    try {
      const formResponse = await httpRequest(OTP.RESEND.URL, OTP.RESEND.ACTION, [], formData);
    } catch (error) {}
    dispatch(sendOtpCompleted());
    dispatch(toggleSnackbarAndSetText(true, { labelName: "OTP has been Resent", labelKey: "ERR_OTP_RESENT" },"success"));
  };
};

export const logout = () => {
  return async () => {
    try {
      const authToken = getAccessToken();
      if (authToken) {
        const response = await httpRequest(AUTH.LOGOUT.URL, AUTH.LOGOUT.ACTION, [], { "access_token" : authToken });
      } else {
        clearUserDetails();
        process.env.REACT_APP_NAME === "Citizen"
          ? window.location.replace(`${window.basename}/user/register`)
          : window.location.replace(`${window.basename}/user/login`);
        return;
      }
    } catch (error) {
      clearUserDetails();
    }
    // whatever happens the client should clear the user details
    // let userInfo=getUserInfo();
    // let userRole=get(userInfo,"roles[0].code");
    clearUserDetails();
    // window.location.replace(`${window.basename}/user/login`)
    window.location.replace(`${window.basename}/user/login`);
  };
};
