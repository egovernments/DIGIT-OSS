import * as actionTypes from "./actionTypes";
import { toggleSnackbarAndSetText } from "egov-ui-kit/redux/app/actions";
import { httpRequest, loginRequest, uploadFile } from "egov-ui-kit/utils/api";
import { FILE_UPLOAD } from "egov-ui-kit/utils/endPoints";
import { validateForm } from "./utils";
import transformer from "config/forms/transformers";
import { setUserObj } from "../../utils/localStorageUtils";

export const initForm = (form, recordData) => {
  return {
    type: actionTypes.INIT_FORM,
    form,
    recordData,
  };
};

export const resetForm = (formKey) => {
  return { type: actionTypes.RESET_FORM, formKey };
};

export const removeForm = (formKey) => {
  return { type: actionTypes.REMOVE_FORM, formKey };
};

export const handleFieldChange = (formKey, fieldKey, value) => {
  return {
    type: actionTypes.FIELD_CHANGE,
    formKey,
    fieldKey,
    value,
  };
};

export const displayFormErrors = (formKey) => {
  return { type: actionTypes.DISPLAY_FORM_ERRORS, formKey };
};

export const setFormValidation = (formKey, isFormValid) => {
  return { type: actionTypes.VALIDATE_FORM, isFormValid, formKey };
};

export const setFieldValidation = (formKey, fieldKey, errorText) => {
  return { type: actionTypes.VALIDATE_FIELD, formKey, fieldKey, errorText };
};

export const submitFormPending = (formKey) => {
  return { type: actionTypes.SUBMIT_FORM_PENDING, formKey };
};

export const submitFormComplete = (formKey, payload, saveUrl) => {
  return { type: actionTypes.SUBMIT_FORM_COMPLETE, formKey, payload };
};

export const submitFormError = (formKey, error) => {
  return { type: actionTypes.SUBMIT_FORM_ERROR, formKey, error };
};

export const submitForm = (formKey, saveUrl) => {
  return async (dispatch, getState) => {
    const state = getState();
    const form = state.form[formKey];
    if (form.loading) {
      return;
    }
    const isFormValid = validateForm(form);
    if (isFormValid) {
      dispatch(submitFormPending(formKey));
      const { action } = form;
      try {
        const formData = await transformer("viewModelToBusinessModelTransformer", formKey, form, state);
        let formResponse = {};
        // this will eventually moved out to the auth action; bit messy
        if (formData.hasOwnProperty("login")) {
          formResponse = await loginRequest(formData.login.username, formData.login.password, "", "password", "", "CITIZEN");
        } else if (formData.hasOwnProperty("employee")) {
          formResponse = await loginRequest(
            formData.employee.username,
            formData.employee.password,
            "",
            "password",
            formData.employee.tenantId,
            "EMPLOYEE"
          );
        } else {
          formResponse = await httpRequest(saveUrl, action, [], formData);
        }
        if(saveUrl=="/user/citizen/_create"&&formResponse&&formResponse.hasOwnProperty("UserRequest")){
          setUserObj(JSON.stringify(formResponse.UserRequest));
        }
        dispatch(submitFormComplete(formKey, formResponse, saveUrl));
      } catch (error) {
        const { message } = error;
        // throw new Error(error);
        dispatch(submitFormError(formKey, message));
        dispatch(toggleSnackbarAndSetText(true, { labelName: message, labelKey: message }, "error"));
      }
    } else {
      dispatch(displayFormErrors(formKey));
    }
  };
};

// file actions
const fileUploadPending = (formKey, fieldKey, fileObject) => {
  return { type: actionTypes.FILE_UPLOAD_STARTED, formKey, fieldKey, fileObject };
};

// for profile if a file exists, dispatch
const fileUploadCompleted = (formKey, fieldKey, fileStoreId, fileName) => {
  return { type: actionTypes.FILE_UPLOAD_COMPLETED, formKey, fieldKey, fileStoreId, fileName };
};

const fileUploadError = (formKey, fieldKey, error, fileName) => {
  return { type: actionTypes.FILE_UPLOAD_ERROR, formKey, fieldKey, error, fileName };
};

export const removeFile = (formKey, fieldKey, fileIndex) => {
  return { type: actionTypes.FILE_REMOVE, fieldKey, formKey, fileIndex };
};

export const resetFiles = (formKey) => {
  return { type: actionTypes.RESET_FILES, formKey };
};

// currently supports only single file upload at a time, although the API has support for multiple file upload
// TODO : can the upload happen at a later point in time? Challenge is to intimate the user if in case of a failure
export const fileUpload = (formKey, fieldKey, fileObject, ulbLevel) => {
  const { name: fileName } = fileObject.file;
  return async (dispatch, getState) => {
    dispatch(fileUploadPending(formKey, fieldKey, fileObject));
    try {
      const fileStoreId = await uploadFile(FILE_UPLOAD.POST.URL, fileObject.module, fileObject.file, ulbLevel);
      dispatch(fileUploadCompleted(formKey, fieldKey, fileStoreId, fileName));
    } catch (error) {
      dispatch(fileUploadError(formKey, fieldKey, error.message, fileName));
      dispatch(toggleSnackbarAndSetText(true, { labelName: error.message, labelKey: error.message }, "error"));
    }
  };
};

export const setFieldProperty = (formKey, fieldKey, propertyName, propertyValue) => {
  return { type: actionTypes.SET_FIELD_PROPERTY, formKey, fieldKey, propertyName, propertyValue };
};

export const deleteForm = (formKey) => ({
  type: actionTypes.DELETE_FORM,
  formKey,
});

export const updateForms = (forms) => ({
  type: actionTypes.UPDATE_FORM,
  forms,
});

export const clearForms = () => {
  return {
    type: actionTypes.CLEAR_FORMS,
  };
};
