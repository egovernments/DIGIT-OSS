import { setFieldProperty } from "egov-ui-kit/redux/form/actions"

export const setDependentFields = (fields, dispatch, formKey, isEnabled,propertyId="hideField") => fields.forEach((fieldName) => {
  dispatch(setFieldProperty(formKey, fieldName, propertyId, isEnabled))
})
