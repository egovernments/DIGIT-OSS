import { combineReducers } from "redux";
import complaintReducer from "./complaintReducer";

const getRootReducer = () =>
  combineReducers({
    complaints: complaintReducer,
  });

export default getRootReducer;
