import * as Yup from "yup";

const VALIDATION_SCHEMA = Yup.object().shape({
  purpose: Yup.object({
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
  khewats: Yup.string().required("This field is required."),
  landOwnerRegistry: Yup.string().matches(/^$|^[a-zA-Z0-9]+$/, "Please enter valid entry"),
  developerCompany: Yup.string().matches(/^$|^[a-zA-Z]+$/, "Please enter valid entry"),
  authSignature: Yup.string().matches(/^$|^[a-zA-Z]+$/, "Please enter valid entry"),
  nameAuthSign: Yup.string().matches(/^$|^[a-zA-Z]+$/, "Please enter valid entry"),
  registeringAuthority: Yup.string().matches(/^$|^[a-zA-Z]+$/, "Please enter valid entry"),
  editKhewats: Yup.string().matches(/^$|^[a-zA-Z0-9/]+$/, "Please enter valid entry"),

  consolidationType: Yup.string().nullable().required("This field is required."),
  collaboration: Yup.string().nullable().required("This field is required."),
});

export { VALIDATION_SCHEMA, MODAL_VALIDATION_SCHEMA };
