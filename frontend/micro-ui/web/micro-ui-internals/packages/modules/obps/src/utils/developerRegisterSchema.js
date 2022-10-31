import * as Yup from "yup";

const VALIDATION_SCHEMA = Yup.object().shape({
  
  addressLineOne: Yup.string().required("This field is mandatory."),

});

export { VALIDATION_SCHEMA };