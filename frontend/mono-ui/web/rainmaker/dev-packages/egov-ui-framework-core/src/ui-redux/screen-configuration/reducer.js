import * as screenActionTypes from "./actionTypes";
import { prepareFinalObject, updateObjectWithComponentJsonPath } from "./utils";

const intialState = {
  screenConfig: {},
  preparedFinalObject: { cityUpdateDialog: true },
  spinner: false,
  toastObject: {
    message: "",
    open: false,
    errorType: ""
  }
};

const screenConfiguration = (state = intialState, action) => {
  switch (action.type) {
    case screenActionTypes.INIT_SCREEN:
      return {
        ...state,
        screenConfig: {
          ...state.screenConfig,
          [action.screenKey]: {
            ...action.screenConfig
          }
        }
      };
    case screenActionTypes.UNMOUNT_SCREEN:
      state.screenConfig[action.screenKey]?delete state.screenConfig[action.screenKey]:{};
      return {
        ...state,
        screenConfig: {
          ...state.screenConfig,
        }
      };
    case screenActionTypes.HANDLE_SCREEN_CONFIGURATION_FIELD_CHANGE:
      let inputType = document.getElementsByTagName("input");
      for (let input in inputType) {
        if (inputType[input].type === "number") {
          inputType[input].addEventListener("mousewheel", function() {
            this.blur();
          });
        }
      }
      const updatedScreenConfig = updateObjectWithComponentJsonPath(
        state.screenConfig[action.screenKey],
        action.componentJsonpath,
        action.property,
        action.value
      );
      
      return {
        ...state,
        screenConfig: {
          ...state.screenConfig,
          [action.screenKey]: {
            ...updatedScreenConfig
          }
        }
      };

    case screenActionTypes.PREPARE_FINAL_OBJECT:
      const updatedPreparedFinalObject = prepareFinalObject(
        state.preparedFinalObject,
        action.jsonPath,
        action.value
      );
      return {
        ...state,
        preparedFinalObject: updatedPreparedFinalObject
      };
    case screenActionTypes.SHOW_NEW_TOAST:
      return {
        ...state,
        toastObject: {
          message: action.message,
          open: action.open,
          error: action.error
        }
      };
    case screenActionTypes.TOGGLE_LOADER:
      return {
        ...state,
        spinner: !state.spinner
      };
    case screenActionTypes.SHOW_LOADER:
      return {
        ...state,
        spinner: true
      };
    case screenActionTypes.HIDE_LOADER:
      return {
        ...state,
        spinner: false
      };
    default:
      return state;
  }
};

export default screenConfiguration;
