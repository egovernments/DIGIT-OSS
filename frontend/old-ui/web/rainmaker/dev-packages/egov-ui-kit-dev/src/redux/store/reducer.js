import app from "../app/reducer";
import auth from "../auth/reducer";
import form from "../form/reducer";
import complaints from "../complaints/reducer";
import common from "../common/reducer";
import formtemp from "../formtemp/reducer";
import mdms from "../mdms/reducer";
import report from "../reports/report";
import properties from "../properties/reducer";
import workFlow from "../workFlow/reducer";
import screenConfiguration from "egov-ui-framework/ui-redux/screen-configuration/reducer";

const rootReducer = {
  app,
  auth,
  form,
  complaints,
  common,
  mdms,
  formtemp,
  report,
  properties,
  screenConfiguration,
  workFlow,
};

export default rootReducer;
