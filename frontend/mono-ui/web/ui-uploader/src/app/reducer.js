import * as actionTypes from "../constants/actionTypes";

const initialState = {
  userInfo: null,
  token: null,
  authenticated: false,
  authenticating: false
};

const auth = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.INITIATE_USER_LOGIN:
      return { ...state, authenticating: true };
    case actionTypes.USER_LOGIN_SUCCESS:
      return {
        ...state,
        userInfo: action.userInfo,
        token: action.token,
        authenticated: true,
        authenticating: false
      };
    case actionTypes.USER_LOGIN_FAILURE:
      return { ...state, userInfo: null, authenticated: false, token: null };
    default:
      return state;
  }
};

export default auth;
