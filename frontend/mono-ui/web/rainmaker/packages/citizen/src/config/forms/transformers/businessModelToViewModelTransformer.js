const transformer = (formKey, form, state, recordData) => {
  const transformers = {
    profile: () => {
      const { userInfo } = state.auth;
      const { name, emailId, permanentCity, tenantId, photo: imageUri } = userInfo;
      const transformedForm = {
        ...form,
        fields: {
          ...form.fields,
          email: { ...form.fields.email, value: emailId || "" },
          city: { ...form.fields.city, value: permanentCity || tenantId },
          name: { ...form.fields.name, value: name },
        },
        files: {
          ["photo"]: [
            {
              imageUri,
            },
          ],
        },
      };
      return transformedForm;
    },
    profileEmployee: () => {
      const { userInfo } = state.auth;
      const { name, mobileNumber, emailId, photo: imageUri } = userInfo;

      const transformedForm = {
        ...form,
        fields: {
          ...form.fields,
          email: { ...form.fields.email, value: emailId || "" },
          phonenumber: { ...form.fields.phonenumber, value: mobileNumber },
          name: { ...form.fields.name, value: name },
        },
        files: {
          ["photo"]: [
            {
              imageUri,
            },
          ],
        },
      };

      return transformedForm;
    },
  };

  if (formKey in transformers) {
    try {
      return transformers[formKey]();
    } catch (error) {
      throw new Error(error.message);
    }
  }
  return form;
};

export default transformer;
