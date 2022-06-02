import * as actionTypes from "./actionTypes";
import { httpRequest } from "ui-utils/api";

export const setProcessInstances = payload => {
  return {
    type: actionTypes.GET_WORK_FLOW,
    payload
  };
};

export const getWorkFlowData = queryObject => {
  return async (dispatch, getState) => {
    try {
      const payload = await httpRequest(
        "post",
        "egov-workflow-v2/egov-wf/process/_search",
        "",
        queryObject
      );
      dispatch(setProcessInstances(payload));
    } catch (error) {
    }
  };
};
