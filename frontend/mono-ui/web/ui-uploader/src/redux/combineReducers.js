import { combineReducers } from "redux";
import auth from "../app/reducer";
import uploadDefinitions from "../upload-definitions/reducer";
import jobCreate from "../create-job/reducer";
import userJobs from "../jobs/reducer";

const rootReducer = combineReducers({
  auth,
  uploadDefinitions,
  userJobs,
  jobCreate
});

export default rootReducer;
