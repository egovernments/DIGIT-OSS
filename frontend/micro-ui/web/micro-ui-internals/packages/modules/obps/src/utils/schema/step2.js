import * as Yup from "yup";

const VALIDATION_SCHEMA = Yup.object().shape({
  purpose: Yup.object({
    value: Yup.string().required("This field is required"),
  }),
  potential: Yup.object({
    value: Yup.string().required("This field is required"),
  }),
  district: Yup.object({
    value: Yup.string().required("This field is required"),
  }),
  khewats: Yup.string().required("This field is required."),
});

export { VALIDATION_SCHEMA };
