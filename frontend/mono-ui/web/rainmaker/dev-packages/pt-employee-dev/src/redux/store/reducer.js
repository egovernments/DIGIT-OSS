import { DOCUMENT_TYPES_MDMS_SUCCESS } from "rainmaker-employee/src/redux/store/actionTypes";

const initialState = {
  mdms: {}
};

const employeeReducer = (state = initialState, action) => {
  switch (action.type) {
    case DOCUMENT_TYPES_MDMS_SUCCESS:
      return {
        ...state,
        mdms: {
          ...state.mdms,
          document: {
            ...action.data
          }
        }
      };
    default:
      return state;
  }
};

export default employeeReducer;
