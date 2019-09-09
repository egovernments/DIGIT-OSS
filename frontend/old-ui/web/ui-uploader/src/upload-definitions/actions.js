import * as actionTypes from "../constants/actionTypes";
import { Api } from "../api";

export const moduleSelected = moduleName => {
  return { type: actionTypes.MODULE_SELECTED, moduleName };
};

export const moduleDefinitionSelected = moduleDefinition => {
  return { type: actionTypes.MOUDULE_DEFINITION_SELECTED, moduleDefinition };
};

export const initiateUploadDefinitionsFetch = () => {
  return { type: actionTypes.INITIATE_UPLOAD_DEFINITIONS_FETCH };
};

export const uploadDefinitionsReceived = (uploadDefinitions = []) => {
  return { type: actionTypes.UPLOAD_DEFINTIONS_RECEIVED, uploadDefinitions };
};

export const fetchUploadDefinitionsFailed = error => {
  return { type: actionTypes.FETCH_UPLOAD_DEFINITIONS_FAILURE, error };
};

export const fetchUploadDefinitions = () => {
  return async (dispatch, getState) => {
    dispatch(initiateUploadDefinitionsFetch());
    try {
      const uploadDefinitions = await Api().fetchUploadDefintions();
      dispatch(uploadDefinitionsReceived(uploadDefinitions));
    } catch (error) {
      //handle the error
      console.log(error);
      dispatch(fetchUploadDefinitionsFailed(error));
    }
  };
};
