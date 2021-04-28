import * as actionTypes from "./actionTypes";

export const setRoute = route => {
  return { type: actionTypes.SET_ROUTE, route };
};
