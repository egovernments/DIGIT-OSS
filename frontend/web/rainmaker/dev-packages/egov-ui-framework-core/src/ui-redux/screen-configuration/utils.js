import {
  prepareFinalObject as prepareFO,
  handleScreenConfigurationFieldChange as handleField
} from "./actions";
import set from "lodash/set";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import {getLocaleLabels} from "egov-ui-framework/ui-utils/commons.js";

export const validateField = field => {
  const {
    required,
    pattern,
    minLength,
    maxLength,
    minValue,
    maxValue,
    visible,
    isDOB,
    maxDate
  } = field;

  if (visible !== undefined && !visible) {
    return { isFieldValid: true, errorText: "" };
  }

  const fieldValue = field.value;
  const value = fieldValue
    ? typeof fieldValue === "string"
      ? fieldValue.trim()
      : fieldValue
    : null;
  let errorText = "",
    isFieldValid = true,
    fieldLength = 0;

  if (required && !value) {
    isFieldValid = false;
    
    errorText = field.requiredMessage ||getLocaleLabels("REQUIRED_FIELD","REQUIRED_FIELD");
  }

  if (value) {
    fieldLength = value.length;
  }

  if (
    isFieldValid &&
    fieldLength &&
    pattern &&
    !new RegExp(pattern).test(value)
  ) {
    isFieldValid = false;
  }
  if (
    isFieldValid &&
    minLength &&
    maxLength &&
    !(fieldLength >= minLength && fieldLength <= maxLength)
  ) {
    isFieldValid = false;
  }
  if (
    isFieldValid &&
    minValue &&
    maxValue &&
    !(value >= minValue && value <= maxValue)
  ) {
    isFieldValid = false;
  }

  if (isDOB) {
    if (value) {
      let currentDate = maxDate ? new Date(maxDate).getTime() : new Date().getTime();
      let ownerDOB = new Date(value).getTime();
      if (ownerDOB > currentDate) {
        isFieldValid = false;
      }
    }
  }

  errorText = !isFieldValid
    ? errorText.length
      ? errorText
      : field.errorMessage || "Invalid field"
    : "";

  return { isFieldValid, errorText };
};

export const validateForm = (screenKey, components, dispatch) => {
  let isFormValid = true;
  const travelComponents = components => {
    for (var variable in components) {
      if (components.hasOwnProperty(variable)) {
        if (
          components[variable].children &&
          !isEmpty(components[variable].children)
        ) {
          travelComponents(components[variable].children);
        } else {
          if (
            components[variable].jsonPath &&
            !validate(screenKey, components[variable], dispatch)
          ) {
            isFormValid = false;
          }
        }
      }
    }
  };
  travelComponents(components);
  return isFormValid;
};

export const validate = (
  screenKey,
  componentObject,
  dispatch,
  skipPrepareFormData = false
) => {
  const validatedObject = validateField(componentObject);
  let isFormValid = true;
  if (!skipPrepareFormData) {
    dispatch(prepareFO(componentObject.jsonPath, componentObject.value));
  }
  if (componentObject.jsonPath && validatedObject.isFieldValid) {
    if (!componentObject.isFieldValid) {
      isFormValid = true;
      dispatch(
        handleField(
          screenKey,
          `${componentObject.componentJsonpath}.props`,
          "error",
          false
        )
      );
      dispatch(
        handleField(
          screenKey,
          `${componentObject.componentJsonpath}.props`,
          "helperText",
          validatedObject.errorText
        )
      );
      dispatch(
        handleField(
          screenKey,
          `${componentObject.componentJsonpath}`,
          "isFieldValid",
          true
        )
      );
    }
  } else {
    isFormValid = false;
    dispatch(
      handleField(
        screenKey,
        `${componentObject.componentJsonpath}.props`,
        "error",
        true
      )
    );
    dispatch(
      handleField(
        screenKey,
        `${componentObject.componentJsonpath}.props`,
        "helperText",
        validatedObject.errorText
      )
    );
    dispatch(
      handleField(
        screenKey,
        `${componentObject.componentJsonpath}`,
        "isFieldValid",
        false
      )
    );
  }
  return isFormValid;
};

export const updateObjectWithComponentJsonPath = (
  screenConfig,
  componentJsonpath,
  property,
  value
) => {
  set(screenConfig, `${componentJsonpath}.${property}`, value);
  return screenConfig;
};

export const prepareFinalObject = (preparedFinalOject, jsonPath, value) => {
  set(preparedFinalOject, jsonPath, value);
  return preparedFinalOject;
};

export const prepareFinalBodyData = (body, bodyObjectsJsonPaths) => {
  let screenConfigBodyData = {};
  if (bodyObjectsJsonPaths.length > 0) {
    for (var i = 0; i < bodyObjectsJsonPaths.length; i++) {
      let object = get(body, bodyObjectsJsonPaths[i]);
      screenConfigBodyData = {
        ...screenConfigBodyData,
        object
      };
    }
  } else {
    screenConfigBodyData = {
      ...body
    };
  }
  return screenConfigBodyData;
};

export const prepareFinalQueryData = (query, queryObjectJsonPath) => {
  let screenConfigQueryData = [];
  if (queryObjectJsonPath.length > 0) {
    for (var i = 0; i < queryObjectJsonPath.length; i++) {
      let object = get(query, queryObjectJsonPath[i]);
      screenConfigQueryData = [...screenConfigQueryData, object];
    }
  } else {
    screenConfigQueryData = {
      ...query
    };
  }
  return screenConfigQueryData;
};
