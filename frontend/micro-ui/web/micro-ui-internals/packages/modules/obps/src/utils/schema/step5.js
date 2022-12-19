import * as Yup from "yup";

const VALIDATION_SCHEMA = Yup.object().shape({
  scrutinyFee: Yup.object({
    value: Yup.string().min(5).required("This field is required"),
  }),
  licNumber: Yup.string().nullable().required("This field is required."),
});

export { VALIDATION_SCHEMA };
