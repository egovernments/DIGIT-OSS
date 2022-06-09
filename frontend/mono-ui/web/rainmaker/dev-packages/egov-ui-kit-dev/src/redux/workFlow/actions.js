import * as actionTypes from "./actionTypes";
import { httpRequest } from "egov-ui-kit/utils/api";

export const fetchBuisnessService = (payload) => {
  return {
    type: actionTypes.FETCH_BUISNESS_SERVICE,
    payload,
  };
};

export const getBuisnessServiceData = (queryObject) => {
  return async (dispatch, getState) => {
    try {
      const payload = await httpRequest("egov-workflow-v2/egov-wf/businessservice/_search", "_search", queryObject);
      dispatch(fetchBuisnessService(payload));
    } catch (error) {
    }
  };
};
