import * as actionTypes from "./actionTypes";
import get from "lodash/get";
import orderBy from "lodash/orderBy";

const initialState = {
  ProcessInstances: []
};

const appReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_WORK_FLOW:
      return {
        ...state,
        ProcessInstances: get(action.payload, "ProcessInstances")
          ? get(action.payload, "ProcessInstances")
          : action.payload
      };

    default:
      return state;
  }
};
export default appReducer;
