import app from "ui-redux/app/reducer";
import auth from "ui-redux/auth/reducer";
import screenConfiguration from "egov-ui-framework/ui-redux/screen-configuration/reducer";

const rootReducer = {
  app,
  auth,
  screenConfiguration,
};

export default rootReducer;
