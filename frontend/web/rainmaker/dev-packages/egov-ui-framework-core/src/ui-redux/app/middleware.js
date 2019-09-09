import { SHOW_TOAST } from "./actionTypes";

const app = store => next => action => {
  const { type } = action;

  if (type === SHOW_TOAST) {
    const state = store.getState();
    const { toastObject } = state.screenConfiguration;
    // dispatch the action only if the intetipon
    if (
      (action.open && action.message && action.message.length) ||
      (toastObject.open &&
        toastObject.message &&
        toastObject.message.length &&
        !action.open &&
        (!action.message || !action.message.length))
    ) {
      next(action);
    }
    return;
  }
  next(action);
};

export default app;
