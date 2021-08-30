import * as actionTypes from "./actionTypes";
import { transformById } from "utils/commons";

const mergeServiceWithActions = (payload) => {
  return payload.actionHistory.map((item, index) => {
    return {
      ...payload.services[index],
      actions: payload.actionHistory[index].actions,
    };
  });
};

const intialState = {
  loading: false,
  error: false,
  errorMessage: "",
  byId: {},
  categoriesById: {},
};

const complaintsReducer = (state = intialState, action) => {
  const { type } = action;

  switch (type) {
    case actionTypes.COMPLAINTS_FETCH_PENDING:
      return {
        ...state,
        loading: true,
        error: false,
        errorMessage: "",
      };
    case actionTypes.COMPLAINTS_FETCH_COMPLETE:
      let complaintsById = transformById(mergeServiceWithActions(action.payload), "serviceRequestId");
      return {
        ...state,
        loading: false,
        byId: {
          ...state.byId,
          ...complaintsById,
        },
      };
    case actionTypes.COMPLAINTS_FETCH_ERROR:
      return {
        ...state,
        loading: false,
        error: true,
        errorMessage: action.error,
      };
    case actionTypes.COMPLAINTS_CATEGORIES_FETCH_SUCCESS:
      let categoriesById = transformById(action.payload.MdmsRes["RAINMAKER-PGR"].ServiceDefs, "serviceCode");
      return {
        ...state,
        loading: false,
        categoriesById: {
          ...state.categoriesById,
          ...categoriesById,
        },
      };
    default:
      return state;
  }
};

export default complaintsReducer;
