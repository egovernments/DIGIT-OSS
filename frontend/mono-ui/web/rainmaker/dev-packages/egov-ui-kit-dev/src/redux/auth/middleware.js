import { refreshTokenRequest } from "egov-ui-kit/redux/auth/actions";

const auth = (store) => (next) => (action) => {
  const { type } = action;

  if (/(_ERROR|_FAILURE)$/.test(type) && action.error === "INVALID_TOKEN") {
    store.dispatch(refreshTokenRequest());
  } else {
    next(action);
  }
};

export default auth;
