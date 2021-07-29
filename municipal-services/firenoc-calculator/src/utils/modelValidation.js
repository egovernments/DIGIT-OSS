const Ajv = require("ajv");
const ajv = new Ajv({ allErrors: true });
import {
  BillingSlabReq,
  CalculationReq,
  BillingSlabSearch,
  getBillReq
} from "../model/validationReq.js";

export const validateBillingSlabReq = data => {
  let validate = ajv.compile(BillingSlabReq);
  var valid = validate(data);
  let errors = [];
  if (!valid) {
    errors = validate.errors;
  }
  return errors;
};

export const validateCalculationReq = data => {
  let validate = ajv.compile(CalculationReq);
  var valid = validate(data);
  let errors = [];
  if (!valid) {
    errors = validate.errors;
  }
  return errors;
};

export const validateBillingSlabSearch = data => {
  let validate = ajv.compile(BillingSlabSearch);
  var valid = validate(data);
  let errors = [];
  if (!valid) {
    errors = validate.errors;
  }
  return errors;
};

export const validateBillReq = data => {
  let validate = ajv.compile(getBillReq);
  var valid = validate(data);
  let errors = [];
  if (!valid) {
    errors = validate.errors;
  }
  return errors;
};

// export const validateFireNOCSearchModel = data => {
//   let validate = ajv.compile(fireNOCSearchSchema);
//   var valid = validate(data);
//   let errors = [];
//   if (!valid) {
//     errors = validate.errors;
//   }
//   return errors;
// };
