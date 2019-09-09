import { SHOW_TOAST } from "./actionTypes";

const app = (store) => (next) => (action) => {
  const { type } = action;

  if (type === SHOW_TOAST) {
    const state = store.getState();
    const { toast } = state.app;
    // dispatch the action only if the intetipon
    if (
      (action.open && action.message && action.message.length) ||
      (toast.open && toast.message && toast.message.length && !action.open && (!action.message || !action.message.length))
    ) {
      next(action);
    }
    return;
  }
  next(action);
};

export default app;
