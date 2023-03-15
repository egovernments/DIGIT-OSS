export const validateField = (field) => {
  const { required, pattern, minLength, maxLength, minValue, maxValue,hideField } = field;

  if (hideField) {
    return { isFieldValid:true, errorText:"" };
  }

  const value = field.value ? (typeof field.value === "string" ? field.value.trim() : field.value) : null;
  let errorText = "",
    isFieldValid = true,
    fieldLength = 0;

  if (required && !value) {
    isFieldValid = false;
    errorText = field.requiredmessage;
  }

  if (value) {
    fieldLength = value.length;
  }

  if (isFieldValid && fieldLength && pattern && !new RegExp(pattern).test(value)) {
    isFieldValid = false;
  }
  if (isFieldValid && minLength && maxLength && !(fieldLength >= minLength && fieldLength <= maxLength)) {
    isFieldValid = false;
  }
  if (isFieldValid && minValue && maxValue && !(value >= minValue && value <= maxValue)) {
    isFieldValid = false;
  }

  errorText = !isFieldValid ? (errorText.length ? errorText : field.errorMessage) : "";

  return { isFieldValid, errorText };
};

export const validateForm = (form) => {
  let isFormValid = true;
  const formFields = getFormFields(form);
  for (let key in formFields) {
    const field = formFields[key];
    if (!validateField(field, field.value).isFieldValid) {
      isFormValid = false;
      break;
    }
  }
  return isFormValid;
};

export const getFormFields = (form) => {
  return form.fields || {};
};

export const getFormField = (form, fieldKey) => {
  const fields = getFormFields(form);
  return fields[fieldKey];
};

export const getFormFieldFiles = (form, formKey, fieldKey) => {
  let currentFiles = form[formKey].fields[fieldKey];
  currentFiles = currentFiles && currentFiles.value ? currentFiles.value : [];
  return currentFiles;
};

export const getFiles = (form, formKey, fieldKey) => {
  form = form[formKey] || {};
  const files = form.files && form.files[fieldKey] ? form.files[fieldKey] : [];
  return files;
};
