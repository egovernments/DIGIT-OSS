import { toggleSnackbarAndSetText } from "egov-ui-kit/redux/app/actions";
import { fetchDropdownData } from "egov-ui-kit/utils/commons";
import * as actionTypes from "../actionTypes";

const formValidation = (store) => (next) => (action) => {
  const { formKey, type, value, fieldKey } = action;
  const dispatch = store.dispatch;
  const state = store.getState();

  if (type === actionTypes.FIELD_CHANGE) {
    try {
      let hook = require(`config/forms/hooks/${formKey}`).default;
      hook = hook.fieldChange;
      if (hook && typeof hook === "function") {
        hook(fieldKey, formKey, value, state, dispatch);
      }
    } catch (e) {
      // the exceptions are assumed to be thrown only due to absence of a hook
    }
    const { form } = state;
    const { fields } = form[formKey];
    const { beforeFieldChange } = fields[fieldKey];
    if (beforeFieldChange) {
      action = beforeFieldChange({ action, dispatch, state });
    }

    //for populating dependent dropdowns.
    try {
      if (fields[fieldKey].dataFetchConfig && fields[fieldKey].dataFetchConfig.dependants) {
        const { dependants } = fields[fieldKey].dataFetchConfig;
        dependants.forEach((item) => {
          if (fields[item.fieldKey].dataFetchConfig) {
            if (fields[item.fieldKey].boundary) {
              // fields[
              //   item.fieldKey
              // ].dataFetchConfig.dataPath = `$.TenantBoundary.*.boundary[?(@.label=="City"&&@.code=="${value}")]..children[?(@.label=="Locality")]`;
              fields[item.fieldKey].dataFetchConfig.queryParams = [{ key: "tenantId", value: value }];
              fetchDropdownData(dispatch, fields[item.fieldKey].dataFetchConfig, formKey, item.fieldKey, state, true);
            } else {
              fetchDropdownData(dispatch, fields[item.fieldKey].dataFetchConfig, formKey, item.fieldKey);
            }
          }
        });
      }
    } catch (error) {
      const { message } = error;
      dispatch(toggleSnackbarAndSetText(true, { labelName: message, labelKey: message }, "error"));
      return;
    }
  }
  next(action);
};

export default formValidation;
