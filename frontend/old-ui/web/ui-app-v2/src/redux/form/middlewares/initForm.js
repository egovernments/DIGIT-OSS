import { INIT_FORM } from "../actionTypes";
import { toggleSnackbarAndSetText } from "redux/app/actions";
import transform from "config/forms/transformers";

const initFormMiddleware = (store) => (next) => async (action) => {
  const { type } = action;
  const dispatch = store.dispatch;
  const state = store.getState();

  if (type === INIT_FORM) {
    const { form, recordData } = action;
    const { name: formKey } = form;
    let formData = null;
    try {
      formData = await transform("businessModelToViewModelTransformer", formKey, form, state, recordData);
      action.form = formData;
    } catch (error) {
      const { message } = error;
      dispatch(toggleSnackbarAndSetText(true, message, true));
      return;
    }
  }

  next(action);
};

export default initFormMiddleware;
