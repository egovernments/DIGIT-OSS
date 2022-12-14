import * as Yup from "yup";

const VALIDATION_SCHEMA = Yup.object().shape({
  licenseNumber: Yup.string()
    .max(20)
    .matches(/^[^\s][a-zA-Z0-9\s]+$/, "Please enter valid input")
    .required("This field is required."),
});

export { VALIDATION_SCHEMA };
