import * as screenActionTypes from "./actionTypes";
import {
  prepareFinalBodyData,
  prepareFinalQueryData,
  validateForm
} from "./utils";
import { httpRequest, loginRequest } from "../../ui-utils";
import { setRoute } from "../app/actions";

export const initScreen = (screenKey, screenConfig) => {
  return {
    type: screenActionTypes.INIT_SCREEN,
    screenKey,
    screenConfig
  };
};

export const toggleSnackbar = (open, message, error) => {
  return {
    type: screenActionTypes.SHOW_NEW_TOAST,
    open,
    message,
    error
  };
};

export const toggleSpinner = () => {
  return {
    type: screenActionTypes.TOGGLE_LOADER
  };
};

export const handleScreenConfigurationFieldChange = (
  screenKey,
  componentJsonpath,
  property,
  value
) => {
  return {
    type: screenActionTypes.HANDLE_SCREEN_CONFIGURATION_FIELD_CHANGE,
    screenKey,
    componentJsonpath,
    property,
    value
  };
};

export const prepareFinalObject = (jsonPath, value) => {
  return {
    type: screenActionTypes.PREPARE_FINAL_OBJECT,
    jsonPath,
    value
  };
};

export const submitForm = (
  screenKey,
  method,
  endpoint,
  action,
  redirectionUrl,
  bodyObjectsJsonPaths = [],
  queryObjectJsonPath = []
) => {
  return async (dispatch, getState) => {
    const state = getState();
    const { screenConfiguration } = state;
    const { screenConfig, preparedFinalObject } = screenConfiguration;
    const { [screenKey]: currentScreenConfig } = screenConfig;
    dispatch(toggleSpinner());
    if (validateForm(screenKey, currentScreenConfig.components, dispatch)) {
      try {
        let screenConfigResponse = {};
        // this will eventually moved out to the auth action; bit messy
        if (screenKey === "login") {
          const { body } = preparedFinalObject;
          const { mihy } = body;
          screenConfigResponse = await loginRequest(
            mihy.username,
            mihy.password
          );
        } else {
          let { body, query } = preparedFinalObject;
          let screenConfigBodyData = prepareFinalBodyData(
            body,
            bodyObjectsJsonPaths
          );
          let screenConfigQueryData = prepareFinalQueryData(
            query,
            queryObjectJsonPath
          );
          console.log(screenConfigQueryData);
          //preparing body data
          screenConfigResponse = await httpRequest(
            method,
            endpoint,
            action,
            [],
            screenConfigBodyData
          );
          console.log(screenConfigResponse);
        }
        dispatch(toggleSpinner());
        if (redirectionUrl) {
          dispatch(setRoute(redirectionUrl));
        }
      } catch (error) {
        dispatch(toggleSpinner());
        // const { message } = error;
        console.log(error);
        // throw new Error(error);
      }
    } else {
      dispatch(toggleSpinner());
    }
  };
};
