import * as actionTypes from "../constants/actionTypes";
import { Api } from "../api";

export const initiateCreateJob = () => {
  return { type: actionTypes.INITIATE_JOB_CREATE };
};

export const jobCreated = jobId => {
  return { type: actionTypes.JOB_CREATE_SUCCESS, jobId };
};

export const createJobFailed = error => {
  return { type: actionTypes.JOB_CREATE_FAILED, error };
};

export const setInputFile = file => {
  return { type: actionTypes.FILE_SELECTED, file };
};

// upload the input file, then use the file store id to create the job
export const createJob = (moduleName, definitionName, file) => {
  return async (dispatch, getState) => {
    dispatch(initiateCreateJob());
    try {
      // first upload the file
      const requestFilePath = await Api().uploadFile(moduleName, file);
      const requestFileName = file.name;
      //create a request for job create
      const jobId = await Api().createJob(
        requestFilePath,
        requestFileName,
        moduleName,
        definitionName
      );
      dispatch(jobCreated(jobId));
    } catch (error) {
      //handle the error
      dispatch(createJobFailed(error));
      console.log(error);
    }
  };
};
