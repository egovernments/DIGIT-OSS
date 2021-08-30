import * as actionTypes from "./actionTypes";

const initialState = {
  BusinessServices: [],
};

const appReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_BUISNESS_SERVICE:
      return {
        ...state,
        BusinessServices: action.payload.BusinessServices,
      };

    default:
      return state;
  }
};
export default appReducer;
