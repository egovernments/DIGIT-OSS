import * as Yup from "yup";

const VALIDATION_SCHEMA = Yup.object().shape({
  purpose: Yup.object({
    value: Yup.string().required("This field is required"),
  }),
});

const MODAL_VALIDATION_SCHEMA = Yup.object().shape({
  district: Yup.object({
    value: Yup.string().required("This field is required"),
  }),
  developmentPlan: Yup.object({
    value: Yup.string().required("This field is required"),
  }),
  potential: Yup.object({
    value: Yup.string().required("This field is required"),
  }),
  sector: Yup.object({
    value: Yup.string().required("This field is required"),
  }),
  tehsil: Yup.object({
    value: Yup.string().required("This field is required"),
  }),
  revenueEstate: Yup.object({
    value: Yup.string().required("This field is required"),
  }),
  rectangleNo: Yup.object({
    value: Yup.string().required("This field is required"),
  }),
  hadbastNo: Yup.string().max(99, "Too Long!").required("This field is required."),
  // landOwnerRegistry: Yup.string().max(99, "Too Long!").required("This field is required."),
  // developerCompany: Yup.string().max(20, "Too Long!").required("This field is required."),
  // authSignature: Yup.string().max(99, "Too Long!").required("This field is required."),
  // nameAuthSign: Yup.string().max(99, "Too Long!").required("This field is required."),

  khewats: Yup.string().max(99, "Too Long!").required("This field is required."),
  typeLand: Yup.object({
    value: Yup.string().required("This field is required"),
  }),
  // kanal: Yup.string().max(99, "Too Long!").required("This field is required."),
  // marla: Yup.string().max(99, "Too Long!").required("This field is required."),
  // sarsai: Yup.string().max(99, "Too Long!").required("This field is required."),
  // bigha: Yup.string().max(99, "Too Long!").required("This field is required."),
  // biswa: Yup.string().max(99, "Too Long!").required("This field is required."),
  // biswansi: Yup.string().max(99, "Too Long!").required("This field is required."),
  // developerCompany: Yup.string()
  //   .max(20, "Too Long!")
  //   .matches(/^[a-zA-Z_ ]+$/, "Please enter valid entry"),
  // authSignature: Yup.string()
  //   .max(99, "Too Long!")
  //   .matches(/^[a-zA-Z ]+$/, "Please enter valid entry"),
  // // authSignature: Yup.string().matches(/^$|^[a-zA-Z]+$/, "Please enter valid entry"),
  // nameAuthSign: Yup.string()
  //   .max(99, "Too Long!")
  //   .matches(/^[a-zA-Z ]+$/, "Please enter valid entry"),
  // registeringAuthority: Yup.string()
  //   .max(99, "Too Long!")
  //   .matches(/^[a-zA-Z ]+$/, "Please enter valid entry"),
  // editRectangleNo: Yup.string().matches(/^[0-9/ ]+$/, "Please enter valid entry"),
  // landOwnerRegistry: Yup.string().matches(/^[a-zA-Z_]+$/, "Please enter valid entry"),
  // editKhewats: Yup.string().matches(/^[0-9/ ]+$/, "Please enter valid entry"),
  // consolidationType: Yup.string().nullable().required("This field is required."),
  collaboration: Yup.string().nullable().required("This field is required."),
});

export { VALIDATION_SCHEMA, MODAL_VALIDATION_SCHEMA };
