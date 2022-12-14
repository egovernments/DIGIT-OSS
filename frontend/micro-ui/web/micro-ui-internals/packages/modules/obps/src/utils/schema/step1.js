import * as Yup from "yup";

const VALIDATION_SCHEMA = Yup.object().shape({
  // authorizedDeveloper: Yup.string().required("This field is mandatory."),
  // authorizedPerson: Yup.string().required("This field is mandatory."),
  // authorizedmobile: Yup.string().required("This field is mandatory."),
  // AlternateMobileNo: Yup.number().required("This field is mandatory."),
  // authorizedEmail: Yup.number().required("This field is mandatory."),
  // authorizedPan: Yup.number().max(6).required("This field is mandatory."),
  // authorizedAddress: Yup.string().required("This field is mandatory."),
  // village: Yup.string().required("This field is mandatory."),
  // authorizedPinCode: Yup.string().required("This field is mandatory."),
  // tehsil: Yup.object({
  //   value: Yup.string().required('This field is required'),
  // }),
  // district: Yup.string().required("This field is mandatory."),
  // state: Yup.string().required("This field is mandatory."),
  LC: Yup.string().required("This field is required."),
  notSigned: Yup.object({
    value: Yup.string().required("This field is required"),
  }),
  // notSigned: Yup.string().required("This field is mandatory."),
});

export { VALIDATION_SCHEMA };
