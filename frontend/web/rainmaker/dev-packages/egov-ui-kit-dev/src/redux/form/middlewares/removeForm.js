import { REMOVE_FORM } from "../actionTypes";
import { toggleSnackbarAndSetText } from "egov-ui-kit/redux/app/actions";
import { prepareFormData } from "egov-ui-kit/redux/common/actions";

const removeFormMiddleware = (store) => (next) => async (action) => {
  const { type, formKey } = action;
  const dispatch = store.dispatch;
  const state = store.getState();
  const { form } = state;
  if (type === REMOVE_FORM) {
    try {
      //To remove unit from prepareFormData
      if (formKey.startsWith(`floorDetails_`)) {
        const unitForm = form[formKey] || {};
        const fields = unitForm && unitForm.fields;
        const jsonPath = Object.values(fields)[0].jsonPath;
        const unitIndex = jsonPath.split("units[")[1].split("].")[0];
        dispatch(prepareFormData(`Properties[0].propertyDetails[0].units[${unitIndex}]`, null));
      }

      if (window.appOverrides) {
        window.appOverrides.resetForm(formKey);
      }
    } catch (error) {
      const { message } = error;
      // dispatch(toggleSnackbarAndSetText(true, { labelName: message, labelKey: message },   "error"));
      return;
    }
  }

  next(action);
};

export default removeFormMiddleware;
