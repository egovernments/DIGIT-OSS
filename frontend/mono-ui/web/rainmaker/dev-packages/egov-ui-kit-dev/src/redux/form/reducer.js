import * as actionTypes from "./actionTypes";
import { validateField, getFormFields, getFiles } from "./utils";

const initialState = {};

const setFormProperty = (state, formKey, propertyKey, propertyValue) => {
  const form = state[formKey] || {};
  return { ...state, [formKey]: { ...form, [propertyKey]: propertyValue } };
};

const setFieldProperty = (state, formKey, fieldKey, propertyKey, propertyValue) => {
  const form = state[formKey] || {};
  const fields = form.fields || {};
  const field = fields[fieldKey] || {};
  return {
    ...state,
    [formKey]: {
      ...form,
      fields: {
        ...fields,
        [fieldKey]: { ...field, [propertyKey]: propertyValue },
      },
    },
  };
};

const displayFieldErrors = (state, formKey) => {
  const form = state[formKey] || {};
  const formFields = getFormFields(form);
  for (let key in formFields) {
    const field = formFields[key];
    const { errorText, isFieldValid } = validateField(field);
    if (!isFieldValid) {
      state = setFieldProperty(state, formKey, key, "errorText", errorText);
    }
  }
  return state;
};

const mergeFields = (oldFields = {}, newFields = {}) => {
  return Object.keys(newFields).reduce((mergedFields, fieldKey) => {
    mergedFields[fieldKey] = { ...oldFields[fieldKey], ...newFields[fieldKey] };
    return mergedFields;
  }, {});
};

const resetFields = (fields = {}) => {
  return Object.keys(fields).reduce((resetFields, fieldKey) => {
    if (fields && fields[fieldKey] && !fields[fieldKey].dontReset) {
      resetFields[fieldKey] = { ...fields[fieldKey], value: "" };
    } else {
      resetFields[fieldKey] = { ...fields[fieldKey] };
    }
    return resetFields;
  }, {});
};

const fileUploadStarted = (state, formKey, fieldKey, fileObject) => {
  const files = getFiles(state, formKey, fieldKey);
  return { ...state, [formKey]: { ...state[formKey], files: { [fieldKey]: files.concat({ ...fileObject, loading: true }) } } };
};
const fileUploadCompleted = (state, formKey, fieldKey, fileStoreId, fileName) => {
  const files = getFiles(state, formKey, fieldKey);
  return {
    ...state,
    [formKey]: {
      ...state[formKey],
      files: {
        [fieldKey]: files.map((fileObject) => (fileObject.file.name === fileName ? { ...fileObject, fileStoreId, loading: false } : fileObject)),
      },
    },
  };
};
// error message
const fileUploadError = (state, formKey, fieldKey, error, fileName) => {
  const files = getFiles(state, formKey, fieldKey);
  return {
    ...state,
    [formKey]: {
      ...state[formKey],
      files: {
        [fieldKey]: files.filter((fileObject) => fileObject.file.name !== fileName),
      },
    },
  };
};

const resetFiles = (state, formKey) => {
  return { ...state, [formKey]: { ...state[formKey], files: {} } };
};

const removeFile = (state, formKey, fieldKey, fileIndex) => {
  const files = getFiles(state, formKey, fieldKey);
  return { ...state, [formKey]: { ...state[formKey], files: { [fieldKey]: files.filter((f, index) => index !== fileIndex) } } };
};

const form = (state = initialState, action) => {
  const { type, formKey, fieldKey } = action;
  switch (type) {
    case actionTypes.INIT_FORM:
      const { name, ...form } = action.form;
      let currentForm = state[name] || {};
      const mergedFields = mergeFields(currentForm.fields, action.form.fields);
      return { ...state, [name]: { ...currentForm, ...form, fields: mergedFields } };
    case actionTypes.RESET_FORM:
      const oldForm = state[formKey] || {};
      const fieldsAfterReset = resetFields(oldForm.fields);
      return { ...state, [formKey]: { ...oldForm, fields: fieldsAfterReset } };
    case actionTypes.REMOVE_FORM:
      const currForm = state[formKey] || {};
      const newState = { ...state };
      delete newState[formKey];
      return { ...newState };
    case actionTypes.CLEAR_FORMS:
      return { ...initialState };
    case actionTypes.FIELD_CHANGE:
      const { value } = action;
      return setFieldProperty(state, formKey, fieldKey, "value", value);
    case actionTypes.SET_FIELD_PROPERTY:
      const { propertyName, propertyValue } = action;
      return setFieldProperty(state, formKey, fieldKey, propertyName, propertyValue);
    case actionTypes.VALIDATE_FIELD:
      const { errorText } = action;
      return setFieldProperty(state, formKey, fieldKey, "errorText", errorText);
    case actionTypes.VALIDATE_FORM:
      const { isFormValid } = action;
      return setFormProperty(state, formKey, "isFormValid", isFormValid);
    case actionTypes.SET_REDIRECTION:
      const { redirectionRoute } = action;
      return setFormProperty(state, formKey, "redirectionRoute", redirectionRoute);
    case actionTypes.DISPLAY_FORM_ERRORS:
      return displayFieldErrors(state, formKey);
    case actionTypes.SUBMIT_FORM_PENDING:
      return setFormProperty(state, formKey, "loading", true);
    case actionTypes.SUBMIT_FORM_COMPLETE:
      return setFormProperty(state, formKey, "loading", false);
    case actionTypes.SUBMIT_FORM_ERROR:
      state = setFormProperty(state, formKey, "loading", false);
      return setFormProperty(state, formKey, "error", true);
    // file related reducers
    case actionTypes.FILE_UPLOAD_STARTED:
      return fileUploadStarted(state, formKey, fieldKey, action.fileObject);
    case actionTypes.FILE_UPLOAD_COMPLETED:
      return fileUploadCompleted(state, formKey, fieldKey, action.fileStoreId, action.fileName);
    case actionTypes.FILE_UPLOAD_ERROR:
      return fileUploadError(state, formKey, fieldKey, action.error, action.fileName);
    case actionTypes.FILE_REMOVE:
      return removeFile(state, formKey, fieldKey, action.fileIndex);
    case actionTypes.RESET_FILES:
      return resetFiles(state, formKey);
    // end of file reducers
    case actionTypes.DELETE_FORM:
      const updatedState = { ...state };
      delete updatedState[formKey];
      return updatedState;
    case actionTypes.UPDATE_FORM:
      return {
        ...state,
        ...action.forms,
      };
    default:
      return state;
  }
};

export default form;
