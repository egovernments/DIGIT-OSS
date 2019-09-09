import app from "egov-ui-framework/ui-redux/app/reducer";
import auth from "egov-ui-framework/ui-redux/auth/reducer";
import screenConfiguration from "egov-ui-framework/ui-redux/screen-configuration/reducer";

const rootReducer = {
  app,
  auth,
  screenConfiguration,
};

export default rootReducer;
