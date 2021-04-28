import * as actionTypes from "../actionTypes";
import { ADD_LOCALIZATION } from "egov-ui-kit/redux/app/actionTypes";
import { transformLocalizationLabels, getTranslatedLabel } from "egov-ui-kit/utils/commons";
import { initForm } from "../actions";

const translatedFormFields = (localizationLabels, form) => {
  let { fields } = form;
  fields =
    fields &&
    Object.keys(fields).reduce((translatedField, fieldKey) => {
      const field = Object.keys(fields[fieldKey]).reduce((field, fieldName) => {
        let fieldValue = fields[fieldKey][fieldName];
        if (fieldName === "hintText" || fieldName === "floatingLabelText" || fieldName === "errorMessage") {
          fieldValue = getTranslatedLabel(fieldValue, localizationLabels);
        }
        field[fieldName] = fieldValue;
        return field;
      }, {});

      // a bit hacky; instead of asking user to write it in config putting it here; other way to do it would be to iterate through fields which have required and add this field dynamically
      field["requiredmessage"] = getTranslatedLabel("CORE_COMMON_REQUIRED_ERRMSG", localizationLabels);
      translatedField[fieldKey] = field;

      return translatedField;
    }, {});

  let submit = {};

  if (form.submit && form.submit.label) {
    const label = getTranslatedLabel(form.submit.label, localizationLabels);
    submit = { ...form.submit, label };
  }
  return { ...form, fields, submit };
};

const translateFieldText = (store) => (next) => (action) => {
  const { type, form } = action;
  const state = store.getState();
  let { localizationLabels } = state.app;

  if (type === ADD_LOCALIZATION) {
    const newState = store.getState();
    const localizationLabels = transformLocalizationLabels(action.localizationLabels);
    const { form: forms } = newState;
    Object.keys(forms).forEach((formKey) => {
      let translatedForm = translatedFormFields(localizationLabels, forms[formKey]);
      translatedForm = { ...translatedForm, name: formKey };
      store.dispatch(initForm(translatedForm));
    });
    action.localizationLabels = localizationLabels;
  }
  if (type === actionTypes.INIT_FORM) {
    action.form = translatedFormFields(localizationLabels, form);
  }
  next(action);
};

export default translateFieldText;
