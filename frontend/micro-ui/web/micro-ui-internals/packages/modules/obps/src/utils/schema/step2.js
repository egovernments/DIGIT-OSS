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
});

const MODAL_VALIDATION_SCHEMA = Yup.object().shape({
  tehsil: Yup.object({
    value: Yup.string().required("This field is required"),
  }),
  revenueEstate: Yup.object({
    value: Yup.string().required("This field is required"),
  }),
  rectangleNo: Yup.object({
    value: Yup.string().required("This field is required"),
  }),
  hadbastNo: Yup.string().required("This field is required."),
  khewats: Yup.string().max(20).required("This field is required."),
  landOwner: Yup.string().required("This field is required."),
  consolidationType: Yup.string().nullable().required("This field is required."),
  collaboration: Yup.string().nullable().required("This field is required."),
});

export { VALIDATION_SCHEMA, MODAL_VALIDATION_SCHEMA };
