import * as actionTypes from "../constants/actionTypes";

const initialState = {
  isFetching: false,
  error: false,
  jobId: null,
  inputFile: null
};
const jobCreate = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.INITIATE_JOB_CREATE:
      return { ...state, isFetching: true, error: false };
    case actionTypes.JOB_CREATE_SUCCESS:
      return {
        ...state,
        jobId: action.jobId,
        inputFile: null,
        isFetching: false,
        error: false
      };
    case actionTypes.JOB_CREATE_FAILED:
      return { ...state, error: true, isFetching: false };
    case actionTypes.FILE_SELECTED:
      return { ...state, inputFile: action.file };

    default:
      return state;
  }
};
export default jobCreate;
