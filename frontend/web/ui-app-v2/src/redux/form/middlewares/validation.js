import * as actionTypes from "../actionTypes";
import { setFieldValidation } from "../actions";
import { validateField, getFormField } from "../utils";

const formValidation = (store) => (next) => (action) => {
  const { type, fieldKey, formKey } = action;
  const dispatch = store.dispatch;

  if (type == actionTypes.FIELD_CHANGE) {
    next(action);
    const state = store.getState();
    const form = state.form[formKey] || {};
    const field = getFormField(form, fieldKey);
    const { required, pattern } = field;
    if (pattern || required) {
      const validationObject = validateField(field);
      const { errorText } = validationObject;
      dispatch(setFieldValidation(formKey, fieldKey, errorText));
    }
  } else {
    next(action);
  }
};

export default formValidation;
