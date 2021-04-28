import app from "../app/reducer";
import auth from "../auth/reducer";
import screenConfiguration from "../screen-configuration/reducer";
// import form from "../form/reducer";

const rootReducer = {
  app,
  auth,
  screenConfiguration
};

export default rootReducer;
