import * as actionTypes from "../actionTypes";
import { setFieldValidation } from "../actions";
import { validateField, getFormField } from "../utils";

const formValidation = (store) => (next) => (action) => {
  const { formKey, type } = action;
  const dispatch = store.dispatch;
  const state = store.getState();

  if (type === actionTypes.FIELD_CHANGE) {
    try {
      let hook = require(`config/forms/hooks/${formKey}`).default;
      hook = hook.fieldChange;
      if (hook && typeof hook === "function") {
        const { fieldKey, value } = action;
        hook(fieldKey, formKey, value, state, dispatch);
      }
    } catch (e) {
      // the exceptions are assumed to be thrown only due to absence of a hook
    }
  }
  next(action);
};

export default formValidation;
