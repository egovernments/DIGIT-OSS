export const getSectionInfo = (formId, sectionId, defaultConfigCopy) => {
  let sectionInfo;
  let fieldToUpdate = { field: "", fields: [] };
  for (let section of defaultConfigCopy) {
    sectionInfo = section.form.find((formDetail) => {
      return formDetail.id === sectionId;
    });
    if (sectionInfo) {
      if (sectionInfo.fields) {
        for (let field of sectionInfo.fields) {
          if (field.id === formId) {
            fieldToUpdate.field = field;
            fieldToUpdate.fields = sectionInfo.fields;
            break;
          } else {
            if (field.fields) {
              for (let innerField of field.fields) {
                if (innerField.id === formId) {
                  fieldToUpdate.field = innerField;
                  fieldToUpdate.fields = field.fields;
                  break;
                }
              }
            }
          }
        }
      }
    }
  }
  return fieldToUpdate;
};

export const ifObjectContainsArray = (object) => {
  if (Array.isArray(object)) {
    return { hasArray: true, value: object };
  }
  for (const property in object) {
    if (object.hasOwnProperty(property)) {
      const element = object[property];
      if (Array.isArray(element)) {
        return { hasArray: true, value: element };
      }
    }
  }
  return { hasArray: false, value: [] };
};
