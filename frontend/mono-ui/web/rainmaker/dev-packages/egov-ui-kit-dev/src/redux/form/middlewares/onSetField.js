import { SET_FIELD_PROPERTY } from "../actionTypes";
import { toggleSnackbarAndSetText } from "egov-ui-kit/redux/app/actions";
import get from "lodash/get";

const setFieldPropertyMiddleware = (store) => (next) => async (action) => {
  const { type } = action;
  const dispatch = store.dispatch;
  const state = store.getState();
  if (type === SET_FIELD_PROPERTY) {
    const { fieldKey, formKey } = action;
    try {
      const { updateOnSetField } = get(state, `form.${formKey}.fields.${fieldKey}`, {});
      if (updateOnSetField) {
        action = updateOnSetField(store, action);
      }
    } catch (error) {
      const { message } = error;
      dispatch(toggleSnackbarAndSetText(true, { labelName: message, labelKey: message },  "error"));
      return;
    }
  }
  next(action);
};

export default setFieldPropertyMiddleware;
