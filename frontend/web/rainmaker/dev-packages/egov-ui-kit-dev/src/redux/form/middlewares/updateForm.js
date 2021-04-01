import { UPDATE_FORM } from "../actionTypes";

const updateFormMiddleware = (store) => (next) => async (action) => {
  const { type } = action;
  const state = store.getState();

  if (type === UPDATE_FORM) {
    next(action);
    if (window.appOverrides) {
      window.appOverrides.updateForms(state.common.prepareFormData);
    }
    return;
  }

  next(action);
};

export default updateFormMiddleware;
