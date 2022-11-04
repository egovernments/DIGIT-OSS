import * as Yup from "yup";

const VALIDATION_SCHEMA = Yup.object().shape({
  // purposeDd: Yup.object({
  //     value: Yup.string().required('This field is required'),
  //   }),
  // potential: Yup.object({
  //   value: Yup.string().required('This field is required'),
  // }),
  // district: Yup.object({
  //   value: Yup.string().required('This field is required'),
  // }),
//   tehsil: Yup.object({
//     value: Yup.string().required('This field is required'),
//   }),
//   revenueEstate: Yup.object({
//     value: Yup.string().required('This field is required'),
//   }),
  // authorizedPan: Yup.number().max(6).required("This field is mandatory."),
  // authorizedAddress: Yup.string().required("This field is mandatory."),
  // village: Yup.string().required("This field is mandatory."),
  // authorizedPinCode: Yup.string().required("This field is mandatory."),
  // tehsil: Yup.object({
  //   value: Yup.string().required('This field is required'),
  // }),
  // district: Yup.string().required("This field is mandatory."),
  // state: Yup.string().required("This field is mandatory."),

});

export { VALIDATION_SCHEMA };
